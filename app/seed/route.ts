// app/seed/route.ts
import { 
  isDevelopment, 
  SEED_CONFIG 
} from '../lib/env';
import { PrismaClient, Prisma } from '@prisma/client';
import { 
  randUuid, 
  randFullName, 
  randEmail, 
  randAddress, 
  randPastDate, 
  randPhoneNumber 
} from '@ngneat/falso';
import type { UnitData } from '../lib/types';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  if (!isDevelopment) {
    return new Response(
      JSON.stringify({ error: 'This route is only available in development' }),
      { status: 403 }
    );
  }

  try {
    const hashedPassword = await bcrypt.hash('password', 10);

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Seed Users
      const userData = Array.from({ length: SEED_CONFIG.usersCount }, () => ({
        id: randUuid(),
        name: randFullName(),
        email: randEmail(),
        hashedPassword: hashedPassword,
        role: Math.random() < 0.5 ? 'landlord' : 'tenant',
        createdAt: new Date(),
      }));
      
      console.log(`Attempting to create ${userData.length} users`);
      await tx.user.createMany({ data: userData });
      console.log(`Users created successfully`);

      // Seed Landlords
      const landlordUsers = userData.filter(user => user.role === 'landlord').slice(0, 3);
      const landlordData = landlordUsers.map(user => ({
        id: randUuid(),
        userId: user.id,
        companyName: `Company of ${user.name}`,
      }));
      await tx.landlord.createMany({ data: landlordData });

      // Seed Properties
      const propertyData = Array.from({ length: SEED_CONFIG.propertiesCount }, () => ({
        id: randUuid(),
        address: String(randAddress()),
        totalUnits: Math.floor(Math.random() * 20) + 1,
        landlordId: landlordData[Math.floor(Math.random() * landlordData.length)].id,
      }));
      await tx.property.createMany({ data: propertyData });

      // Seed Units
      const unitData: UnitData[] = Array.from({ length: SEED_CONFIG.unitsCount }, () => ({
        id: randUuid(),
        propertyId: propertyData[Math.floor(Math.random() * propertyData.length)].id,
        unitNumber: `Unit ${Math.floor(Math.random() * 100) + 1}`,
        status: Math.random() < 0.5 ? 'available' : 'occupied',
      }));
      await tx.unit.createMany({ data: unitData });

      // Seed Tenants
      const tenantUsers = userData.filter(user => user.role === 'tenant');
      const occupiedUnits = unitData.filter(unit => unit.status === 'occupied');
      
      const tenantData: any[] = tenantUsers.map((user, index) => {
        const unitIndex = index % occupiedUnits.length;
        return {
          id: randUuid(),
          userId: user.id,
          propertyId: propertyData[Math.floor(Math.random() * propertyData.length)].id,
          moveInDate: randPastDate(),
          unitOccupied: occupiedUnits[unitIndex].id,
          emergencyContact: randPhoneNumber(),
        };
      });
      
      await tx.tenant.createMany({ data: tenantData });

      // Seed Maintenance Requests
      const maintenanceData = Array.from({ length: SEED_CONFIG.maintenanceCount }, () => ({
        id: randUuid(),
        unitId: unitData[Math.floor(Math.random() * unitData.length)].id,
        description: 'Fix leaking faucet',
        date: randPastDate(),
        status: Math.random() < 0.33 ? 'pending' : Math.random() < 0.5 ? 'in_progress' : 'completed',
      }));
      await tx.maintenance.createMany({ data: maintenanceData });

      // Seed Invoices
      const invoiceData: any[] = Array.from({ length: SEED_CONFIG.invoicesCount }, () => ({
        id: randUuid(),
        tenantId: tenantData[Math.floor(Math.random() * tenantData.length)].id,
        amount: Math.floor(Math.random() * 900) + 100,
        date: randPastDate(),
        status: Math.random() < 0.5 ? 'pending' : 'paid',
      }));
      await tx.invoice.createMany({ data: invoiceData });

      // Seed Revenue
      const revenueData = Array.from({ length: SEED_CONFIG.revenueMonths }, (_, index) => ({
        id: randUuid(),
        month: new Date(2024, index).toISOString().slice(0, 7),
        revenue: Math.floor(Math.random() * 50000) + 10000,
      }));
      
      await tx.revenue.createMany({ data: revenueData });
    });

    return new Response(
      JSON.stringify({ 
        message: 'Database seeded successfully',
        environment: isDevelopment ? 'development' : 'production'
      }), 
      { status: 200 }

    );
  } catch (error) {
    console.error('Seeding Error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        environment: isDevelopment ? 'development' : 'production'
      }), 
      { status: 500 }
    );
  }
}
