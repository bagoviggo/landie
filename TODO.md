# TODO - Use Placeholder Data

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

### Landlords CRUD Implementation
- [x] Update Types (`app/lib/types.ts`): Add LandlordData, CreateLandlordPayload, UpdateLandlordPayload, LandlordsTableType
- [x] Add Data Functions (`app/lib/data.ts`): fetchFilteredLandlords, fetchLandlordsPages, fetchLandlordById, createLandlord, updateLandlord, deleteLandlord
- [x] Create API Routes: `app/api/landlords/route.ts`, `app/api/landlords/[id]/route.ts`
- [x] Create UI Components: table.tsx, buttons.tsx, create-form.tsx, edit-form.tsx
- [x] Create Pages: landlords page, create page, edit page
- [x] Update Navigation: Add landlords link to sidenav (role-based: landlord/admin only)
- [x] Update TODO.md: Track progress

