# TODO - Replace Invoices with Properties (Admin-Only) and Integrate Schema

## ✅ Completed

### Implementation Complete
- Modified `app/lib/data.ts` to use placeholder data when database connection fails
- All data fetching functions now fall back to placeholder data from `app/lib/placeholder-data.ts`
- Dashboard and other pages can now work without a running PostgreSQL database

### Modified Functions
- `fetchRevenue()` - Returns placeholder revenue data on DB error
- `fetchLatestInvoices()` - Returns placeholder invoices on DB error
- `fetchCardData()` - Calculates stats from placeholder data on DB error
- `fetchFilteredInvoices()` - Filters placeholder invoices on DB error
- `fetchInvoicesPages()` - Counts pages from placeholder data on DB error
- `fetchInvoiceById()` - Finds invoice in placeholder data on DB error
- `fetchTenants()` - Returns placeholder tenants on DB error
- `fetchFilteredTenants()` - Filters placeholder tenants on DB error
- `fetchFilteredTenantsPages()` - Counts pages from placeholder data on DB error
- `fetchTenantById()` - Finds tenant in placeholder data on DB error
- `fetchProperties()` - Returns placeholder properties on DB error
- `fetchUnitsByProperty()` - Returns placeholder units on DB error

### How It Works
The data fetching functions now:
1. Try to execute the database query first
2. If the query fails (e.g., due to no database connection), catch the error
3. Return appropriate placeholder data from `app/lib/placeholder-data.ts`

### Notes
- This allows the app to run and display data for testing purposes
- In production with a running database, the real data will be fetched
- The placeholder data provides a consistent experience for development and demo

## 🚧 In Progress

### Replace Invoices with Properties (Admin-Only)
- [ ] Update Navigation: Remove 'Invoices' link, add 'Properties' link (admin-only)
- [ ] Update Types (`app/lib/types.ts`): Add PropertyData, CreatePropertyPayload, UpdatePropertyPayload, PropertiesTableType
- [ ] Add Data Functions (`app/lib/data.ts`): fetchFilteredProperties, fetchPropertiesPages, fetchPropertyById, createProperty, updateProperty, deleteProperty
- [ ] Create API Routes: `app/api/properties/route.ts`, `app/api/properties/[id]/route.ts`
- [ ] Create UI Components: table.tsx, buttons.tsx, create-form.tsx, edit-form.tsx
- [ ] Create Pages: properties page, create page, edit page
- [ ] Update Dashboard: Replace latest invoices with latest properties or relevant metrics
- [ ] Update TODO.md: Track progress

### Schema Integration for Vercel Deployment
- [ ] Review Prisma Schema: Ensure all models are complete and relationships are correct
- [ ] Run Migrations: Generate and apply any pending migrations
- [ ] Update Placeholder Data: Ensure placeholder data matches schema
- [ ] Test Database Connection: Verify schema works with PostgreSQL on Vercel
- [ ] Update Environment Variables: Ensure DATABASE_URL is configured for Vercel

### Landlords CRUD Implementation
- [x] Update Types (`app/lib/types.ts`): Add LandlordData, CreateLandlordPayload, UpdateLandlordPayload, LandlordsTableType
- [x] Add Data Functions (`app/lib/data.ts`): fetchFilteredLandlords, fetchLandlordsPages, fetchLandlordById, createLandlord, updateLandlord, deleteLandlord
- [x] Create API Routes: `app/api/landlords/route.ts`, `app/api/landlords/[id]/route.ts`
- [x] Create UI Components: table.tsx, buttons.tsx, create-form.tsx, edit-form.tsx
- [x] Create Pages: landlords page, create page, edit page
- [x] Update Navigation: Add landlords link to sidenav (role-based: landlord/admin only)
- [x] Update TODO.md: Track progress

### UI/UX Improvements
- [ ] Improve Dashboard Cards: Add properties count, update metrics
- [ ] Enhance Forms: Better validation, error handling, loading states
- [ ] Responsive Design: Ensure all pages work well on mobile
- [ ] Accessibility: Add proper ARIA labels, keyboard navigation
- [ ] Loading States: Add skeletons and loading indicators
- [ ] Error Handling: Better error messages and recovery

### Tenants CRUD Implementation
- [x] Update Types (`app/lib/types.ts`): Add TenantData, CreateTenantPayload, UpdateTenantPayload, TenantsTableType
- [x] Add Data Functions (`app/lib/data.ts`): fetchFilteredTenants, fetchTenantsPages, fetchTenantById, createTenant, updateTenant, deleteTenant
- [x] Create API Routes: `app/api/tenants/route.ts`, `app/api/tenants/[id]/route.ts`
- [x] Create UI Components: table.tsx, buttons.tsx, create-form.tsx, edit-form.tsx
- [x] Create Pages: tenants page, create page, edit page
- [x] Update Navigation: Add tenants link to sidenav
- [x] Update TODO.md: Track progress

