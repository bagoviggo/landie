import { notFound } from 'next/navigation';
import { prisma } from '@/app/lib/prisma';
import OnboardingForm from '@/app/ui/onboarding/onboarding-form';
import LandieLogo from '@/app/ui/landie-logo';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function OnboardingPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) notFound();

  // Validate the token exists and hasn't expired
  const record = await prisma.verificationToken.findUnique({
    where: { token },
    select: { expiresAt: true, userId: true },
  });

  if (!record || record.expiresAt < new Date()) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-xl ring-1 ring-gray-100">
          <div className="mb-4 text-5xl">⏰</div>
          <h1 className="mb-2 text-xl font-bold text-gray-900">Link expired</h1>
          <p className="mb-6 text-sm text-gray-500">
            This onboarding link has expired or already been used. Please sign up again to get a new one.
          </p>
          <Link
            href="/signup"
            className="inline-block rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Sign Up Again
          </Link>
        </div>
      </main>
    );
  }

  // Fetch user's name to personalise the page
  const user = await prisma.user.findUnique({
    where: { id: record.userId },
    select: { name: true },
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-100">
          {/* Accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-blue-600 to-blue-400" />

          <div className="px-8 py-8">
            {/* Logo + step indicator */}
            <div className="mb-6 flex items-center justify-between">
              <LandieLogo />
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                Step 2 of 2
              </span>
            </div>

            <h1 className="mb-1 text-2xl font-bold text-gray-900">
              Complete your profile
            </h1>
            <p className="mb-7 text-sm text-gray-500">
              Hey {user?.name?.split(' ')[0] ?? 'there'} 👋 — just a few more details and
              your account will be sent for review.
            </p>

            {/* Progress steps */}
            <div className="mb-8 flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">✓</div>
                <span className="text-xs font-medium text-gray-400">Account created</span>
              </div>
              <div className="h-px flex-1 bg-blue-200" />
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">2</div>
                <span className="text-xs font-semibold text-blue-700">Business details</span>
              </div>
              <div className="h-px flex-1 bg-gray-200" />
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-400">3</div>
                <span className="text-xs font-medium text-gray-400">Pending review</span>
              </div>
            </div>

            <OnboardingForm token={token} />
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Wrong account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">Start over</Link>
        </p>
      </div>
    </main>
  );
}
