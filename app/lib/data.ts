import { prisma } from '@/app/lib/prisma';
import { 
  Revenue,
  LatestInvoiceRaw,
  InvoicesTable,
  InvoiceForm,
  TenantsTableType,
  TenantField
} from './types';
import { formatCurrency } from '@/app/lib/utils';
import { tenants, invoices, revenue, users } from './placeholder-data';
import bcrypt from 'bcrypt';

const ITEMS_PER_PAGE = 6;

interface InvoiceData {
  id: string;
  tenant_id: string;
  amount: number;
  status: string;
  date: string;
  name: string;
  image_url: string;
  phone: string;
  email: string;
}

interface TenantData {
  id: string;
  name: string;
  email: string;
  image_url: string | null;
  phone?: string;
}

interface LandlordData {
  id: string;
  name: string;
  email: string;
  image: string | null;
  company_name: string;
  total_properties: number;
}

interface PropertyData {
  id: string;
  address: string;
  total_units: number;
  company_name: string;
  total_tenants?: number;
  total_units_occupied?: number;
}

// ─── Revenue ────────────────────────────────────────────────────────────────

export async function fetchRevenue(landlordId?: string | null) {
  try {
    // If scoped to a landlord, sum invoice amounts by month instead of revenue table
    if (landlordId) {
      const data = await prisma.invoice.findMany({
        where: {
          tenant: {
            property: { landlordId },
          },
          status: 'paid',
        },
        select: { amount: true, date: true },
      });

      const revenueByMonth: Record<string, number> = {};
      data.forEach((item) => {
        const month = new Date(item.date).toLocaleString('default', { month: 'short' });
        revenueByMonth[month] = (revenueByMonth[month] || 0) + item.amount;
      });

      return Object.entries(revenueByMonth).map(([month, total_revenue]) => ({
        month,
        total_revenue,
      }));
    }

    const data = await prisma.revenue.findMany({
      orderBy: { month: 'asc' },
      take: 12,
    });

    const revenueByMonth: Record<string, number> = {};
    data.forEach((item: { month: string; revenue: number }) => {
      revenueByMonth[item.month] = (revenueByMonth[item.month] || 0) + item.revenue;
    });

    return Object.entries(revenueByMonth).map(([month, total_revenue]) => ({
      month,
      total_revenue,
    }));
  } catch (error) {
    console.log('Using placeholder revenue data');
    return [
      { month: 'Jan', total_revenue: 2000 },
      { month: 'Feb', total_revenue: 1800 },
      { month: 'Mar', total_revenue: 2200 },
      { month: 'Apr', total_revenue: 2500 },
      { month: 'May', total_revenue: 2300 },
      { month: 'Jun', total_revenue: 3200 },
      { month: 'Jul', total_revenue: 3500 },
      { month: 'Aug', total_revenue: 3700 },
      { month: 'Sep', total_revenue: 2500 },
      { month: 'Oct', total_revenue: 2800 },
      { month: 'Nov', total_revenue: 3000 },
      { month: 'Dec', total_revenue: 8000 },
    ];
  }
}

// ─── Dashboard ──────────────────────────────────────────────────────────────

export async function fetchLatestInvoices(landlordId?: string | null) {
  try {
    const data = await prisma.invoice.findMany({
      where: landlordId
        ? { tenant: { property: { landlordId } } }
        : undefined,
      take: 5,
      orderBy: { date: 'desc' },
      include: {
        tenant: {
          include: {
            user: {
              select: { name: true, email: true, image: true },
            },
          },
        },
      },
    });

    return data.map((invoice: any) => ({
      id: invoice.id,
      name: invoice.tenant.user.name,
      email: invoice.tenant.user.email,
      image_url: invoice.tenant.user.image,
      amount: formatCurrency(invoice.amount),
    }));
  } catch (error) {
    console.log('Using placeholder latest invoices data');
    return invoices.slice(0, 5).map((invoice: InvoiceData) => ({
      id: invoice.id,
      name: invoice.name,
      email: invoice.email,
      image_url: invoice.image_url,
      amount: formatCurrency(invoice.amount),
    }));
  }
}

