'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { authenticate } from '@/app/lib/actions';
import Link from 'next/link';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

function LoginContent() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);
  const searchParams = useSearchParams();
  const verified = searchParams.get('verified') === 'true';
  const tokenError = searchParams.get('error');
  const errorBanner =
    tokenError === 'token-expired' ? 'Your verification link has expired. Please sign up again.' :
    tokenError === 'invalid-token' ? 'Invalid verification link. Please sign up again.' :
    tokenError === 'server-error' ? 'Something went wrong. Please try again.' : null;

  return (
    <main className="flex min-h-screen">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-950 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-800 opacity-30" />
          <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-blue-900 opacity-40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-800 opacity-20" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-950 font-black text-lg">L</span>
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">Landie</span>
          </div>
        </div>

        {/* Tagline */}
        <div className="relative z-10">
          <h2 className="text-white text-4xl font-bold leading-tight mb-4">
            Property management,<br />
            <span className="text-blue-300">simplified.</span>
          </h2>
          <p className="text-blue-200 text-base leading-relaxed max-w-sm">
            A centralized hub for landlords, tenants, and administrators to manage properties, invoices, and maintenance — all in one place.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-8">
            {['Properties', 'Tenants', 'Invoices', 'Maintenance', 'Reports'].map((f) => (
              <span
                key={f}
                className="px-3 py-1 rounded-full bg-blue-900 text-blue-200 text-xs font-medium border border-blue-800"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-950 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">L</span>
          </div>
          <span className="text-blue-950 font-bold text-xl tracking-tight">Landie</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to your account to continue</p>
          </div>

          <form action={dispatch} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                />
                <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                />
                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Verification success banner */}
            {verified && (
              <div className="mb-2 flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3">
                <CheckCircleIcon className="h-5 w-5 shrink-0 text-green-600" />
                <p className="text-sm font-medium text-green-700">Email verified! You can now log in.</p>
              </div>
            )}
            {/* Token error banner */}
            {errorBanner && (
              <div className="mb-2 flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                <ExclamationTriangleIcon className="h-5 w-5 shrink-0 text-amber-600" />
                <p className="text-sm font-medium text-amber-700">{errorBanner}</p>
              </div>
            )}
            {/* Error */}
            {errorMessage && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 border border-red-100">
                <ExclamationCircleIcon className="h-4 w-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            <SubmitButton />
          </form>

          {/* Signup link */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? 'Signing in...' : 'Sign in'}
      {!pending && <ArrowRightIcon className="h-4 w-4" />}
    </button>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
