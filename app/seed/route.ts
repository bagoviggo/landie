import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { randUuid, randFullName, randEmail, randAvatar, randAddress, randPastDate, randPhoneNumber } from '@ngneat/falso';
import { users, landlords, tenants, properties, units, maintenance } from '../lib/definitions';
import type { UnitData, TenantData } from '../lib/types'; // Adjust import path as needed

export const db = drizzle(sql);

export async function GET(request: Request) {
  try {
    await db.transaction(async (tx) => {
      // Seed Users - Create some users manually for landlords and tenants
      const userData = Array.from({ length: 10 }, () => ({
        id: randUuid(),
        name: randFullName(),
        email: randEmail(),
        image: randAvatar(),
        role: Math.random() < 0.5 ? 'landlord' : 'tenant', // Add role to match schema
        created_at: new Date().toISOString(),
      }));
      await db.insert(users).values(userData);

      // Landlord-specific users (Subset of seeded users)
      const landlordUsers = userData.slice(0, 3); // Assume first 3 users are landlords
      const landlordData = landlordUsers.map(user => ({
        id: randUuid(),
        user_id: user.id,  // Link landlord to a user
        company_name: `Company of ${user.name}`,
      }));
      await db.insert(landlords).values(landlordData);

      // Seed Properties - Link properties to landlords (address is a string)
      const propertyData = Array.from({ length: 5 }, () => ({
        id: randUuid(),
        address: String(randAddress()), // Ensure address is a string
        total_units: Math.floor(Math.random() * 20) + 1, // Random number of units per property
        landlord_id: landlordData[Math.floor(Math.random() * landlordData.length)].user_id,  // Link property to a landlord
      }));
      await db.insert(properties).values(propertyData);

      // Seed Units - Create units linked to properties
      const unitData: UnitData[] = Array.from({ length: 20 }, () => ({
        id: randUuid(),
        property_id: propertyData[Math.floor(Math.random() * propertyData.length)].id,
        unit_number: `Unit ${Math.floor(Math.random() * 100) + 1}`,
        status: Math.random() < 0.5 ? 'available' : 'occupied',
      }));
      await db.insert(units).values(unitData);

      // Tenant-specific users (Subset of seeded users)
      const tenantUsers = userData.slice(3); // Assume the remaining users are tenants
      const tenantData: TenantData[] = tenantUsers.map(user => ({
        id: randUuid(),
        user_id: user.id,  // Link tenant to a user
        property_id: propertyData[Math.floor(Math.random() * propertyData.length)].id,  // Link tenant to a random property
        move_in_date: randPastDate().toISOString(),
        unit_occupied: unitData[Math.floor(Math.random() * unitData.length)].unit_number,  // Assign random unit to tenant
        emergency_contact: randPhoneNumber(),
      }));
      await db.insert(tenants).values(tenantData);

      // Seed Maintenance Requests
      const maintenanceData = Array.from({ length: 10 }, () => ({
        id: randUuid(),
        unit_id: unitData[Math.floor(Math.random() * unitData.length)].id, // Link maintenance to a unit
        description: 'Fix leaking faucet',
        date: randPastDate().toISOString(),
        status: Math.random() < 0.33 ? 'pending' : Math.random() < 0.5 ? 'in_progress' : 'completed', // Include 'in_progress'
      }));
      await db.insert(maintenance).values(maintenanceData);

    });

    return new Response(JSON.stringify({ message: 'Database seeded successfully' }), { status: 200 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
