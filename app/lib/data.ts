import { Pool } from 'pg';

// Use this as createPool for compatibility with the rest of your code
const createPool = (config: any) => new Pool(config);
import { 
  Revenue,
  LatestInvoiceRaw,
  InvoicesTable,
  InvoiceForm,
  TenantsTableType,
  TenantField
} from './types';
import { useCurrency } from '@/app/context/currency-context';
import { formatCurrency } from '@/app/lib/utils';
import { tenants, invoices, revenue, users } from './placeholder-data';

// Configure local database connection
// These can also be set as environment variables
const localDbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  max: 5, // Maximum number of clients in the pool
  connectionTimeoutMillis: 10000, // Connection timeout
};

// Log connection info for debugging (remove in production)
console.log('Database connection string exists:', !!process.env.DATABASE_URL);

// Create a custom pool for local development
const db = createPool(localDbConfig);

// Helper function to execute SQL queries
async function executeQuery(query: string, params: any[] = []) {
  if (!process.env.DATABASE_URL) {
    console.log('Database connection string not provided, using placeholder data');
    throw new Error('Database connection string not provided');
  }
  
  try {
    const result = await db.query(query, params);
    return result;
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  }
}

const ITEMS_PER_PAGE = 6;

export async function fetchRevenue() {
  try {
    const data = await executeQuery(`
      SELECT month, SUM(revenue) AS total_revenue
      FROM revenue
      GROUP BY month
      ORDER BY month ASC
      LIMIT 12
    `);
    console.log('Revenue data fetched:', data.rows);

    // Reverse the data to display the oldest month first
    return data.rows.reverse();
  } catch (error) {
    console.log('Using placeholder revenue data');
    // Return placeholder revenue data
    return [
      { month: 'Jan', total_revenue: 2000 },
      { month: 'Feb', total_revenue: 1800 },
      { month: 'Mar', total_revenue: 2200 },
      { month: 'Apr', total_revenue: 2500 },
      { month: 'May', total_revenue: 2300 },
      { month: 'Jun', total_revenue: 3200 },
      { month: 'Jul', total_revenue: 3500 },
      { month: 'Aug', total_revenue: 3700 },
      { month: 'Sep', total_revenue: 2500 },
      { month: 'Oct', total_revenue: 2800 },
      { month: 'Nov', total_revenue: 3000 },
      { month: 'Dec', total_revenue: 8000 },
    ];
  }
}

export async function fetchLatestInvoices() {
  try {
    // Check if tables exist first
    const tableCheck = await executeQuery(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'invoice'
      ) AND EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'tenant'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.error('Tables "invoice" or "tenant" do not exist in the database');
      return [];
    }
    
    const data = await executeQuery(`
      SELECT invoice.amount, tenant.name, tenant.image_url, tenant.email, invoice.id
      FROM invoice
      JOIN tenant ON invoice.tenant_id = tenant.id
      ORDER BY invoice.date DESC
      LIMIT 5
    `);

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    
    return latestInvoices;
  } catch (error) {
    console.log('Using placeholder latest invoices data');
    // Return placeholder latest invoices with formatted amounts
    return invoices.slice(0, 5).map((invoice) => ({
      id: invoice.id,
      name: invoice.name,
      email: invoice.email,
      image_url: invoice.image_url,
      amount: formatCurrency(invoice.amount),
    }));
  }
}