export async function fetchCardData(landlordId?: string | null) {
  try {
    const tenantWhere = landlordId
      ? { property: { landlordId } }
      : undefined;

    const invoiceWhere = landlordId
      ? { tenant: { property: { landlordId } } }
      : undefined;

    const [invoiceCount, tenantCount, invoiceStatus] = await Promise.all([
      prisma.invoice.count({ where: invoiceWhere }),
      prisma.tenant.count({ where: tenantWhere }),
      prisma.invoice.groupBy({
        by: ['status'],
        where: invoiceWhere,
        _sum: { amount: true },
      }),
    ]);

    const totalPaidInvoices = invoiceStatus.find((s: any) => s.status === 'paid')?._sum?.amount ?? 0;
    const totalPendingInvoices = invoiceStatus.find((s: any) => s.status === 'pending')?._sum?.amount ?? 0;

    return {
      numberOfTenants: tenantCount,
      numberOfInvoices: invoiceCount,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.log('Using placeholder card data');
    const paidInvoices = invoices.filter((inv: InvoiceData) => inv.status === 'paid');
    const pendingInvoices = invoices.filter((inv: InvoiceData) => inv.status === 'pending');
    return {
      numberOfTenants: tenants.length,
      numberOfInvoices: invoices.length,
      totalPaidInvoices: paidInvoices.reduce((sum: number, inv: InvoiceData) => sum + inv.amount, 0),
      totalPendingInvoices: pendingInvoices.reduce((sum: number, inv: InvoiceData) => sum + inv.amount, 0),
    };
  }
}

// ─── Invoices ────────────────────────────────────────────────────────────────

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
  landlordId?: string | null,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const scopeFilter = landlordId
    ? { tenant: { property: { landlordId } } }
    : {};

  try {
    const data = await prisma.invoice.findMany({
      where: {
        AND: [
          scopeFilter,
          {
            OR: [
              { tenant: { user: { name: { contains: query, mode: "insensitive" as const } } } },
              { tenant: { user: { email: { contains: query, mode: "insensitive" as const } } } },
              { amount: { equals: isNaN(Number(query)) ? undefined : Number(query) } },
              { status: { contains: query, mode: "insensitive" as const } },
            ],
          },
        ],
      },
      include: {
        tenant: {
          include: {
            user: { select: { name: true, email: true, image: true } },
          },
        },
      },
      orderBy: { date: 'desc' },
      take: ITEMS_PER_PAGE,
      skip: offset,
    });

    return data.map((invoice: any) => ({
      id: invoice.id,
      amount: invoice.amount / 100,
      date: invoice.date,
      status: invoice.status,
      name: invoice.tenant.user.name,
      email: invoice.tenant.user.email,
      image_url: invoice.tenant.user.image,
      phone: '',
    }));
  } catch (error) {
    console.log('Using placeholder filtered invoices data');
    const lowerQuery = query.toLowerCase();
    const filtered = invoices.filter((inv: InvoiceData) =>
      inv.name.toLowerCase().includes(lowerQuery) ||
      inv.email.toLowerCase().includes(lowerQuery) ||
      inv.amount.toString().includes(lowerQuery) ||
      inv.status.toLowerCase().includes(lowerQuery)
    );
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE).map((inv: InvoiceData) => ({
      id: inv.id,
      amount: inv.amount,
      date: inv.date,
      status: inv.status,
      name: inv.name,
      email: inv.email,
      image_url: inv.image_url,
      phone: inv.phone || '',
    }));
  }
}

