// app/seed/route.ts
import { PrismaClient, Prisma } from '@prisma/client';
import { randUuid, randFullName, randEmail, randAvatar, randAddress, randPastDate, randPhoneNumber } from '@ngneat/falso';
import type { UnitData, TenantData, InvoiceData, RevenueData } from '../lib/types'; 

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Seed Users
      const userData = Array.from({ length: 10 }, () => ({
        id: randUuid(),
        name: randFullName(),
        email: randEmail(),
        password: 'hashed_password', // Placeholder for password
        role: Math.random() < 0.5 ? 'landlord' : 'tenant',
        createdAt: new Date(),
      }));
      await tx.user.createMany({ data: userData });

      // Seed Landlords
      const landlordUsers = userData.filter(user => user.role === 'landlord').slice(0, 3);
      const landlordData = landlordUsers.map(user => ({
        id: randUuid(),
        userId: user.id,
        companyName: `Company of ${user.name}`,
      }));
      await tx.landlord.createMany({ data: landlordData });

      // Seed Properties
      const propertyData = Array.from({ length: 5 }, () => ({
        id: randUuid(),
        address: String(randAddress()),
        totalUnits: Math.floor(Math.random() * 20) + 1,
        landlordId: landlordData[Math.floor(Math.random() * landlordData.length)].id,
      }));
      await tx.property.createMany({ data: propertyData });

      // Seed Units
      const unitData: UnitData[] = Array.from({ length: 20 }, () => ({
        id: randUuid(),
        propertyId: propertyData[Math.floor(Math.random() * propertyData.length)].id,
        unitNumber: `Unit ${Math.floor(Math.random() * 100) + 1}`,
        status: Math.random() < 0.5 ? 'available' : 'occupied',
      }));
      await tx.unit.createMany({ data: unitData });

      // Seed Tenants
      const tenantUsers = userData.filter(user => user.role === 'tenant');
      const tenantData: TenantData[] = tenantUsers.map(user => ({
        id: randUuid(),
        userId: user.id,
        propertyId: propertyData[Math.floor(Math.random() * propertyData.length)].id,
        moveInDate: randPastDate(),
        unitOccupied: unitData[Math.floor(Math.random() * unitData.length)].id,
        emergencyContact: randPhoneNumber(),
      }));
      await tx.tenant.createMany({ data: tenantData });

      // Seed Maintenance Requests
      const maintenanceData = Array.from({ length: 10 }, () => ({
        id: randUuid(),
        unitId: unitData[Math.floor(Math.random() * unitData.length)].id,
        description: 'Fix leaking faucet',
        date: randPastDate(),
        status: Math.random() < 0.33 ? 'pending' : Math.random() < 0.5 ? 'in_progress' : 'completed',
      }));
      await tx.maintenance.createMany({ data: maintenanceData });

      // Seed Invoices
      const invoiceData: InvoiceData[] = Array.from({ length: 20 }, () => ({
        id: randUuid(),
        tenantId: tenantData[Math.floor(Math.random() * tenantData.length)].id,
        propertyId: propertyData[Math.floor(Math.random() * propertyData.length)].id,
        amount: Math.floor(Math.random() * 900) + 100,
        date: randPastDate(),
        status: Math.random() < 0.5 ? 'pending' : 'paid',
      }));
      await tx.invoice.createMany({ data: invoiceData });

      // Seed Revenue
      const revenueData: RevenueData[] = Array.from({ length: 12 }, (_, index) => ({
        propertyId: propertyData[Math.floor(Math.random() * propertyData.length)].id,
        totalRevenue: Math.floor(Math.random() * 50000) + 10000,
        month: new Date(2024, index).toISOString().slice(0, 7), // Format as 'YYYY-MM'
        year: 2024,
      }));
      await tx.revenue.createMany({ data: revenueData });

    });

    return new Response(JSON.stringify({ message: 'Database seeded successfully' }), { status: 200 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
