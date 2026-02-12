# Tenant CRUD Implementation Plan

## Phase 1: Data Layer
- [x] Update app/lib/data.ts:
  - [x] Fix fetchFilteredTenants to JOIN with user table
  - [x] Fix fetchTenants to JOIN with user table
  - [x] Add fetchFilteredTenantsPages for pagination
  - [x] Add fetchTenantById for edit page
  - [x] Add createTenant function
  - [x] Add updateTenant function
  - [x] Add deleteTenant function
  - [x] Add fetchProperties function
  - [x] Add fetchUnits function

## Phase 2: Types
- [x] Update app/lib/types.ts:
  - [x] Align TenantsTableType with JOIN query results
  - [x] Add CreateTenantPayload type
  - [x] Add UpdateTenantPayload type

## Phase 3: Tenants Page (List)
- [x] Update app/dashboard/tenants/page.tsx:
  - [x] Import and use fetchFilteredTenants
  - [x] Add Create button linking to create page
  - [x] Add search and pagination

## Phase 4: API Routes
- [x] Create app/api/tenants/route.ts:
  - [x] GET - list tenants with query params
  - [x] POST - create new tenant
- [x] Create app/api/tenants/[id]/route.ts:
  - [x] GET - fetch single tenant
  - [x] PUT - update tenant
  - [x] DELETE - delete tenant
- [x] Create app/api/units/route.ts:
  - [x] GET - fetch units by property

## Phase 5: UI Components
- [x] Create app/ui/tenants/buttons.tsx:
  - [x] CreateTenantButton
  - [x] EditTenantButton
  - [x] DeleteTenantButton
- [x] Create app/ui/tenants/create-form.tsx:
  - [x] User fields (name, email)
  - [x] Tenant fields (property, unit, moveInDate, emergencyContact)
- [x] Create app/ui/tenants/edit-form.tsx:
  - [x] Edit form with validation

## Phase 6: Pages
- [x] Create app/dashboard/tenants/create/page.tsx:
  - [x] Create tenant page with form
- [x] Create app/dashboard/tenants/[id]/edit/page.tsx:
  - [x] Edit tenant page with form

## Phase 7: Update Table
- [x] Update app/ui/tenants/table.tsx:
  - [x] Add action column
  - [x] Include Edit/Delete buttons

## Phase 8: Installation & Testing
- [ ] Run npm install to install dependencies
- [ ] Run npm run build to verify build
- [ ] Test listing tenants
- [ ] Test creating tenant
- [ ] Test editing tenant
- [ ] Test deleting tenant
- [ ] Test search and pagination

