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
    console.error('Database connection string not provided');
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
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
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
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
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
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await executeQuery(`
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

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
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
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
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
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
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

    const tenants = data.rows;
    return tenants;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all tenants.');
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
    console.error('Database Error:', err);
    throw new Error('Failed to fetch tenant table.');
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
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of tenants.');
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
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tenant.');
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
    console.error('Database Error:', error);
    throw new Error('Failed to fetch properties.');
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
    console.error('Database Error:', error);
    throw new Error('Failed to fetch units.');
  }
}