export async function fetchInvoicesPages(query: string, landlordId?: string | null) {
  const scopeFilter = landlordId
    ? { tenant: { property: { landlordId } } }
    : {};

  try {
    const count = await prisma.invoice.count({
      where: {
        AND: [
          scopeFilter,
          {
            OR: [
              { tenant: { user: { name: { contains: query, mode: "insensitive" as const } } } },
              { tenant: { user: { email: { contains: query, mode: "insensitive" as const } } } },
              { status: { contains: query, mode: "insensitive" as const } },
            ],
          },
        ],
      },
    });
    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    return 1;
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await prisma.invoice.findUnique({
      where: { id },
      select: { id: true, tenantId: true, amount: true, status: true },
    });
    if (data) return { id: data.id, tenant_id: data.tenantId, amount: data.amount / 100, status: data.status };
    return null;
  } catch (error) {
    return null;
  }
}

// ─── Tenants ─────────────────────────────────────────────────────────────────

export async function fetchTenants(landlordId?: string | null) {
  try {
    const data = await prisma.tenant.findMany({
      where: landlordId ? { property: { landlordId } } : undefined,
      include: {
        user: { select: { name: true, email: true, image: true } },
        property: true,
      },
      orderBy: { user: { name: 'asc' } },
    });
    return data;
  } catch (err) {
    return [];
  }
}

export async function fetchFilteredTenants(query: string, landlordId?: string | null) {
  const scopeFilter = landlordId ? { property: { landlordId } } : {};

  try {
    const data = await prisma.tenant.findMany({
      where: {
        AND: [
          scopeFilter,
          {
            OR: [
              { user: { name: { contains: query, mode: "insensitive" as const } } },
              { user: { email: { contains: query, mode: "insensitive" as const } } },
              { unitOccupied: { contains: query, mode: "insensitive" as const } },
            ],
          },
        ],
      },
      include: {
        user: { select: { name: true, email: true, image: true } },
        invoices: true,
      },
      orderBy: { user: { name: 'asc' } },
    });

    return data.map((tenant: any) => {
      const totalPending = tenant.invoices
        .filter((inv: any) => inv.status === 'pending')
        .reduce((sum: number, inv: any) => sum + inv.amount, 0);
      const totalPaid = tenant.invoices
        .filter((inv: any) => inv.status === 'paid')
        .reduce((sum: number, inv: any) => sum + inv.amount, 0);
      return {
        id: tenant.id,
        name: tenant.user.name,
        email: tenant.user.email,
        imageUrl: tenant.user.image,
        totalInvoices: tenant.invoices.length,
        totalPending: formatCurrency(totalPending),
        totalPaid: formatCurrency(totalPaid),
      };
    });
  } catch (err) {
    return [];
  }
}

export async function fetchFilteredTenantsPages(query: string, landlordId?: string | null) {
  const scopeFilter = landlordId ? { property: { landlordId } } : {};

  try {
    const count = await prisma.tenant.count({
      where: {
        AND: [
          scopeFilter,
          {
            OR: [
              { user: { name: { contains: query, mode: "insensitive" as const } } },
              { user: { email: { contains: query, mode: "insensitive" as const } } },
              { unitOccupied: { contains: query, mode: "insensitive" as const } },
            ],
          },
        ],
      },
    });
    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    return 1;
  }
}

export async function fetchTenantById(id: string) {
  try {
    return await prisma.tenant.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true, image: true } },
        property: true,
      },
    });
  } catch (error) {
    return null;
  }
}

