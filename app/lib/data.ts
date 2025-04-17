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
import { formatCurrency } from './utils';

// Configure local database connection
// These can also be set as environment variables
const localDbConfig = {
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  max: 5, // Maximum number of clients in the pool
  connectionTimeoutMillis: 10000, // Connection timeout
};

// Log connection info for debugging (remove in production)
console.log('Database connection string exists:', !!process.env.POSTGRES_URL);

// Create a custom pool for local development
const db = createPool(localDbConfig);

// Helper function to execute SQL queries
async function executeQuery(query: string, params: any[] = []) {
  if (!process.env.POSTGRES_URL) {
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
    // Check if table exists first
    const tableCheck = await executeQuery(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'revenue'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.error('Table "revenue" does not exist in the database');
      return [];
    }
    
    const data = await executeQuery('SELECT * FROM revenue');
    console.log('Revenue data fetched:', data.rows.length, 'rows');
    return data.rows;
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
        AND table_name = 'invoices'
      ) AND EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'tenants'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.error('Tables "invoices" or "tenants" do not exist in the database');
      return [];
    }
    
    const data = await executeQuery(`
      SELECT invoices.amount, tenants.name, tenants.image_url, tenants.email, invoices.id
      FROM invoices
      JOIN tenants ON invoices.tenant_id = tenants.id
      ORDER BY invoices.date DESC
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
    // Run multiple queries in parallel
    const [invoiceCount, tenantCount, invoiceStatus] = await Promise.all([
      executeQuery('SELECT COUNT(*) FROM invoices'),
      executeQuery('SELECT COUNT(*) FROM tenants'),
      executeQuery(`SELECT
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending",
        SUM(CASE WHEN status = 'late' THEN amount ELSE 0 END) AS "late"
        FROM invoices`)
    ]);

    const numberOfInvoices = Number(invoiceCount.rows[0].count ?? '0');
    const numberOfTenants = Number(tenantCount.rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(invoiceStatus.rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(invoiceStatus.rows[0].pending ?? '0');
    const totalLateInvoices = formatCurrency(invoiceStatus.rows[0].late ?? '0');

    return {
      numberOfTenants,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
      totalLateInvoices
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
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        tenants.name,
        tenants.email,
        tenants.image_url
      FROM invoices
      JOIN tenants ON invoices.tenant_id = tenants.id
      WHERE
        tenants.name ILIKE $1 OR
        tenants.email ILIKE $1 OR
        invoices.amount::text ILIKE $1 OR
        invoices.date::text ILIKE $1 OR
        invoices.status ILIKE $1
      ORDER BY invoices.date DESC
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
      FROM invoices
      JOIN tenants ON invoices.tenant_id = tenants.id
      WHERE
        tenants.name ILIKE $1 OR
        tenants.email ILIKE $1 OR
        invoices.amount::text ILIKE $1 OR
        invoices.date::text ILIKE $1 OR
        invoices.status ILIKE $1
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
        invoices.id,
        invoices.tenant_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = $1
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
        id,
        name
      FROM tenants
      ORDER BY name ASC
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
        tenants.id,
        tenants.name,
        tenants.email,
        tenants.image_url,
        COUNT(invoices.id) AS total_invoices,
        SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
        SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
      FROM tenants
      LEFT JOIN invoices ON tenants.id = invoices.tenant_id
      WHERE
        tenants.name ILIKE $1 OR
        tenants.email ILIKE $1
      GROUP BY tenants.id, tenants.name, tenants.email, tenants.image_url
      ORDER BY tenants.name ASC
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
