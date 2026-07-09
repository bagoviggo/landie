import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 30, // 30mins
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
      const isOnOnboarding = path.startsWith('/onboarding');
      const isOnCheckEmail = path.startsWith('/check-email');

      if (!isLoggedIn) {
        if (isOnDashboard || isOnPendingApproval) return false;
        return true;
      }

      // Allow onboarding and check-email for everyone (public)
      if (isOnOnboarding || isOnCheckEmail) return true;

      // Unapproved landlords can only see the pending page
      if (role === 'landlord' && !isApproved) {
        if (isOnPendingApproval) return true;
        return Response.redirect(new URL('/pending-approval', nextUrl));
      }

      // Logged in users redirected away from login/signup
      if (isOnLogin || isOnSignup) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },

    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isApproved = user.isApproved ?? true;
        token.landlordId = user.landlordId ?? null;
      }
      return token;
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isApproved = token.isApproved;
        session.user.landlordId = token.landlordId;
      }
      return session;
    },
  },
  providers: [],
  secret: process.env.AUTH_SECRET || 'development-secret-change-in-production',
  trustHost: true,
} satisfies NextAuthConfig;
