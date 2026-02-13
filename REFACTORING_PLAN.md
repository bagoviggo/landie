# Database Refactoring Plan: pg → Prisma Client

## Files to Modify

### 1. Create Prisma Client Instance
- **File**: `app/lib/prisma.ts` (new file)
- Create singleton PrismaClient instance

### 2. Update Authentication
- **File**: `auth.ts`
- Replace `Pool` from `pg` with Prisma Client
- Replace `db.query()` calls with Prisma queries

### 3. Update Server Actions
- **File**: `app/lib/actions.ts`
- Replace `Pool` from `pg` with Prisma Client
- Replace `db.query()` calls with Prisma queries

### 4. Update Data Access Layer
- **File**: `app/lib/data.ts`
- Replace `Pool` from `pg` with Prisma Client
- Replace all SQL queries with Prisma ORM calls

### 5. Update db.ts (optional cleanup)
- **File**: `app/lib/db.ts`
- Can either remove or update to use Prisma

## Implementation Steps
1. Create `app/lib/prisma.ts` with PrismaClient singleton
2. Update `auth.ts` to use Prisma
3. Update `app/lib/actions.ts` to use Prisma  
4. Update `app/lib/data.ts` to use Prisma
5. Run `npx prisma generate` to regenerate client

