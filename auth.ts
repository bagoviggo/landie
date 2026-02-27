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
});
