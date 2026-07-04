'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signup } from '@/app/lib/actions';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import LandieLogo from '@/app/ui/landie-logo';
import {
  BuildingOfficeIcon, UserIcon, AtSymbolIcon, KeyIcon,
  PhoneIcon, ExclamationCircleIcon, ArrowRightIcon, CheckIcon,
} from '@heroicons/react/24/outline';

const ROLES = [
  {
    value: 'tenant',
    label: "I'm a Tenant",
    icon: UserIcon,
    badge: 'Free account',
    bullets: ['View invoices & lease details', 'Submit maintenance requests', 'Track payment history'],
    panelLabel: 'Tenant Portal',
    panelTitle: 'Feel right at home in your rental',
    panelSub: 'Everything you need to manage your rental life, in one place.',
  },
  {
    value: 'landlord',
    label: "I'm a Landlord",
    icon: BuildingOfficeIcon,
    badge: 'Requires approval',
    bullets: ['Manage properties & units', 'Track revenue & invoices', 'Handle maintenance requests'],
    panelLabel: 'Landlord Portal',
    panelTitle: 'Manage your portfolio with ease',
    panelSub: 'A complete dashboard for landlords — from single units to large portfolios.',
  },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Creating account…' : 'Create account'}
      {!pending && <ArrowRightIcon className="h-4 w-4" />}
    </button>
  );
}

export default function SignupPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<'tenant' | 'landlord'>('tenant');
  const [errorMessage, dispatch] = useActionState(signup, undefined);
  const active = ROLES.find((r) => r.value === selectedRole)!;

  return (
    <main className="flex min-h-screen">

      {/* ── LEFT: form ── */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto bg-white px-6 py-12">
        <div className="mb-8 lg:hidden"><LandieLogo /></div>

        <div className="w-full max-w-sm">

          {/* Step indicator */}
          <div className="mb-6 flex items-center gap-1.5">
            {([1, 2] as const).map((n) => (
              <div key={n} className="flex items-center gap-1.5">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  step > n ? 'bg-green-500 text-white' : step === n ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {step > n ? <CheckIcon className="h-3.5 w-3.5" /> : n}
                </div>
                <span className={`text-xs font-medium ${step === n ? 'text-gray-800' : 'text-gray-400'}`}>
                  {n === 1 ? 'Choose role' : 'Your details'}
                </span>
                {n < 2 && <div className={`mx-1 h-px w-6 transition-colors ${step > 1 ? 'bg-green-400' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* STEP 1 */}
            {step === 1 && (
              <motion.div key="s1"
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>

                <h1 className="mb-1 text-2xl font-bold text-gray-900">Account type</h1>
                <p className="mb-6 text-sm text-gray-500">Choose the account type that suits your needs.</p>

                <div className="space-y-3 mb-6">
                  {ROLES.map((role) => {
                    const Icon = role.icon;
                    const sel = selectedRole === role.value;
                    return (
                      <button key={role.value} type="button"
                        onClick={() => setSelectedRole(role.value as 'tenant' | 'landlord')}
                        className={`group relative w-full rounded-2xl border-2 p-4 text-left transition-all ${
                          sel ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}>
                        <span className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-xs font-medium ${
                          sel ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                          {role.badge}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                            sel ? 'bg-blue-600' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                            {sel
                              ? <CheckIcon className="h-5 w-5 text-white" />
                              : <Icon className="h-5 w-5 text-gray-500" />}
                          </div>
                          <div>
                            <p className={`font-semibold ${sel ? 'text-blue-700' : 'text-gray-800'}`}>{role.label}</p>
                            <p className="mt-0.5 text-xs text-gray-500">{role.bullets[0]}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button type="button" onClick={() => setStep(2)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  Continue
                  <ArrowRightIcon className="h-4 w-4" />
                </button>

                <p className="mt-6 text-center text-sm text-gray-500">
                  Already have an account?{' '}
                  <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">Sign in</Link>
                </p>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div key="s2"
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.18 }}>

                <div className="mb-6 flex items-start gap-3">
                  <button type="button" onClick={() => setStep(1)}
                    className="mt-1 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Your details</h1>
                    <p className="text-sm text-gray-500">
                      Signing up as a{' '}
                      <span className="font-semibold text-blue-600">
                        {selectedRole === 'landlord' ? 'Landlord' : 'Tenant'}
                      </span>
                    </p>
                  </div>
                </div>

                <form action={dispatch} className="space-y-4">
                  <input type="hidden" name="role" value={selectedRole} />

                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">Full name</label>
                    <div className="relative">
                      <input id="name" name="name" type="text" required autoComplete="name" placeholder="Jane Mwangi"
                        className="block w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">Email address</label>
                    <div className="relative">
                      <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com"
                        className="block w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700">
                      Phone <span className="font-normal text-gray-400">(optional)</span>
                    </label>
                    <div className="relative">
                      <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+254 712 345 678"
                        className="block w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                      <input id="password" name="password" type="password" required autoComplete="new-password" minLength={6} placeholder="Min. 6 characters"
                        className="block w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5">
                      <ExclamationCircleIcon className="h-4 w-4 shrink-0 text-red-500" />
                      <p className="text-sm text-red-600">{errorMessage}</p>
                    </div>
                  )}

                  {selectedRole === 'landlord' && (
                    <p className="rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
                      🏢 You'll complete your business profile in the next step before admin review.
                    </p>
                  )}

                  <SubmitButton />
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                  Already have an account?{' '}
                  <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">Sign in</Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── RIGHT: dynamic brand panel ── */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between bg-blue-950 p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-800 opacity-30" />
          <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-blue-900 opacity-40" />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-800 opacity-20" />
        </div>
        <div className="relative z-10"><LandieLogo /></div>
        <AnimatePresence mode="wait">
          <motion.div key={selectedRole}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}
            className="relative z-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-400">{active.panelLabel}</p>
            <h2 className="mb-4 text-4xl font-bold leading-tight text-white">{active.panelTitle}</h2>
            <p className="mb-8 text-base leading-relaxed text-blue-200">{active.panelSub}</p>
            <ul className="space-y-3">
              {active.bullets.map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/30">
                    <CheckIcon className="h-3.5 w-3.5 text-blue-300" />
                  </div>
                  <span className="text-sm text-blue-100">{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
        <div className="relative z-10">
          <p className="text-xs text-blue-400">
            {selectedRole === 'landlord'
              ? '🔐 Landlord accounts are reviewed by our team before access is granted.'
              : '✅ Tenant accounts are activated instantly after email verification.'}
          </p>
        </div>
      </div>

    </main>
  );
}
