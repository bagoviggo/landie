// Adjusting UnitData to match Prisma schema
export interface UnitData {
  id: string; // Matches Prisma's `id` field
  propertyId: string; // Use camelCase if Prisma uses snake_case
  unitNumber: string; // Matches Prisma's `unitNumber` field
  status: 'available' | 'occupied'; // Matches Prisma's enum
}

// Adjusting TenantData to match Prisma schema
export interface TenantData {
  id: string;
  name: string; // Added based on fetchTenants and fetchFilteredTenants
  email: string; // Added based on fetchFilteredTenants
  image_url?: string; // Added based on fetchFilteredTenants
  propertyId?: string;
  moveInDate?: Date; // Ensure this matches Prisma's `DateTime`
  unitOccupied?: string;
  emergencyContact?: string;
}

// Adjusting InvoiceValues for API routes
export type InvoiceValues = {
  id: string;
  tenantId: string; // Use camelCase for consistency
  amount: number;
  date: Date; // Matches Prisma's `DateTime`
  status: 'pending' | 'paid' | 'late'; // Matches Prisma's enum
};

// Adjusting User to match Prisma schema
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'landlord' | 'tenant'; // Matches Prisma's enum
  createdAt: Date; // Matches Prisma's `DateTime`
};

// Adjusting API-specific types
export type CreateInvoicePayload = {
  tenantId: string;
  amount: number;
  status: 'pending' | 'paid' | 'late';
};

export type UpdateInvoicePayload = {
  id: string;
  status: 'pending' | 'paid' | 'late';
};

// Adjusting InvoiceData to match Prisma schema
export interface InvoiceData {
  id: string;
  tenantId: string;
  propertyId?: string; // Optional since it's not used in data.ts
  amount: number;
  date: Date; // Matches Prisma's `DateTime`
  status: 'pending' | 'paid' | 'late'; // Matches Prisma's enum
}

// Adjusting RevenueData for reporting
export interface RevenueData {
  propertyId: string;
  totalRevenue: number;
  month: string; // Format as 'YYYY-MM' for consistency
  year: number;
}

// Added based on fetchRevenue
export type Revenue = {
  revenue: number;
  propertyId: string;
  totalRevenue: number;
  month: string;
  year: number;
};

// Added based on fetchLatestInvoices
export type LatestInvoiceRaw = {
  id: string;
  amount: number;
  name: string;
  email: string;
  image_url?: string;
};

// Added based on fetchInvoiceById
export type InvoiceForm = {
  id: string;
  tenant_id: string;
  amount: number;
  status: 'pending' | 'paid' | 'late';
};

// Added based on fetchFilteredInvoices
export type InvoicesTable = {
  id: string;
  amount: number;
  date: Date;
  status: 'pending' | 'paid' | 'late';
  name: string;
  email: string;
  image_url?: string;
};

// Added based on fetchTenants
export type TenantField = {
  id: string;
  name: string;
};

// Added based on fetchFilteredTenants
export type TenantsTableType = {
  id: string;
  name: string;
  email: string;
  image_url?: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};