import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/app/lib/prisma';
import { sendLandlordOnboardingEmail, sendTenantVerificationEmail } from '@/app/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await auth();
  const role = request.nextUrl.searchParams.get('role') as 'tenant' | 'landlord' | null;

  if (!session?.user?.email) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const email = session.user.email;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, role: true, name: true },
    });

    if (!user) {
      return NextResponse.redirect(new URL('/signup', request.url));
    }

    // If role is already finalized (returning Google user) → go to dashboard
    if (user.role !== 'pending') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Finalize the role for new Google users
    const finalRole = role === 'landlord' ? 'landlord' : 'tenant';

    await prisma.user.update({
      where: { id: user.id },
      data: { role: finalRole },
    });

    if (finalRole === 'landlord') {
      // Create the landlord record and send onboarding email
      await prisma.landlord.create({
        data: { userId: user.id, companyName: '' },
      });

      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const tokenRecord = await prisma.verificationToken.create({
        data: { userId: user.id, expiresAt },
      });

      await sendLandlordOnboardingEmail(email, user.name, tokenRecord.token);

      return NextResponse.redirect(new URL('/check-email', request.url));
    } else {
      // Tenant — Google already verified email, go straight to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } catch (error) {
    console.error('Complete Google signup error:', error);
    return NextResponse.redirect(new URL('/signup', request.url));
  }
}
