// app/lib/placeholder-data.ts
import { randUuid, randNumber, randPastDate } from '@ngneat/falso';

// Placeholder data for invoices
export const invoices = Array.from({ length: 20 }, () => ({
  id: randUuid(), // Unique identifier for the invoice
  tenant_id: randUuid(), // Reference to a tenant (you may want to replace this with actual tenant IDs)
  amount: randNumber({ min: 100, max: 1000 }), // Random amount between 100 and 1000
  date: randPastDate().toISOString(), // Random past date
  status: Math.random() < 0.5 ? 'pending' : 'paid', // Randomly assign status
}));

// Placeholder data for revenue
export const revenue = Array.from({ length: 12 }, (_, index) => ({
  month: new Date(new Date().getFullYear(), index).toISOString().slice(0, 7), // Format: YYYY-MM
  revenue: randNumber({ min: 10000, max: 50000 }), // Random revenue between 10,000 and 50,000
}));
