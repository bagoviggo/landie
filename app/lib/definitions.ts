import { pgTable, uuid, text, varchar, date, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Users Table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  image: text('image').notNull(),
  role: varchar('role', { length: 20 }).notNull(), // 'landlord' or 'tenant'
  created_at: date('created_at').notNull(),
});

// Landlords Table
export const landlords = pgTable('landlords', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  user_id: uuid('user_id').notNull().references(() => users.id), // Foreign key to users
  company_name: text('company_name'), // Optional company info
});

// Tenants Table
export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  user_id: uuid('user_id').notNull().references(() => users.id), // Foreign key to users
  property_id: uuid('property_id').notNull(), // Reference to properties table
  move_in_date: date('move_in_date').notNull(),
  unit_occupied: varchar('unit_occupied', { length: 50 }).notNull(),
  emergency_contact: text('emergency_contact').notNull(),
});

// Properties Table
export const properties = pgTable('properties', {
  id: uuid('id').primaryKey().defaultRandom(),
  address: text('address').notNull(),
  total_units: integer('total_units').notNull(),
  landlord_id: uuid('landlord_id').notNull().references(() => users.id), // Link to landlord in users table
});

// Invoices Table
export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  tenant_id: uuid('tenant_id').notNull().references(() => tenants.id), // Reference to tenants
  amount: integer('amount').notNull(),
  date: date('date').notNull(),
  status: varchar('status', { length: 50 }).notNull(), // 'pending', 'paid', 'late'
});

// Revenue Table
export const revenue = pgTable('revenue', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  month: varchar('month', { length: 7 }).notNull(),
  revenue: integer('revenue').notNull(),
});

// Units Table
export const units = pgTable('units', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  property_id: uuid('property_id').notNull().references(() => properties.id), // Reference to properties
  tenant_id: uuid('tenant_id').references(() => tenants.id), // Optional reference to tenants if occupied
  unit_number: varchar('unit_number', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(), // e.g., 'available', 'occupied'
});

// Maintenance Table
export const maintenance = pgTable('maintenance', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  unit_id: uuid('unit_id').notNull().references(() => units.id), // Reference to unit
  description: text('description').notNull(),
  date: date('date').notNull(),
  status: varchar('status', { length: 50 }).notNull(), // 'pending', 'in_progress', 'completed'
});
