// Example: Adjusting UnitData to match Prisma schema
export interface UnitData {
  id: string; // Matches Prisma's `id` field
  propertyId: string; // Use camelCase if Prisma uses snake_case
  unitNumber: string; // Matches Prisma's `unitNumber` field
  status: 'available' | 'occupied'; // Matches Prisma's enum
}

// Example: Adjusting TenantData to match Prisma schema
export interface TenantData {
  id: string;
  userId: string; // Use camelCase for consistency
  propertyId: string;
  moveInDate: Date; // Ensure this matches Prisma's `DateTime`
  unitOccupied: string;
  emergencyContact: string;
}

// Example: Adjusting InvoiceValues for API routes
export type InvoiceValues = {
  id: string;
  tenantId: string; // Use camelCase for consistency
  amount: number;
  date: Date; // Matches Prisma's `DateTime`
  status: 'pending' | 'paid'; // Matches Prisma's enum
};

// Example: Adjusting User to match Prisma schema
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'landlord' | 'tenant'; // Matches Prisma's enum
  createdAt: Date; // Matches Prisma's `DateTime`
};

// Example: Adjusting API-specific types
export type CreateInvoicePayload = {
  tenantId: string;
  amount: number;
  status: 'pending' | 'paid' | 'late';
};

export type UpdateInvoicePayload = {
  id: string;
  status: 'pending' | 'paid' | 'late';
};
// Example: Adjusting InvoiceData to match Prisma schema
export interface InvoiceData {
  id: string;
  tenantId: string;
  propertyId: string;
  amount: number;
  date: Date; // Matches Prisma's `DateTime`
  status: 'pending' | 'paid' | 'late'; // Matches Prisma's enum
}

// Example: Adjusting RevenueData for reporting
export interface RevenueData {
  propertyId: string;
  totalRevenue: number;
  month: string; // Format as 'YYYY-MM' for consistency
  year: number;
}