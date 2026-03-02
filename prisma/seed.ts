const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // ─── Admin account (preserved from original seed) ────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME;

  if (!adminEmail || !adminPassword || !adminName) {
    throw new Error('Missing required env vars: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME');
  }

  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { hashedPassword: hashedAdminPassword, role: 'admin' },
    create: { name: adminName, email: adminEmail, hashedPassword: hashedAdminPassword, role: 'admin' },
  });
  console.log(`✅ Admin: ${admin.email}`);

  // ─── Wipe existing sample data (leave admin intact) ───────────────────────
  console.log('🗑  Clearing existing sample data...');
  await prisma.maintenance.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.property.deleteMany();
  await prisma.landlord.deleteMany();
  await prisma.revenue.deleteMany();
  // Delete non-admin users
  await prisma.user.deleteMany({ where: { role: { not: 'admin' } } });

  const defaultPassword = await bcrypt.hash('password123', 10);

  // ─── Landlords ────────────────────────────────────────────────────────────
  console.log('🏢 Seeding landlords...');

  const landlordUser1 = await prisma.user.create({
    data: { name: 'James Mwangi', email: 'james@sunriseproperties.co.ke', hashedPassword: defaultPassword, role: 'landlord', phone: '+254712345678' },
  });
  const landlordUser2 = await prisma.user.create({
    data: { name: 'Amina Hassan', email: 'amina@pearlestates.co.ke', hashedPassword: defaultPassword, role: 'landlord', phone: '+254723456789' },
  });
  const landlordUser3 = await prisma.user.create({
    data: { name: 'David Ochieng', email: 'david@lakesidehousing.co.ke', hashedPassword: defaultPassword, role: 'landlord', phone: '+254734567890' },
  });

  const now = new Date();
  const [landlord1, landlord2, landlord3] = await Promise.all([
    prisma.landlord.create({ data: { userId: landlordUser1.id, companyName: 'Sunrise Properties', approvedAt: now, approvedBy: admin.id } }),
    prisma.landlord.create({ data: { userId: landlordUser2.id, companyName: 'Pearl Estates', approvedAt: now, approvedBy: admin.id } }),
    prisma.landlord.create({ data: { userId: landlordUser3.id, companyName: 'Lakeside Housing', approvedAt: now, approvedBy: admin.id } }),
  ]);
  console.log(`  ✓ 3 landlords created`);

  // ─── Properties + Units ───────────────────────────────────────────────────
  console.log('🏠 Seeding properties and units...');

  // Landlord 1 — numeric units
  const prop1 = await prisma.property.create({ data: { address: 'Westlands Gardens, Nairobi', totalUnits: 12, landlordId: landlord1.id } });
  await prisma.unit.createMany({ data: Array.from({ length: 12 }, (_, i) => ({ propertyId: prop1.id, unitNumber: String(i + 1).padStart(3, '0'), status: i < 9 ? 'occupied' : 'available' })) });

  // Landlord 1 — floor-based units
  const prop2 = await prisma.property.create({ data: { address: 'Karen Plains Apartments, Nairobi', totalUnits: 16, landlordId: landlord1.id } });
  const prop2Units: string[] = [];
  for (const floor of ['GF', 'A', 'B', 'C']) for (let u = 1; u <= 4; u++) prop2Units.push(`${floor}${u}`);
  await prisma.unit.createMany({ data: prop2Units.map((u, i) => ({ propertyId: prop2.id, unitNumber: u, status: i < 11 ? 'occupied' : 'available' })) });

  // Landlord 2 — prefix units
  const prop3 = await prisma.property.create({ data: { address: 'Kilimani Court, Nairobi', totalUnits: 10, landlordId: landlord2.id } });
  await prisma.unit.createMany({ data: Array.from({ length: 10 }, (_, i) => ({ propertyId: prop3.id, unitNumber: `KL-${String(i + 1).padStart(2, '0')}`, status: i < 7 ? 'occupied' : 'available' })) });

  // Landlord 2 — floor-based
  const prop4 = await prisma.property.create({ data: { address: 'Lavington Heights, Nairobi', totalUnits: 8, landlordId: landlord2.id } });
  const prop4Units: string[] = [];
  for (const floor of ['F1', 'F2']) for (let u = 1; u <= 4; u++) prop4Units.push(`${floor}-${String(u).padStart(2, '0')}`);
  await prisma.unit.createMany({ data: prop4Units.map((u, i) => ({ propertyId: prop4.id, unitNumber: u, status: i < 6 ? 'occupied' : 'available' })) });

  // Landlord 3
  const prop5 = await prisma.property.create({ data: { address: 'Kisumu Lakefront Residences', totalUnits: 6, landlordId: landlord3.id } });
  await prisma.unit.createMany({ data: Array.from({ length: 6 }, (_, i) => ({ propertyId: prop5.id, unitNumber: `LF-${String(i + 1).padStart(2, '0')}`, status: i < 4 ? 'occupied' : 'available' })) });

  console.log(`  ✓ 5 properties, units created`);

  // ─── Tenants ──────────────────────────────────────────────────────────────
  console.log('👤 Seeding tenants...');

  const tenantData = [
    // prop1 (9 occupied units: 001-009)
    { name: 'Grace Wanjiku', email: 'grace@email.com', propertyId: prop1.id, unit: '001', daysAgo: 400 },
    { name: 'Brian Kamau', email: 'brian@email.com', propertyId: prop1.id, unit: '002', daysAgo: 320 },
    { name: 'Fatuma Ali', email: 'fatuma@email.com', propertyId: prop1.id, unit: '003', daysAgo: 280 },
    { name: 'Peter Njoroge', email: 'peter@email.com', propertyId: prop1.id, unit: '004', daysAgo: 200 },
    { name: 'Sarah Otieno', email: 'sarah@email.com', propertyId: prop1.id, unit: '005', daysAgo: 150 },
    // prop2 (11 occupied units)
    { name: 'Ahmed Salim', email: 'ahmed@email.com', propertyId: prop2.id, unit: 'GF1', daysAgo: 500 },
    { name: 'Lucy Ndungu', email: 'lucy@email.com', propertyId: prop2.id, unit: 'GF2', daysAgo: 350 },
    { name: 'Moses Kiprono', email: 'moses@email.com', propertyId: prop2.id, unit: 'A1', daysAgo: 300 },
    { name: 'Janet Mugo', email: 'janet@email.com', propertyId: prop2.id, unit: 'A2', daysAgo: 240 },
    { name: 'Kevin Omondi', email: 'kevin@email.com', propertyId: prop2.id, unit: 'B1', daysAgo: 180 },
    // prop3 (7 occupied)
    { name: 'Zara Mohamed', email: 'zara@email.com', propertyId: prop3.id, unit: 'KL-01', daysAgo: 420 },
    { name: 'Tom Kariuki', email: 'tom@email.com', propertyId: prop3.id, unit: 'KL-02', daysAgo: 310 },
    { name: 'Esther Chebet', email: 'esther@email.com', propertyId: prop3.id, unit: 'KL-03', daysAgo: 260 },
    // prop4 (6 occupied)
    { name: 'John Muthomi', email: 'john@email.com', propertyId: prop4.id, unit: 'F1-01', daysAgo: 380 },
    { name: 'Mary Achieng', email: 'mary@email.com', propertyId: prop4.id, unit: 'F1-02', daysAgo: 290 },
    // prop5 (4 occupied)
    { name: 'Samuel Onyango', email: 'samuel@email.com', propertyId: prop5.id, unit: 'LF-01', daysAgo: 450 },
    { name: 'Ruth Auma', email: 'ruth@email.com', propertyId: prop5.id, unit: 'LF-02', daysAgo: 210 },
  ];

  const createdTenants: any[] = [];
  for (const t of tenantData) {
    const user = await prisma.user.create({
      data: { name: t.name, email: t.email, hashedPassword: defaultPassword, role: 'tenant' },
    });
    const moveInDate = new Date();
    moveInDate.setDate(moveInDate.getDate() - t.daysAgo);
    const tenant = await prisma.tenant.create({
      data: {
        userId: user.id,
        propertyId: t.propertyId,
        unitOccupied: t.unit,
        moveInDate,
        emergencyContact: 'Emergency Contact: +254700000000',
      },
    });
    createdTenants.push({ ...tenant, propertyId: t.propertyId });
  }
  console.log(`  ✓ ${createdTenants.length} tenants created`);

  // ─── Invoices (6 months of history) ──────────────────────────────────────
  console.log('🧾 Seeding invoices...');

  // Rent amounts per property
  const rentAmounts: Record<string, number> = {
    [prop1.id]: 45000,
    [prop2.id]: 65000,
    [prop3.id]: 55000,
    [prop4.id]: 80000,
    [prop5.id]: 35000,
  };

  let invoiceCount = 0;
  for (const tenant of createdTenants) {
    const monthlyRent = rentAmounts[tenant.propertyId] * 100; // store in cents
    for (let monthsAgo = 5; monthsAgo >= 0; monthsAgo--) {
      const date = new Date();
      date.setDate(1);
      date.setMonth(date.getMonth() - monthsAgo);

      // Vary statuses realistically:
      // old months mostly paid, current month mix of pending/paid/late
      let status: string;
      if (monthsAgo >= 3) {
        // older months: 85% paid, 15% late
        status = Math.random() < 0.85 ? 'paid' : 'late';
      } else if (monthsAgo >= 1) {
        // recent months: 70% paid, 20% pending, 10% late
        const r = Math.random();
        status = r < 0.70 ? 'paid' : r < 0.90 ? 'pending' : 'late';
      } else {
        // current month: 40% paid, 50% pending, 10% late
        const r = Math.random();
        status = r < 0.40 ? 'paid' : r < 0.90 ? 'pending' : 'late';
      }

      await prisma.invoice.create({
        data: { tenantId: tenant.id, amount: monthlyRent, status, date },
      });
      invoiceCount++;
    }
  }
  console.log(`  ✓ ${invoiceCount} invoices created`);

  // ─── Revenue records (matches paid invoices, aggregated by month) ─────────
  console.log('📈 Seeding revenue records...');

  const paidInvoices = await prisma.invoice.findMany({ where: { status: 'paid' }, select: { amount: true, date: true } });
  const revenueMap: Record<string, number> = {};
  for (const inv of paidInvoices) {
    const d = new Date(inv.date);
    const key = d.toLocaleString('default', { month: 'short' });
    revenueMap[key] = (revenueMap[key] || 0) + inv.amount;
  }
  await prisma.revenue.createMany({
    data: Object.entries(revenueMap).map(([month, revenue]) => ({ month, revenue })),
  });
  console.log(`  ✓ ${Object.keys(revenueMap).length} revenue months created`);

  // ─── Maintenance requests ─────────────────────────────────────────────────
  console.log('🔧 Seeding maintenance requests...');

  const allUnits = await prisma.unit.findMany({ where: { status: 'occupied' }, take: 20 });
  const issues = [
    { description: 'Kitchen sink drains slowly, possible blockage in the pipe', status: 'open' },
    { description: 'Bathroom ceiling has a water stain — possible leak from unit above', status: 'open' },
    { description: 'Main door lock stiff and difficult to turn with key', status: 'in_progress' },
    { description: 'Living room light fitting flickering intermittently', status: 'in_progress' },
    { description: 'Hot water not reaching bathroom — cold water only', status: 'open' },
    { description: 'Balcony door does not close properly, gap on left side', status: 'resolved' },
    { description: 'Kitchen tap dripping constantly when turned off', status: 'resolved' },
    { description: 'Mould patch appearing on bedroom wall near window', status: 'open' },
    { description: 'Parking gate remote not working, needs reprogramming', status: 'in_progress' },
    { description: 'Toilet flush mechanism broken — cistern not refilling', status: 'resolved' },
    { description: 'Window latch broken on second bedroom, cannot lock', status: 'open' },
    { description: 'AC unit making loud rattling noise when running', status: 'in_progress' },
  ];

  for (let i = 0; i < Math.min(issues.length, allUnits.length); i++) {
    const daysAgo = Math.floor(Math.random() * 60);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    await prisma.maintenance.create({
      data: { unitId: allUnits[i].id, description: issues[i].description, status: issues[i].status, date },
    });
  }
  console.log(`  ✓ ${Math.min(issues.length, allUnits.length)} maintenance requests created`);

  console.log('\n✅ Database seeded successfully!');
  console.log('\n📋 Login credentials:');
  console.log(`  Admin:    ${adminEmail} / ${adminPassword}`);
  console.log(`  Landlord: james@sunriseproperties.co.ke / password123`);
  console.log(`  Landlord: amina@pearlestates.co.ke / password123`);
  console.log(`  Landlord: david@lakesidehousing.co.ke / password123`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
