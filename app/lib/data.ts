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

export async function fetchRevenue() {
  try {
    const data = await prisma.revenue.findMany({
      orderBy: { month: 'asc' },
      take: 12,
    });

    const revenueByMonth: Record<string, number> = {};
    data.forEach((item: { month: string; revenue: number }) => {
      revenueByMonth[item.month] = (revenueByMonth[item.month] || 0) + item.revenue;
    });

    const result = Object.entries(revenueByMonth).map(([month, total_revenue]) => ({
      month,
      total_revenue,
    }));

    return result;
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

export async function fetchLatestInvoices() {
  try {
    const data = await prisma.invoice.findMany({
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

    const latestInvoices = data.map((invoice) => ({
      id: invoice.id,
      name: invoice.tenant.user.name,
      email: invoice.tenant.user.email,
      image_url: invoice.tenant.user.image,
      amount: formatCurrency(invoice.amount),
    }));
    
    return latestInvoices;
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

export async function fetchCardData() {
  try {
    const [invoiceCount, tenantCount, invoiceStatus] = await Promise.all([
      prisma.invoice.count(),
      prisma.tenant.count(),
      prisma.invoice.groupBy({
        by: ['status'],
        _sum: { amount: true },
      }),
    ]);

    const totalPaidInvoices = invoiceStatus.find((s) => s.status === 'paid')?._sum?.amount ?? 0;
    const totalPendingInvoices = invoiceStatus.find((s) => s.status === 'pending')?._sum?.amount ?? 0;

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

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await prisma.invoice.findMany({
      where: {
        OR: [
          { tenant: { user: { name: { contains: query, mode: 'insensitive' } } } },
          { tenant: { user: { email: { contains: query, mode: 'insensitive' } } } },
          { amount: { equals: isNaN(Number(query)) ? undefined : Number(query) } },
          { date: { equals: isNaN(Date.parse(query)) ? undefined : new Date(query) } },
          { status: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        tenant: {
          include: {
            user: {
              select: { name: true, email: true, image: true },
            },
          },
        },
      },
      orderBy: { date: 'desc' },
      take: ITEMS_PER_PAGE,
      skip: offset,
    });

    return data.map((invoice) => ({
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
      inv.date.includes(lowerQuery) ||
      inv.status.toLowerCase().includes(lowerQuery)
    );
    
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedInvoices = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    
    return paginatedInvoices.map((inv: InvoiceData) => ({
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

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await prisma.invoice.count({
      where: {
        OR: [
          { tenant: { user: { name: { contains: query, mode: 'insensitive' } } } },
          { tenant: { user: { email: { contains: query, mode: 'insensitive' } } } },
          { amount: { equals: isNaN(Number(query)) ? undefined : Number(query) } },
          { date: { equals: isNaN(Date.parse(query)) ? undefined : new Date(query) } },
          { status: { contains: query, mode: 'insensitive' } },
        ],
      },
    });

    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.log('Using placeholder invoice pages count');
    const lowerQuery = query.toLowerCase();
    const filtered = invoices.filter((inv: InvoiceData) => 
      inv.name.toLowerCase().includes(lowerQuery) ||
      inv.email.toLowerCase().includes(lowerQuery) ||
      inv.amount.toString().includes(lowerQuery) ||
      inv.date.includes(lowerQuery) ||
      inv.status.toLowerCase().includes(lowerQuery)
    );
    
    return Math.ceil(filtered.length / ITEMS_PER_PAGE);
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await prisma.invoice.findUnique({
      where: { id },
      select: {
        id: true,
        tenant_id: true,
        amount: true,
        status: true,
      },
    });

    if (data) {
      return {
        ...data,
        amount: data.amount / 100,
      };
    }
    return null;
  } catch (error) {
    console.log('Using placeholder invoice by id');
    const invoice = invoices.find((inv: InvoiceData) => inv.id === id);
    if (invoice) {
      return {
        id: invoice.id,
        tenant_id: invoice.tenant_id,
        amount: invoice.amount / 100,
        status: invoice.status
      };
    }
    return null;
  }
}

export async function fetchTenants() {
  try {
    const data = await prisma.tenant.findMany({
      include: {
        user: {
          select: { name: true, email: true, image: true },
        },
        property: true,
      },
      orderBy: { user: { name: 'asc' } },
    });

    return data;
  } catch (err) {
    console.log('Using placeholder tenants data');
    return tenants.map((tenant: TenantData) => ({
      id: tenant.id,
      name: tenant.name,
      email: tenant.email,
      image: tenant.image_url,
      property_id: null,
      move_in_date: null,
      unit_occupied: null,
      emergency_contact: null,
    }));
  }
}

export async function fetchFilteredTenants(query: string) {
  try {
    const data = await prisma.tenant.findMany({
      where: {
        OR: [
          { user: { name: { contains: query, mode: 'insensitive' } } },
          { user: { email: { contains: query, mode: 'insensitive' } } },
          { unitOccupied: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        user: {
          select: { name: true, email: true, image: true },
        },
        invoices: true,
      },
      orderBy: { user: { name: 'asc' } },
    });

    const tenantsWithTotals = data.map((tenant) => {
      const totalPending = tenant.invoices
        .filter((inv) => inv.status === 'pending')
        .reduce((sum, inv) => sum + inv.amount, 0);
      const totalPaid = tenant.invoices
        .filter((inv) => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.amount, 0);
      
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

    return tenantsWithTotals;
  } catch (err) {
    console.log('Using placeholder filtered tenants data');
    const lowerQuery = query.toLowerCase();
    const filtered = tenants.filter((tenant: TenantData) => 
      tenant.name.toLowerCase().includes(lowerQuery) ||
      tenant.email.toLowerCase().includes(lowerQuery) ||
      (tenant.phone && tenant.phone.includes(lowerQuery))
    );
    
    return filtered.map((tenant: TenantData) => {
      const tenantInvoices = invoices.filter((inv: InvoiceData) => inv.tenant_id === tenant.id);
      const totalPending = tenantInvoices
        .filter((inv: InvoiceData) => inv.status === 'pending')
        .reduce((sum: number, inv: InvoiceData) => sum + inv.amount, 0);
      const totalPaid = tenantInvoices
        .filter((inv: InvoiceData) => inv.status === 'paid')
        .reduce((sum: number, inv: InvoiceData) => sum + inv.amount, 0);
      
      return {
        id: tenant.id,
        name: tenant.name,
        email: tenant.email,
        imageUrl: tenant.image_url,
        totalInvoices: tenantInvoices.length,
        totalPending: formatCurrency(totalPending),
        totalPaid: formatCurrency(totalPaid),
      };
    });
  }
}

export async function fetchFilteredTenantsPages(query: string) {
  try {
    const count = await prisma.tenant.count({
      where: {
        OR: [
          { user: { name: { contains: query, mode: 'insensitive' } } },
          { user: { email: { contains: query, mode: 'insensitive' } } },
          { unitOccupied: { contains: query, mode: 'insensitive' } },
        ],
      },
    });

    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.log('Using placeholder tenant pages count');
    const lowerQuery = query.toLowerCase();
    const filtered = tenants.filter((tenant: TenantData) => 
      tenant.name.toLowerCase().includes(lowerQuery) ||
      tenant.email.toLowerCase().includes(lowerQuery)
    );
    
    return Math.ceil(filtered.length / ITEMS_PER_PAGE);
  }
}

export async function fetchTenantById(id: string) {
  try {
    const data = await prisma.tenant.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, email: true, image: true },
        },
        property: true,
      },
    });

    return data;
  } catch (error) {
    console.log('Using placeholder tenant by id');
    const tenant = tenants.find((t: TenantData) => t.id === id);
    if (tenant) {
      return {
        id: tenant.id,
        user_id: null,
        property_id: null,
        move_in_date: null,
        unit_occupied: null,
        emergency_contact: null,
        name: tenant.name,
        email: tenant.email,
        image: tenant.image_url,
      };
    }
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
    const hashedPassword = tenantData.password ? await bcrypt.hash(tenantData.password, 10) : await bcrypt.hash('defaultpassword', 10);
    const user = await prisma.user.create({
      data: {
        name: tenantData.name,
        email: tenantData.email,
        hashedPassword,
        role: 'tenant',
      },
    });
    
    const tenant = await prisma.tenant.create({
      data: {
        userId: user.id,
        propertyId: tenantData.propertyId,
        moveInDate: tenantData.moveInDate,
        unitOccupied: tenantData.unitOccupied,
        emergencyContact: tenantData.emergencyContact,
      },
    });
    
    return tenant;
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
    const existingTenant = await prisma.tenant.findUnique({
      where: { id },
      select: { userId: true },
    });
    
    if (!existingTenant) {
      throw new Error('Tenant not found');
    }
    
    if (tenantData.name || tenantData.email) {
      await prisma.user.update({
        where: { id: existingTenant.userId },
        data: {
          name: tenantData.name,
          email: tenantData.email,
        },
      });
    }
    
    const updatedTenant = await prisma.tenant.update({
      where: { id },
      data: {
        propertyId: tenantData.propertyId,
        moveInDate: tenantData.moveInDate,
        unitOccupied: tenantData.unitOccupied,
        emergencyContact: tenantData.emergencyContact,
      },
    });
    
    return updatedTenant;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update tenant.');
  }
}

export async function deleteTenant(id: string) {
  try {
    const existingTenant = await prisma.tenant.findUnique({
      where: { id },
      select: { userId: true },
    });
    
    if (!existingTenant) {
      throw new Error('Tenant not found');
    }
    
    await prisma.tenant.delete({
      where: { id },
    });
    
    await prisma.user.delete({
      where: { id: existingTenant.userId },
    });
    
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete tenant.');
  }
}

export async function fetchProperties() {
  try {
    const data = await prisma.property.findMany({
      include: {
        landlord: {
          select: { companyName: true },
        },
      },
      orderBy: { address: 'asc' },
    });

    return data.map((property) => ({
      id: property.id,
      address: property.address,
      total_units: property.totalUnits,
      company_name: property.landlord.companyName,
    }));
  } catch (error) {
    console.log('Using placeholder properties data');
    return [
      { id: '1', address: '123 Main St', total_units: 10, company_name: 'Landie Properties', total_tenants: 8, total_units_occupied: 8 },
      { id: '2', address: '456 Oak Ave', total_units: 8, company_name: 'Apex Realty', total_tenants: 6, total_units_occupied: 6 },
    ];
  }
}

export async function fetchUnitsByProperty(propertyId: string) {
  try {
    const data = await prisma.unit.findMany({
      where: { propertyId },
      orderBy: { unitNumber: 'asc' },
    });

    return data;
  } catch (error) {
    console.log('Using placeholder units data');
    return [
      { id: '1', unitNumber: '101', status: 'occupied' },
      { id: '2', unitNumber: '102', status: 'available' },
      { id: '3', unitNumber: '103', status: 'occupied' },
      { id: '4', unitNumber: '104', status: 'available' },
    ];
  }
}

export async function fetchFilteredLandlords(query: string) {
  try {
    const data = await prisma.landlord.findMany({
      where: {
        OR: [
          { user: { name: { contains: query, mode: 'insensitive' } } },
          { user: { email: { contains: query, mode: 'insensitive' } } },
          { companyName: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        user: {
          select: { name: true, email: true, image: true },
        },
        properties: true,
      },
      orderBy: { user: { name: 'asc' } },
    });

    return data.map((landlord) => ({
      id: landlord.id,
      name: landlord.user.name,
      email: landlord.user.email,
      image: landlord.user.image,
      company_name: landlord.companyName,
      total_properties: landlord.properties.length,
    }));
  } catch (err) {
    console.log('Using placeholder filtered landlords data');
    return [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@landie.com',
        image: null,
        company_name: 'Landie Properties',
        total_properties: 3,
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@apex.com',
        image: null,
        company_name: 'Apex Realty',
        total_properties: 2,
      },
    ].filter((landlord: LandlordData) =>
      landlord.name.toLowerCase().includes(query.toLowerCase()) ||
      landlord.email.toLowerCase().includes(query.toLowerCase()) ||
      landlord.company_name.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export async function fetchLandlordsPages(query: string) {
  try {
    const count = await prisma.landlord.count({
      where: {
        OR: [
          { user: { name: { contains: query, mode: 'insensitive' } } },
          { user: { email: { contains: query, mode: 'insensitive' } } },
          { companyName: { contains: query, mode: 'insensitive' } },
        ],
      },
    });

    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.log('Using placeholder landlord pages count');
    const filtered = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@landie.com',
        image: null,
        company_name: 'Landie Properties',
        total_properties: 3,
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@apex.com',
        image: null,
        company_name: 'Apex Realty',
        total_properties: 2,
      },
    ].filter((landlord: LandlordData) =>
      landlord.name.toLowerCase().includes(query.toLowerCase()) ||
      landlord.email.toLowerCase().includes(query.toLowerCase()) ||
      landlord.company_name.toLowerCase().includes(query.toLowerCase())
    );

    return Math.ceil(filtered.length / ITEMS_PER_PAGE);
  }
}

export async function fetchLandlordById(id: string) {
  try {
    const data = await prisma.landlord.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, email: true, image: true },
        },
      },
    });

    if (data) {
      return {
        id: data.id,
        user_id: data.userId,
        company_name: data.companyName,
        name: data.user.name,
        email: data.user.email,
        image: data.user.image,
      };
    }
    return null;
  } catch (error) {
    console.log('Using placeholder landlord by id');
    const landlords = [
      {
        id: '1',
        user_id: 'user1',
        company_name: 'Landie Properties',
        name: 'John Doe',
        email: 'john@landie.com',
        image: null,
        total_properties: 3,
      },
      {
        id: '2',
        user_id: 'user2',
        company_name: 'Apex Realty',
        name: 'Jane Smith',
        email: 'jane@apex.com',
        image: null,
        total_properties: 2,
      },
    ];

    return landlords.find((l: LandlordData) => l.id === id) || null;
  }
}

export async function createLandlord(landlordData: {
  name: string;
  email: string;
  password?: string;
  companyName: string;
}) {
  try {
    const hashedPassword = landlordData.password ? await bcrypt.hash(landlordData.password, 10) : await bcrypt.hash('defaultpassword', 10);
    const user = await prisma.user.create({
      data: {
        name: landlordData.name,
        email: landlordData.email,
        hashedPassword,
        role: 'landlord',
      },
    });

    const landlord = await prisma.landlord.create({
      data: {
        userId: user.id,
        companyName: landlordData.companyName,
      },
    });

    return landlord;
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
    const existingLandlord = await prisma.landlord.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingLandlord) {
      throw new Error('Landlord not found');
    }

    if (landlordData.name || landlordData.email) {
      await prisma.user.update({
        where: { id: existingLandlord.userId },
        data: {
          name: landlordData.name,
          email: landlordData.email,
        },
      });
    }

    const updatedLandlord = await prisma.landlord.update({
      where: { id },
      data: {
        companyName: landlordData.companyName,
      },
    });

    return updatedLandlord;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update landlord.');
  }
}

export async function deleteLandlord(id: string) {
  try {
    const existingLandlord = await prisma.landlord.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingLandlord) {
      throw new Error('Landlord not found');
    }

    await prisma.landlord.delete({
      where: { id },
    });

    await prisma.user.delete({
      where: { id: existingLandlord.userId },
    });

    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete landlord.');
  }
}

export async function fetchFilteredProperties(query: string) {
  try {
    const data = await prisma.property.findMany({
      where: {
        OR: [
          { address: { contains: query, mode: 'insensitive' } },
          { landlord: { companyName: { contains: query, mode: 'insensitive' } } },
        ],
      },
      include: {
        landlord: {
          select: { companyName: true },
        },
        tenants: true,
        units: true,
      },
      orderBy: { address: 'asc' },
    });

    return data.map((property) => ({
      id: property.id,
      address: property.address,
      total_units: property.totalUnits,
      company_name: property.landlord.companyName,
      total_tenants: property.tenants.length,
      total_units_occupied: property.units.filter((u: { status: string }) => u.status === 'occupied').length,
    }));
  } catch (err) {
    console.log('Using placeholder filtered properties data');
    return [
      {
        id: '1',
        address: '123 Main St',
        total_units: 10,
        company_name: 'Landie Properties',
        total_tenants: 8,
        total_units_occupied: 8,
      },
      {
        id: '2',
        address: '456 Oak Ave',
        total_units: 8,
        company_name: 'Apex Realty',
        total_tenants: 6,
        total_units_occupied: 6,
      },
    ].filter((property: PropertyData) =>
      property.address.toLowerCase().includes(query.toLowerCase()) ||
      property.company_name.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export async function fetchPropertiesPages(query: string) {
  try {
    const count = await prisma.property.count({
      where: {
        OR: [
          { address: { contains: query, mode: 'insensitive' } },
          { landlord: { companyName: { contains: query, mode: 'insensitive' } } },
        ],
      },
    });

    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.log('Using placeholder properties pages count');
    const filtered = [
      { id: '1', address: '123 Main St', total_units: 10, company_name: 'Landie Properties', total_tenants: 8, total_units_occupied: 8 },
      { id: '2', address: '456 Oak Ave', total_units: 8, company_name: 'Apex Realty', total_tenants: 6, total_units_occupied: 6 },
    ].filter((property: PropertyData) =>
      property.address.toLowerCase().includes(query.toLowerCase()) ||
      property.company_name.toLowerCase().includes(query.toLowerCase())
    );

    return Math.ceil(filtered.length / ITEMS_PER_PAGE);
  }
}

export async function fetchPropertyById(id: string) {
  try {
    const data = await prisma.property.findUnique({
      where: { id },
      include: {
        landlord: {
          select: { companyName: true },
        },
      },
    });

    return data;
  } catch (error) {
    console.log('Using placeholder property by id');
    const properties = [
      {
        id: '1',
        address: '123 Main St',
        total_units: 10,
        company_name: 'Landie Properties',
        total_tenants: 8,
        total_units_occupied: 8,
      },
      {
        id: '2',
        address: '456 Oak Ave',
        total_units: 8,
        company_name: 'Apex Realty',
        total_tenants: 6,
        total_units_occupied: 6,
      },
    ];

    return properties.find((p: PropertyData) => p.id === id) || null;
  }
}

export async function createProperty(propertyData: {
  address: string;
  totalUnits: number;
  landlordId: string;
}) {
  try {
    const result = await prisma.property.create({
      data: {
        address: propertyData.address,
        totalUnits: propertyData.totalUnits,
        landlordId: propertyData.landlordId,
      },
    });

    return result;
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
    const result = await prisma.property.update({
      where: { id },
      data: {
        address: propertyData.address,
        totalUnits: propertyData.totalUnits,
        landlordId: propertyData.landlordId,
      },
    });

    return result;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update property.');
  }
}

export async function deleteProperty(id: string) {
  try {
    await prisma.property.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete property.');
  }
}

