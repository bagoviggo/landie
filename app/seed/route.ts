// app/seed/route.ts
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { randUuid, randFullName, randEmail, randAvatar, randAddress, randPastDate, randPhoneNumber } from '@ngneat/falso';
import { users, landlords, tenants, properties, units, maintenance, invoices, revenue } from '../lib/definitions';
import type { UnitData, TenantData, Invoice, Revenue } from '../lib/types'; // Adjust import path as needed

const db = drizzle(sql);

export async function GET(request: Request) {
  try {
    await db.transaction(async (tx) => {
      // Seed Users
      const userData = Array.from({ length: 10 }, () => ({
        id: randUuid(),
        name: randFullName(),
        email: randEmail(),
        image: randAvatar(),
        role: Math.random() < 0.5 ? 'landlord' : 'tenant',
        created_at: new Date().toISOString(),
      }));
      await db.insert(users).values(userData);

      // Seed Landlords
      const landlordUsers = userData.slice(0, 3);
      const landlordData = landlordUsers.map(user => ({
        id: randUuid(),
        user_id: user.id,
        company_name: `Company of ${user.name}`,
      }));
      await db.insert(landlords).values(landlordData);

      // Seed Properties
      const propertyData = Array.from({ length: 5 }, () => ({
        id: randUuid(),
        address: String(randAddress()),
        total_units: Math.floor(Math.random() * 20) + 1,
        landlord_id: landlordData[Math.floor(Math.random() * landlordData.length)].user_id,
      }));
      await db.insert(properties).values(propertyData);

      // Seed Units
      const unitData: UnitData[] = Array.from({ length: 20 }, () => ({
        id: randUuid(),
        property_id: propertyData[Math.floor(Math.random() * propertyData.length)].id,
        unit_number: `Unit ${Math.floor(Math.random() * 100) + 1}`,
        status: Math.random() < 0.5 ? 'available' : 'occupied',
      }));
      await db.insert(units).values(unitData);

      // Seed Tenants
      const tenantUsers = userData.slice(3);
      const tenantData: TenantData[] = tenantUsers.map(user => ({
        id: randUuid(),
        user_id: user.id,
        property_id: propertyData[Math.floor(Math.random() * propertyData.length)].id,
        move_in_date: randPastDate().toISOString(),
        unit_occupied: unitData[Math.floor(Math.random() * unitData.length)].unit_number,
        emergency_contact: randPhoneNumber(),
      }));
      await db.insert(tenants).values(tenantData);

      // Seed Maintenance Requests
      const maintenanceData = Array.from({ length: 10 }, () => ({
        id: randUuid(),
        unit_id: unitData[Math.floor(Math.random() * unitData.length)].id,
        description: 'Fix leaking faucet',
        date: randPastDate().toISOString(),
        status: Math.random() < 0.33 ? 'pending' : Math.random() < 0.5 ? 'in_progress' : 'completed',
      }));
      await db.insert(maintenance).values(maintenanceData);

      // Seed Invoices
      const invoiceData = Array.from({ length: 20 }, () => ({
        tenant_id: tenantData[Math.floor(Math.random() * tenantData.length)].id,
        amount: Math.floor(Math.random() * 900) + 100,
        date: randPastDate().toISOString().split('T')[0], // Format date as YYYY-MM-DD
        status: Math.random() < 0.5 ? 'pending' : 'paid',
      }));
      
      await db.insert(invoices).values(invoiceData);

      // Seed Revenue
      const revenueData: Revenue[] = Array.from({ length: 12 }, (_, index) => ({
        id: randUuid(),
        month: new Date(2024, index).toLocaleString('default', { month: 'short' }), // Example: 'Jan', 'Feb'
        revenue: Math.floor(Math.random() * 50000) + 10000,
      }));
      await db.insert(revenue).values(revenueData);

    });

    return new Response(JSON.stringify({ message: 'Database seeded successfully' }), { status: 200 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
