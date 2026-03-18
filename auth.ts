import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { z } from 'zod';
import { prisma } from '@/app/lib/prisma';
import * as bcrypt from 'bcrypt';

async function getUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        hashedPassword: true,
        role: true,
        emailVerified: true,
        landlords: {
          select: { id: true, approvedAt: true },
          take: 1,
        },
      },
    });
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    // ── Google provider ──────────────────────────────────────────────────
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ── Credentials provider ─────────────────────────────────────────────
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);

        if (!user) return null;

        if (!user.emailVerified) {
          throw new Error('EmailNotVerified');
        }

        const passwordsMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordsMatch) return null;

        const landlord = user.landlords[0] ?? null;
        const isApproved = user.role === 'landlord' ? !!landlord?.approvedAt : true;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isApproved,
          landlordId: landlord?.id ?? null,
        };
      },
    }),
  ],

  callbacks: {
    ...authConfig.callbacks,

    async signIn({ user, account }) {
      // Only handle Google sign-ins here
      if (account?.provider !== 'google') return true;

      const email = user.email;
      if (!email) return false;

      try {
        const existing = await prisma.user.findUnique({ where: { email } });

        if (!existing) {
          // New Google user — create with role 'pending'
          // Role will be finalized at /api/complete-google-signup
          await prisma.user.create({
            data: {
              name: user.name ?? '',
              email,
              hashedPassword: '', // Google users don't use password
              role: 'pending',
              emailVerified: new Date(), // Google already verified the email
            },
          });
        }

        return true;
      } catch (error) {
        console.error('Google sign-in error:', error);
        return false;
      }
    },

    async jwt({ token, user, account }: any) {
      if (user) {
        // Fetch full user from DB to get role, landlordId etc.
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email ?? token.email },
          select: {
            id: true,
            role: true,
            emailVerified: true,
            landlords: { select: { id: true, approvedAt: true }, take: 1 },
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.isApproved = dbUser.role === 'landlord'
            ? !!(dbUser.landlords[0]?.approvedAt)
            : dbUser.role === 'pending'
            ? false
            : true;
          token.landlordId = dbUser.landlords[0]?.id ?? null;
          token.provider = account?.provider ?? token.provider ?? 'credentials';
        }
      }
      return token;
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isApproved = token.isApproved;
        session.user.landlordId = token.landlordId;
        session.user.provider = token.provider;
      }
      return session;
    },
  },
});
