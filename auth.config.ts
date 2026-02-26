import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const user = auth?.user as any;
      const role = user?.role as string | undefined;
      const isApproved = user?.isApproved as boolean | undefined;

      const path = nextUrl.pathname;
      const isOnDashboard = path.startsWith('/dashboard');
      const isOnLogin = path.startsWith('/login');
      const isOnSignup = path.startsWith('/signup');
      const isOnPendingApproval = path.startsWith('/pending-approval');

      // Not logged in
      if (!isLoggedIn) {
        if (isOnDashboard || isOnPendingApproval) return false;
        return true;
      }

      // Logged in as an unapproved landlord
      if (role === 'landlord' && !isApproved) {
        if (isOnPendingApproval) return true;
        return Response.redirect(new URL('/pending-approval', nextUrl));
      }

      // Logged in and approved — redirect away from login/signup
      if (isOnLogin || isOnSignup) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
    // JWT and session callbacks live here so they run in BOTH
    // edge (middleware) and Node.js (API routes) contexts
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        // Default to true for non-landlords (admins, tenants)
        token.isApproved = user.isApproved ?? true;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isApproved = token.isApproved;
      }
      return session;
    },
  },
  providers: [],
  secret: process.env.AUTH_SECRET || 'development-secret-change-in-production',
  trustHost: true,
} satisfies NextAuthConfig;
