# TODO - Hardcode Admin Credentials

## ✅ Completed

### Implementation Complete
- Modified `auth.ts` to add hardcoded admin user credentials
- Admin credentials are checked before database lookup
- User object returned with admin role upon successful authentication

### Admin Credentials (Hardcoded)
- **Email:** admin@landie.com
- **Password:** admin123
- **Role:** admin
- **User ID:** admin-001

### How to Test
1. Start your Next.js development server: `npm run dev`
2. Navigate to the login page: `/login`
3. Enter the admin credentials:
   - Email: admin@landie.com
   - Password: admin123
4. Click "Log in" - you should be redirected to the dashboard
5. Verify you have access to all dashboard features

### Notes
- These credentials are for testing purposes only
- In production, remove the hardcoded admin user and use proper database authentication
- The admin user bypasses the database lookup for faster testing
