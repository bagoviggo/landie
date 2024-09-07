export interface UnitData {
    id: string;
    property_id: string;
    unit_number: string;
    status: 'available' | 'occupied';
}
  
export interface TenantData {
    id: string;
    user_id: string;
    property_id: string;
    move_in_date: string;
    unit_occupied: string;
    emergency_contact: string;
}

export type InvoiceValues = {
    id: string;
    tenant_id: string;
    amount: number;
    date: Date; // Ensure this is a Date object, not a string
    status: 'pending' | 'paid';
  };

// app/lib/types.ts

// User Type Definition
export type User = {
  id: string; // Unique identifier for the user
  name: string; // Full name of the user
  email: string; // Email address of the user
  password: string; // Hashed password for authentication
  role: 'landlord' | 'tenant'; // Role of the user in the system
  created_at: Date; // Timestamp of when the user was created
};

// Tenant Type Definition
export type Tenant = {
  id: string; // Unique identifier for the tenant
  user_id: string; // Reference to the associated user
  property_id: string; // Reference to the property occupied by the tenant
  move_in_date: Date; // Date when the tenant moved in
  unit_occupied: string; // Unit occupied by the tenant
  emergency_contact: string; // Emergency contact information
};

// Invoice Type Definition
export type Invoice = {
  id: string; // Unique identifier for the invoice
  tenant_id: string; // Reference to the tenant associated with the invoice
  amount: number; // Amount to be paid
  date: Date; // Date of the invoice
  status: 'pending' | 'paid' | 'late'; // Current status of the invoice
};

// Revenue Type Definition
export type Revenue = {
  month: string; // Month of the revenue record (e.g., '2024-01')
  revenue: number; // Total revenue for the month
};

// Latest Invoice Type Definition
export type LatestInvoice = {
  id: string; // Unique identifier for the latest invoice
  tenant_id: string; // Reference to the tenant associated with the invoice
  amount: string; // Amount formatted as a string for display
  date: Date; // Date of the invoice
};

// Raw Invoice Type Definition
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number; // Amount as a number for calculations
};

// Invoices Table Type Definition
export type InvoicesTable = {
  id: string; // Unique identifier for the invoice
  tenant_id: string; // Reference to the tenant associated with the invoice
  name: string; // Name of the tenant
  phone: string; // phone of the tenant
  image_url: string; // URL to the tenant's image
  date: Date; // Date of the invoice
  amount: number; // Amount to be paid
  status: 'pending' | 'paid' | 'late'; // Current status of the invoice
};

// Tenants Table Type Definition
export type TenantsTableType = {
  id: string; // Unique identifier for the tenant
  name: string; // Full name of the tenant
  email: string; // Email address of the tenant
  image_url: string; // URL to the tenant's image
  total_invoices: number; // Total number of invoices for the tenant
  total_pending: number; // Total number of pending invoices
  total_paid: number; // Total number of paid invoices
};

// Formatted Tenants Table Type Definition
export type FormattedTenantsTable = {
  id: string; // Unique identifier for the tenant
  name: string; // Full name of the tenant
  email: string; // Email address of the tenant
  image_url: string; // URL to the tenant's image
  total_invoices: number; // Total number of invoices for the tenant
  total_pending: string; // Total number of pending invoices formatted as a string
  total_paid: string; // Total number of paid invoices formatted as a string
};

// Tenant Field Type Definition
export type TenantField = {
  id: string; // Unique identifier for the tenant
  name: string; // Full name of the tenant
};

// Invoice Form Type Definition
export type InvoiceForm = {
  id: string; // Unique identifier for the invoice
  tenant_id: string; // Reference to the tenant associated with the invoice
  amount: number; // Amount to be paid
  status: 'pending' | 'paid' | 'late'; // Current status of the invoice
};


