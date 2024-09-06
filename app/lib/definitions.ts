// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type Tenant = {
  id: string;
  name: string;
  phone: string;
  email: string
  image_url: string;
};

export type Invoice = {
  id: string;
  tenant_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid' | 'late';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  phone: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  tenant_id: string;
  name: string;
  phone: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid' | 'late';
};

export type TenantsTableType = {
  id: string;
  name: string;
  phone: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedTenantsTable = {
  id: string;
  name: string;
  phone: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type TenantField = {
  id: string;
  name: string;
  phone: string;
  email: string;
};

export type InvoiceForm = {
  id: string;
  tenant_id: string;
  amount: number;
  status: 'pending' | 'paid' | 'late';
};


export type Maintenance = { 
  id: string; tenant_id: string;
  description: string;
  date: string;
  status: 'pending' | 'completed';
};

export type MaintenanceTable = {
  id: string;
  tenant_id: string;
  name: string;
  phone: string;
  image_url: string;
  description: string;
  date: string;
  status: 'pending' | 'completed';
};

export type MaintenanceForm = {
  id: string;
  tenant_id: string;
  description: string;
  date: string;
  status: 'pending' | 'completed';
};
