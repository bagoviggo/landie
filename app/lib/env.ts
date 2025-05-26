export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';

// Currency configuration
export const DEFAULT_CURRENCY = process.env.DEFAULT_CURRENCY || 'USD';
export const EXCHANGE_RATE_KES = Number(process.env.EXCHANGE_RATE_KES) || 138.5;

// Database configuration
export const DATABASE_CONFIG = {
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : undefined,
  max: Number(process.env.DB_MAX_CONNECTIONS) || 5,
  connectionTimeoutMillis: Number(process.env.DB_TIMEOUT) || 10000,
};

// Seed configuration
export const SEED_CONFIG = {
  usersCount: Number(process.env.SEED_USERS_COUNT) || 10,
  propertiesCount: Number(process.env.SEED_PROPERTIES_COUNT) || 5,
  unitsCount: Number(process.env.SEED_UNITS_COUNT) || 20,
  maintenanceCount: Number(process.env.SEED_MAINTENANCE_COUNT) || 10,
  invoicesCount: Number(process.env.SEED_INVOICES_COUNT) || 20,
  revenueMonths: Number(process.env.SEED_REVENUE_MONTHS) || 12,
};