export async function fetchCardData() {
  try {
    const [invoiceCount, tenantCount, invoiceStatus] = await Promise.all([
      executeQuery('SELECT COUNT(*) FROM invoice'),
      executeQuery('SELECT COUNT(*) FROM tenant'),
      executeQuery(`SELECT
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
        FROM invoice`)
    ]);

    const numberOfInvoices = Number(invoiceCount.rows[0].count ?? '0');
    const numberOfTenants = Number(tenantCount.rows[0].count ?? '0');
    const totalPaidInvoices = invoiceStatus.rows[0].paid ?? 0;
    const totalPendingInvoices = invoiceStatus.rows[0].pending ?? 0;

    return {
      numberOfTenants,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.log('Using placeholder card data');
    // Calculate stats from placeholder invoices
    const placeholderInvoices = invoices;
    const paidInvoices = placeholderInvoices.filter(inv => inv.status === 'paid');
    const pendingInvoices = placeholderInvoices.filter(inv => inv.status === 'pending');
    
    return {
      numberOfTenants: tenants.length,
      numberOfInvoices: placeholderInvoices.length,
      totalPaidInvoices: paidInvoices.reduce((sum, inv) => sum + inv.amount, 0),
      totalPendingInvoices: pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0),
    };
  }
}

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoicesData = await executeQuery(`
      SELECT
        invoice.id,
        invoice.amount,
        invoice.date,
        invoice.status,
        tenant.name,
        tenant.email,
        tenant.image_url
      FROM invoice
      JOIN tenant ON invoice.tenant_id = tenant.id
      WHERE
        tenant.name ILIKE $1 OR
        tenant.email ILIKE $1 OR
        invoice.amount::text ILIKE $1 OR
        invoice.date::text ILIKE $1 OR
        invoice.status ILIKE $1
      ORDER BY invoice.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET $2
    `, [`%${query}%`, offset]);

    return invoicesData.rows;
  } catch (error) {
    console.log('Using placeholder filtered invoices data');
    // Filter placeholder invoices based on query
    const lowerQuery = query.toLowerCase();
    const filtered = invoices.filter(inv => 
      inv.name.toLowerCase().includes(lowerQuery) ||
      inv.email.toLowerCase().includes(lowerQuery) ||
      inv.amount.toString().includes(lowerQuery) ||
      inv.date.includes(lowerQuery) ||
      inv.status.toLowerCase().includes(lowerQuery)
    );
    
    // Apply pagination
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedInvoices = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    
    return paginatedInvoices.map(inv => ({
      id: inv.id,
      amount: inv.amount,
      date: inv.date,
      status: inv.status,
      name: inv.name,
      email: inv.email,
      image_url: inv.image_url,
    }));
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await executeQuery(`
      SELECT COUNT(*)
      FROM invoice
      JOIN tenant ON invoice.tenant_id = tenant.id
      WHERE
        tenant.name ILIKE $1 OR
        tenant.email ILIKE $1 OR
        invoice.amount::text ILIKE $1 OR
        invoice.date::text ILIKE $1 OR
        invoice.status ILIKE $1
    `, [`%${query}%`]);

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.log('Using placeholder invoice pages count');
    // Count pages from placeholder data
    const lowerQuery = query.toLowerCase();
    const filtered = invoices.filter(inv => 
      inv.name.toLowerCase().includes(lowerQuery) ||
      inv.email.toLowerCase().includes(lowerQuery) ||
      inv.amount.toString().includes(lowerQuery) ||
      inv.date.includes(lowerQuery) ||
      inv.status.toLowerCase().includes(lowerQuery)
    );
    
    return Math.ceil(filtered.length / ITEMS_PER_PAGE);
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await executeQuery(`
      SELECT
        invoice.id,
        invoice.tenant_id,
        invoice.amount,
        invoice.status
      FROM invoice
      WHERE invoice.id = $1
    `, [id]);

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars if needed
      amount: invoice.amount / 100,
    }));
    
    return invoice[0];
  } catch (error) {
    console.log('Using placeholder invoice by id');
    // Find invoice in placeholder data
    const invoice = invoices.find(inv => inv.id === id);
    if (invoice) {
      return {
        id: invoice.id,
        tenant_id: invoice.tenant_id,
        amount: invoice.amount / 100, // Convert from cents to dollars
        status: invoice.status
      };
    }
    return null;
  }
}

export async function fetchTenants() {
  try {
    const data = await executeQuery(`
      SELECT
        tenant.id,
        user.name,
        user.email,
        user.image,
        tenant.property_id,
        tenant.move_in_date,
        tenant.unit_occupied,
        tenant.emergency_contact
      FROM tenant
      JOIN user ON tenant.user_id = user.id
      ORDER BY user.name ASC
    `);

    const tenantsData = data.rows;
    return tenantsData;
  } catch (err) {
    console.log('Using placeholder tenants data');
    // Return placeholder tenants
    return tenants.map(tenant => ({
      id: tenant.id,
      name: tenant.name,
      email: tenant.email,
      image: tenant.image_url,
      property_id: null,
      move_in_date: null,
      unit_occupied: null,
      emergency_contact: null,
    }));
  }
}

