'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signup } from '@/app/lib/actions';
import Link from 'next/link';
import {
  AtSymbolIcon,
  KeyIcon,
  UserIcon,
  PhoneIcon,
  ExclamationCircleIcon,
  ArrowRightIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

export default function SignupPage() {
  const [errorMessage, dispatch] = useActionState(signup, undefined);

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
            Join the platform<br />
            <span className="text-blue-300">built for property.</span>
          </h2>
          <p className="text-blue-200 text-base leading-relaxed max-w-sm">
            Whether you're a landlord managing properties or a tenant tracking your lease — Landie gives you the tools you need.
          </p>

          {/* Role cards */}
          <div className="mt-8 space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-900 border border-blue-800">
              <BuildingOfficeIcon className="h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">Landlords</p>
                <p className="text-blue-300 text-xs mt-0.5">Manage properties, track tenants, monitor revenue</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-900 border border-blue-800">
              <UserIcon className="h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">Tenants</p>
                <p className="text-blue-300 text-xs mt-0.5">View invoices, submit maintenance requests</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-950 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">L</span>
          </div>
          <span className="text-blue-950 font-bold text-xl tracking-tight">Landie</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
            <p className="text-sm text-gray-500 mt-1">Get started with Landie today</p>
          </div>

          <form action={dispatch} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Full name
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="John Doe"
                  className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                />
                <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

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

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone number <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+254 700 000000"
                  className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                />
                <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
                  autoComplete="new-password"
                  required
                  minLength={6}
                  placeholder="Min. 6 characters"
                  className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                />
                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'tenant', label: 'Tenant' },
                  { value: 'landlord', label: 'Landlord' },
                ].map(({ value, label }) => (
                  <label
                    key={value}
                    className="relative flex cursor-pointer rounded-lg border border-gray-300 p-3 hover:border-blue-400 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="role"
                      value={value}
                      defaultChecked={value === 'tenant'}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-gray-400">
                Landlord accounts require admin approval before access is granted.
              </p>
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 border border-red-100">
                <ExclamationCircleIcon className="h-4 w-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            <SubmitButton />
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign in
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
      {pending ? 'Creating account...' : 'Create account'}
      {!pending && <ArrowRightIcon className="h-4 w-4" />}
    </button>
  );
}
