import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
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