export async function fetchFilteredTenants(query: string) {
  try {
    const data = await executeQuery(`
      SELECT
        tenant.id,
        user.name,
        user.email,
        user.image,
        COUNT(invoice.id) AS total_invoices,
        SUM(CASE WHEN invoice.status = 'pending' THEN invoice.amount ELSE 0 END) AS total_pending,
        SUM(CASE WHEN invoice.status = 'paid' THEN invoice.amount ELSE 0 END) AS total_paid
      FROM tenant
      JOIN user ON tenant.user_id = user.id
      LEFT JOIN invoice ON tenant.id = invoice.tenant_id
      WHERE
        user.name ILIKE $1 OR
        user.email ILIKE $1 OR
        tenant.unit_occupied ILIKE $1
      GROUP BY tenant.id, user.name, user.email, user.image
      ORDER BY user.name ASC
    `, [`%${query}%`]);

    const tenants = data.rows.map((tenant) => ({
      ...tenant,
      total_pending: formatCurrency(tenant.total_pending),
      total_paid: formatCurrency(tenant.total_paid),
    }));

    return tenants;
  } catch (err) {
    console.log('Using placeholder filtered tenants data');
    // Filter placeholder tenants based on query
    const lowerQuery = query.toLowerCase();
    const filtered = tenants.filter(tenant => 
      tenant.name.toLowerCase().includes(lowerQuery) ||
      tenant.email.toLowerCase().includes(lowerQuery) ||
      (tenant.phone && tenant.phone.includes(lowerQuery))
    );
    
    return filtered.map(tenant => {
      // Find related invoices
      const tenantInvoices = invoices.filter(inv => inv.tenant_id === tenant.id);
      const totalPending = tenantInvoices
        .filter(inv => inv.status === 'pending')
        .reduce((sum, inv) => sum + inv.amount, 0);
      const totalPaid = tenantInvoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.amount, 0);
      
      return {
        id: tenant.id,
        name: tenant.name,
        email: tenant.email,
        image: tenant.image_url,
        total_invoices: tenantInvoices.length,
        total_pending: formatCurrency(totalPending),
        total_paid: formatCurrency(totalPaid),
      };
    });
  }
}

export async function fetchFilteredTenantsPages(query: string) {
  try {
    const count = await executeQuery(`
      SELECT COUNT(*)
      FROM tenant
      JOIN user ON tenant.user_id = user.id
      WHERE
        user.name ILIKE $1 OR
        user.email ILIKE $1 OR
        tenant.unit_occupied ILIKE $1
    `, [`%${query}%`]);

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.log('Using placeholder tenant pages count');
    // Count pages from placeholder data
    const lowerQuery = query.toLowerCase();
    const filtered = tenants.filter(tenant => 
      tenant.name.toLowerCase().includes(lowerQuery) ||
      tenant.email.toLowerCase().includes(lowerQuery)
    );
    
    return Math.ceil(filtered.length / ITEMS_PER_PAGE);
  }
}

export async function fetchTenantById(id: string) {
  try {
    const data = await executeQuery(`
      SELECT
        tenant.id,
        tenant.user_id,
        tenant.property_id,
        tenant.move_in_date,
        tenant.unit_occupied,
        tenant.emergency_contact,
        user.name,
        user.email,
        user.image
      FROM tenant
      JOIN user ON tenant.user_id = user.id
      WHERE tenant.id = $1
    `, [id]);

    if (data.rows.length === 0) {
      return null;
    }

    const tenant = data.rows[0];
    return tenant;
  } catch (error) {
    console.log('Using placeholder tenant by id');
    // Find tenant in placeholder data
    const tenant = tenants.find(t => t.id === id);
    if (tenant) {
      return {
        id: tenant.id,
        user_id: null,
        property_id: null,
        move_in_date: null,
        unit_occupied: null,
        emergency_contact: null,
        name: tenant.name,
        email: tenant.email,
        image: tenant.image_url,
      };
    }
    return null;
  }
}