export async function createTenant(tenantData: {
  name: string;
  email: string;
  password?: string;
  propertyId: string;
  moveInDate: Date;
  unitOccupied: string;
  emergencyContact: string;
}) {
  try {
    const hashedPassword = await bcrypt.hash(tenantData.password || 'defaultpassword', 10);
    const user = await prisma.user.create({
      data: {
        name: tenantData.name,
        email: tenantData.email,
        hashedPassword,
        role: 'tenant',
      },
    });
    return await prisma.tenant.create({
      data: {
        userId: user.id,
        propertyId: tenantData.propertyId,
        moveInDate: tenantData.moveInDate,
        unitOccupied: tenantData.unitOccupied,
        emergencyContact: tenantData.emergencyContact,
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create tenant.');
  }
}

export async function updateTenant(id: string, tenantData: {
  name?: string;
  email?: string;
  propertyId?: string;
  moveInDate?: Date;
  unitOccupied?: string;
  emergencyContact?: string;
}) {
  try {
    const existing = await prisma.tenant.findUnique({ where: { id }, select: { userId: true } });
    if (!existing) throw new Error('Tenant not found');

    if (tenantData.name || tenantData.email) {
      await prisma.user.update({
        where: { id: existing.userId },
        data: { name: tenantData.name, email: tenantData.email },
      });
    }

    return await prisma.tenant.update({
      where: { id },
      data: {
        propertyId: tenantData.propertyId,
        moveInDate: tenantData.moveInDate,
        unitOccupied: tenantData.unitOccupied,
        emergencyContact: tenantData.emergencyContact,
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update tenant.');
  }
}

export async function deleteTenant(id: string) {
  try {
    const existing = await prisma.tenant.findUnique({ where: { id }, select: { userId: true } });
    if (!existing) throw new Error('Tenant not found');
    await prisma.tenant.delete({ where: { id } });
    await prisma.user.delete({ where: { id: existing.userId } });
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete tenant.');
  }
}

// ─── Properties ──────────────────────────────────────────────────────────────

export async function fetchProperties(landlordId?: string | null) {
  try {
    const data = await prisma.property.findMany({
      where: landlordId ? { landlordId } : undefined,
      include: {
        landlord: { select: { companyName: true } },
      },
      orderBy: { address: 'asc' },
    });
    return data.map((property: any) => ({
      id: property.id,
      address: property.address,
      total_units: property.totalUnits,
      company_name: property.landlord.companyName,
    }));
  } catch (error) {
    return [];
  }
}

export async function fetchFilteredProperties(query: string, landlordId?: string | null) {
  const scopeFilter = landlordId ? { landlordId } : {};

  try {
    const data = await prisma.property.findMany({
      where: {
        AND: [
          scopeFilter,
          {
            OR: [
              { address: { contains: query, mode: "insensitive" as const } },
              { landlord: { companyName: { contains: query, mode: "insensitive" as const } } },
            ],
          },
        ],
      },
      include: {
        landlord: { select: { companyName: true } },
        tenants: true,
        units: true,
      },
      orderBy: { address: 'asc' },
    });

    return data.map((property: any) => ({
      id: property.id,
      address: property.address,
      totalUnits: property.totalUnits,
      total_units: property.totalUnits,
      landlordId: property.landlordId,
      company_name: property.landlord.companyName,
      total_tenants: property.tenants.length,
      total_units_occupied: property.units.filter((u: any) => u.status === 'occupied').length,
    }));
  } catch (err) {
    return [];
  }
}

export async function fetchPropertiesPages(query: string, landlordId?: string | null) {
  const scopeFilter = landlordId ? { landlordId } : {};

  try {
    const count = await prisma.property.count({
      where: {
        AND: [
          scopeFilter,
          {
            OR: [
              { address: { contains: query, mode: "insensitive" as const } },
              { landlord: { companyName: { contains: query, mode: "insensitive" as const } } },
            ],
          },
        ],
      },
    });
    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    return 1;
  }
}

export async function fetchPropertyById(id: string) {
  try {
    return await prisma.property.findUnique({
      where: { id },
      include: { landlord: { select: { companyName: true } } },
    });
  } catch (error) {
    return null;
  }
}

export async function createProperty(propertyData: {
  address: string;
  totalUnits: number;
  landlordId: string;
  unitNames?: string[];
}) {
  try {
    const { unitNames, ...prismaData } = propertyData;
    const property = await prisma.property.create({ data: prismaData });

    const names =
      unitNames && unitNames.length > 0
        ? unitNames
        : Array.from({ length: propertyData.totalUnits }, (_, i) =>
            String(i + 1).padStart(3, '0'),
          );

    await prisma.unit.createMany({
      data: names.map((unitNumber) => ({
        propertyId: property.id,
        unitNumber,
        status: 'available',
      })),
    });

    return property;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create property.');
  }
}

export async function updateProperty(id: string, propertyData: {
  address?: string;
  totalUnits?: number;
  landlordId?: string;
}) {
  try {
    return await prisma.property.update({ where: { id }, data: propertyData });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update property.');
  }
}

export async function deleteProperty(id: string) {
  try {
    await prisma.property.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete property.');
  }
}

// ─── Units ───────────────────────────────────────────────────────────────────

export async function fetchUnitsByProperty(propertyId: string) {
  try {
    return await prisma.unit.findMany({
      where: { propertyId },
      orderBy: { unitNumber: 'asc' },
    });
  } catch (error) {
    return [];
  }
}

// ─── Landlords ───────────────────────────────────────────────────────────────

export async function fetchFilteredLandlords(query: string) {
  try {
    const data = await prisma.landlord.findMany({
      where: {
        OR: [
          { user: { name: { contains: query, mode: "insensitive" as const } } },
          { user: { email: { contains: query, mode: "insensitive" as const } } },
          { companyName: { contains: query, mode: "insensitive" as const } },
        ],
      },
      include: {
        user: { select: { name: true, email: true, image: true } },
        properties: true,
      },
      orderBy: { user: { name: 'asc' } },
    });

    return data.map((landlord: any) => ({
      id: landlord.id,
      name: landlord.user.name,
      email: landlord.user.email,
      image: landlord.user.image,
      company_name: landlord.companyName,
      total_properties: landlord.properties.length,
    }));
  } catch (err) {
    return [];
  }
}

export async function fetchLandlordsPages(query: string) {
  try {
    const count = await prisma.landlord.count({
      where: {
        OR: [
          { user: { name: { contains: query, mode: "insensitive" as const } } },
          { user: { email: { contains: query, mode: "insensitive" as const } } },
          { companyName: { contains: query, mode: "insensitive" as const } },
        ],
      },
    });
    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    return 1;
  }
}

export async function fetchLandlordById(id: string) {
  try {
    const data = await prisma.landlord.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true, image: true } } },
    });
    if (!data) return null;
    return {
      id: data.id,
      user_id: data.userId,
      company_name: data.companyName,
      name: data.user.name,
      email: data.user.email,
      image: data.user.image,
    };
  } catch (error) {
    return null;
  }
}

export async function createLandlord(landlordData: {
  name: string;
  email: string;
  password?: string;
  companyName: string;
}) {
  try {
    const hashedPassword = await bcrypt.hash(landlordData.password || 'defaultpassword', 10);
    const user = await prisma.user.create({
      data: {
        name: landlordData.name,
        email: landlordData.email,
        hashedPassword,
        role: 'landlord',
      },
    });
    return await prisma.landlord.create({
      data: { userId: user.id, companyName: landlordData.companyName },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create landlord.');
  }
}

export async function updateLandlord(id: string, landlordData: {
  name?: string;
  email?: string;
  companyName?: string;
}) {
  try {
    const existing = await prisma.landlord.findUnique({ where: { id }, select: { userId: true } });
    if (!existing) throw new Error('Landlord not found');

    if (landlordData.name || landlordData.email) {
      await prisma.user.update({
        where: { id: existing.userId },
        data: { name: landlordData.name, email: landlordData.email },
      });
    }

    return await prisma.landlord.update({
      where: { id },
      data: { companyName: landlordData.companyName },
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update landlord.');
  }
}

export async function deleteLandlord(id: string) {
  try {
    const existing = await prisma.landlord.findUnique({ where: { id }, select: { userId: true } });
    if (!existing) throw new Error('Landlord not found');
    await prisma.landlord.delete({ where: { id } });
    await prisma.user.delete({ where: { id: existing.userId } });
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete landlord.');
  }
}