export async function createTenant(tenantData: {
  name: string;
  email: string;
  password?: string;
  propertyId: string;
  moveInDate: Date;
  unitOccupied: string;
  emergencyContact: string;
}) {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
    
    // Create user first
    const userResult = await client.query(
      `INSERT INTO user (name, email, hashed_password, role, created_at)
       VALUES ($1, $2, $3, 'tenant', NOW())
       RETURNING id`,
      [tenantData.name, tenantData.email, tenantData.password || 'defaultpassword']
    );
    
    const userId = userResult.rows[0].id;
    
    // Create tenant linked to user
    const tenantResult = await client.query(
      `INSERT INTO tenant (user_id, property_id, move_in_date, unit_occupied, emergency_contact)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, tenantData.propertyId, tenantData.moveInDate, tenantData.unitOccupied, tenantData.emergencyContact]
    );
    
    await client.query('COMMIT');
    
    return tenantResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Database Error:', error);
    throw new Error('Failed to create tenant.');
  } finally {
    client.release();
  }
}

export async function updateTenant(id: string, tenantData: {
  name?: string;
  email?: string;
  propertyId?: string;
  moveInDate?: Date;
  unitOccupied?: string;
  emergencyContact?: string;
}) {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get tenant's user_id
    const tenantResult = await client.query(
      `SELECT user_id FROM tenant WHERE id = $1`,
      [id]
    );
    
    if (tenantResult.rows.length === 0) {
      throw new Error('Tenant not found');
    }
    
    const userId = tenantResult.rows[0].user_id;
    
    // Update user if name or email provided
    if (tenantData.name || tenantData.email) {
      await client.query(
        `UPDATE user SET name = COALESCE($1, name), email = COALESCE($2, email) WHERE id = $3`,
        [tenantData.name, tenantData.email, userId]
      );
    }
    
    // Update tenant
    const updatedTenant = await client.query(
      `UPDATE tenant SET
        property_id = COALESCE($1, property_id),
        move_in_date = COALESCE($2, move_in_date),
        unit_occupied = COALESCE($3, unit_occupied),
        emergency_contact = COALESCE($4, emergency_contact)
       WHERE id = $5
       RETURNING *`,
      [tenantData.propertyId, tenantData.moveInDate, tenantData.unitOccupied, tenantData.emergencyContact, id]
    );
    
    await client.query('COMMIT');
    
    return updatedTenant.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Database Error:', error);
    throw new Error('Failed to update tenant.');
  } finally {
    client.release();
  }
}

export async function deleteTenant(id: string) {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get tenant's user_id first
    const tenantResult = await client.query(
      `SELECT user_id FROM tenant WHERE id = $1`,
      [id]
    );
    
    if (tenantResult.rows.length === 0) {
      throw new Error('Tenant not found');
    }
    
    const userId = tenantResult.rows[0].user_id;
    
    // Delete tenant (cascade should handle related invoices)
    await client.query(`DELETE FROM tenant WHERE id = $1`, [id]);
    
    // Delete associated user
    await client.query(`DELETE FROM user WHERE id = $1`, [userId]);
    
    await client.query('COMMIT');
    
    return { success: true };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Database Error:', error);
    throw new Error('Failed to delete tenant.');
  } finally {
    client.release();
  }
}

export async function fetchProperties() {
  try {
    const data = await executeQuery(`
      SELECT
        property.id,
        property.address,
        property.total_units,
        landlord.company_name
      FROM property
      JOIN landlord ON property.landlord_id = landlord.id
      ORDER BY property.address ASC
    `);

    return data.rows;
  } catch (error) {
    console.log('Using placeholder properties data');
    // Return placeholder properties
    return [
      { id: '1', address: '123 Main St', total_units: 10, company_name: 'Landie Properties' },
      { id: '2', address: '456 Oak Ave', total_units: 8, company_name: 'Landie Properties' },
      { id: '3', address: '789 Pine Rd', total_units: 12, company_name: 'Landie Properties' },
    ];
  }
}

export async function fetchUnitsByProperty(propertyId: string) {
  try {
    const data = await executeQuery(`
      SELECT
        unit.id,
        unit.unit_number,
        unit.status
      FROM unit
      WHERE unit.property_id = $1
      ORDER BY unit.unit_number ASC
    `, [propertyId]);

    return data.rows;
  } catch (error) {
    console.log('Using placeholder units data');
    // Return placeholder units based on property
    return [
      { id: '1', unit_number: '101', status: 'occupied' },
      { id: '2', unit_number: '102', status: 'available' },
      { id: '3', unit_number: '103', status: 'occupied' },
      { id: '4', unit_number: '104', status: 'available' },
    ];
  }
}

export async function fetchFilteredLandlords(query: string) {
  try {
    const data = await executeQuery(`
      SELECT
        landlord.id,
        user.name,
        user.email,
        user.image,
        landlord.company_name,
        COUNT(property.id) AS total_properties
      FROM landlord
      JOIN user ON landlord.user_id = user.id
      LEFT JOIN property ON landlord.id = property.landlord_id
      WHERE
        user.name ILIKE $1 OR
        user.email ILIKE $1 OR
        landlord.company_name ILIKE $1
      GROUP BY landlord.id, user.name, user.email, user.image, landlord.company_name
      ORDER BY user.name ASC
    `, [`%${query}%`]);

    return data.rows;
  } catch (err) {
    console.log('Using placeholder filtered landlords data');
    // Return placeholder landlords
    return [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@landie.com',
        image: null,
        company_name: 'Landie Properties',
        total_properties: 3,
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@apex.com',
        image: null,
        company_name: 'Apex Realty',
        total_properties: 2,
      },
    ].filter(landlord =>
      landlord.name.toLowerCase().includes(query.toLowerCase()) ||
      landlord.email.toLowerCase().includes(query.toLowerCase()) ||
      landlord.company_name.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export async function fetchLandlordsPages(query: string) {
  try {
    const count = await executeQuery(`
      SELECT COUNT(*)
      FROM landlord
      JOIN user ON landlord.user_id = user.id
      WHERE
        user.name ILIKE $1 OR
        user.email ILIKE $1 OR
        landlord.company_name ILIKE $1
    `, [`%${query}%`]);

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.log('Using placeholder landlord pages count');
    // Count pages from placeholder data
    const filtered = [
      { name: 'John Doe', email: 'john@landie.com', company_name: 'Landie Properties' },
      { name: 'Jane Smith', email: 'jane@apex.com', company_name: 'Apex Realty' },
    ].filter(landlord =>
      landlord.name.toLowerCase().includes(query.toLowerCase()) ||
      landlord.email.toLowerCase().includes(query.toLowerCase()) ||
      landlord.company_name.toLowerCase().includes(query.toLowerCase())
    );

    return Math.ceil(filtered.length / ITEMS_PER_PAGE);
  }
}

export async function fetchLandlordById(id: string) {
  try {
    const data = await executeQuery(`
      SELECT
        landlord.id,
        landlord.user_id,
        landlord.company_name,
        user.name,
        user.email,
        user.image
      FROM landlord
      JOIN user ON landlord.user_id = user.id
      WHERE landlord.id = $1
    `, [id]);

    if (data.rows.length === 0) {
      return null;
    }

    return data.rows[0];
  } catch (error) {
    console.log('Using placeholder landlord by id');
    // Find landlord in placeholder data
    const landlords = [
      {
        id: '1',
        user_id: 'user1',
        company_name: 'Landie Properties',
        name: 'John Doe',
        email: 'john@landie.com',
        image: null,
      },
      {
        id: '2',
        user_id: 'user2',
        company_name: 'Apex Realty',
        name: 'Jane Smith',
        email: 'jane@apex.com',
        image: null,
      },
    ];

    return landlords.find(l => l.id === id) || null;
  }
}

export async function createLandlord(landlordData: {
  name: string;
  email: string;
  password?: string;
  companyName: string;
}) {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // Create user first
    const userResult = await client.query(
      `INSERT INTO user (name, email, hashed_password, role, created_at)
       VALUES ($1, $2, $3, 'landlord', NOW())
       RETURNING id`,
      [landlordData.name, landlordData.email, landlordData.password || 'defaultpassword']
    );

    const userId = userResult.rows[0].id;

    // Create landlord linked to user
    const landlordResult = await client.query(
      `INSERT INTO landlord (user_id, company_name)
       VALUES ($1, $2)
       RETURNING *`,
      [userId, landlordData.companyName]
    );

    await client.query('COMMIT');

    return landlordResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Database Error:', error);
    throw new Error('Failed to create landlord.');
  } finally {
    client.release();
  }
}

export async function updateLandlord(id: string, landlordData: {
  name?: string;
  email?: string;
  companyName?: string;
}) {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // Get landlord's user_id
    const landlordResult = await client.query(
      `SELECT user_id FROM landlord WHERE id = $1`,
      [id]
    );

    if (landlordResult.rows.length === 0) {
      throw new Error('Landlord not found');
    }

    const userId = landlordResult.rows[0].user_id;

    // Update user if name or email provided
    if (landlordData.name || landlordData.email) {
      await client.query(
        `UPDATE user SET name = COALESCE($1, name), email = COALESCE($2, email) WHERE id = $3`,
        [landlordData.name, landlordData.email, userId]
      );
    }

    // Update landlord
    const updatedLandlord = await client.query(
      `UPDATE landlord SET
        company_name = COALESCE($1, company_name)
       WHERE id = $2
       RETURNING *`,
      [landlordData.companyName, id]
    );

    await client.query('COMMIT');

    return updatedLandlord.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Database Error:', error);
    throw new Error('Failed to update landlord.');
  } finally {
    client.release();
  }
}

export async function deleteLandlord(id: string) {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // Get landlord's user_id first
    const landlordResult = await client.query(
      `SELECT user_id FROM landlord WHERE id = $1`,
      [id]
    );

    if (landlordResult.rows.length === 0) {
      throw new Error('Landlord not found');
    }

    const userId = landlordResult.rows[0].user_id;

    // Delete landlord (cascade should handle related properties)
    await client.query(`DELETE FROM landlord WHERE id = $1`, [id]);

    // Delete associated user
    await client.query(`DELETE FROM user WHERE id = $1`, [userId]);

    await client.query('COMMIT');

    return { success: true };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Database Error:', error);
    throw new Error('Failed to delete landlord.');
  } finally {
    client.release();
  }
}

