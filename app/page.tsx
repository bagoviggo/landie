'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandieLogo from '@/app/ui/landie-logo';
import {
  CheckCircleIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightIcon,
  HomeModernIcon,
  UsersIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

// ── Fade-up variant reused across sections ──────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' } }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7 } },
};

// ── Features ───────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: BuildingOfficeIcon,
    title: 'Property & Unit Management',
    desc: 'Create properties, auto-generate units with flexible naming schemes, and track occupancy in real time.',
  },
  {
    icon: BanknotesIcon,
    title: 'Invoice & Payment Tracking',
    desc: 'Issue invoices, mark payments, and monitor revenue trends across all your properties at a glance.',
  },
  {
    icon: UsersIcon,
    title: 'Tenant Lifecycle',
    desc: 'Onboard tenants, store emergency contacts, track move-in dates and unit assignments effortlessly.',
  },
  {
    icon: WrenchScrewdriverIcon,
    title: 'Maintenance Requests',
    desc: 'Log and triage maintenance jobs from open to in-progress to resolved — all in one place.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Role-Based Access',
    desc: 'Admin, landlord, and tenant roles with scoped data — each user only ever sees what they need.',
  },
  {
    icon: ChartBarIcon,
    title: 'Analytics Dashboard',
    desc: 'Revenue charts, occupancy stats, and invoice summaries give you a live pulse on your portfolio.',
  },
];

// ── Nav links ────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { href: '/houses', label: 'Find a Home' },
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
];

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#0b1120] text-white overflow-x-hidden">

      {/* ── NAVBAR ──────────────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#0b1120]/90 backdrop-blur-md shadow-lg shadow-black/30' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <LandieLogo />
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors ${
                  l.label === 'Find a Home'
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-gray-200 transition hover:border-white/50 hover:text-white"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden rounded-lg p-2 text-gray-300 hover:bg-white/10"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-[#0f1a2e]/95 backdrop-blur-md border-t border-white/10"
            >
              <div className="flex flex-col gap-1 px-4 py-4">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                      l.label === 'Find a Home'
                        ? 'text-blue-400 hover:bg-blue-400/10'
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3">
                  <Link href="/login" onClick={() => setMenuOpen(false)}
                    className="rounded-lg border border-white/20 px-4 py-2.5 text-center text-sm font-medium text-gray-200">
                    Log In
                  </Link>
                  <Link href="/signup" onClick={() => setMenuOpen(false)}
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white">
                    Sign Up Free
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-16">

        {/* Background image with dark overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-desktop.png"
            alt="Modern apartment buildings"
            fill
            className="object-cover object-center opacity-25"
            priority
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1120]/70 via-[#0b1120]/50 to-[#0b1120]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1120] via-transparent to-transparent" />
        </div>

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/3 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Headline */}
            <motion.h1
              variants={fadeUp} initial="hidden" animate="show" custom={0}
              className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl"
            >
              Manage Every{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Property
              </span>
              <br />With Confidence
            </motion.h1>

            {/* Sub */}
            <motion.p
              variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="mb-10 max-w-xl text-lg leading-relaxed text-gray-300"
            >
              Landie brings landlords, tenants, and properties under one roof.
              Track invoices, manage units, handle maintenance — all from a single elegant dashboard.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/signup"
                className="group flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-blue-600/30 transition hover:bg-blue-500 hover:shadow-blue-500/30"
              >
                Get Started Free
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/houses"
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 hover:border-white/40"
              >
                <HomeModernIcon className="h-4 w-4 text-blue-400" />
                Find a Home
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}
            className="h-5 w-0.5 bg-gradient-to-b from-blue-400 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── MARQUEE TICKER ────────────────────────────────────────────────── */}
      <div className="relative z-10 -mt-1 overflow-hidden border-y border-white/10 bg-white/5 py-4 backdrop-blur-sm">
        {/* Fade masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#0b1120] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#0b1120] to-transparent" />

        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
          className="flex w-max gap-0"
        >
          {[...Array(2)].map((_, copy) => (
            <div key={copy} className="flex items-center gap-10 px-5">
              {[
                { icon: '🏢', text: 'Multi-unit Properties' },
                { icon: '📋', text: 'Lease Management' },
                { icon: '💳', text: 'Invoice Tracking' },
                { icon: '🔧', text: 'Maintenance Requests' },
                { icon: '👥', text: 'Tenant Onboarding' },
                { icon: '📊', text: 'Revenue Analytics' },
                { icon: '🔐', text: 'Role-Based Access' },
                { icon: '✉️', text: 'Email Verification' },
                { icon: '🏠', text: 'Vacancy Listings' },
                { icon: '⚡', text: 'Real-time Updates' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2.5 whitespace-nowrap">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-sm font-medium text-gray-400">{item.text}</span>
                  <span className="ml-6 text-white/15">◆</span>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show"
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">Everything you need</p>
          <h2 className="text-3xl font-bold sm:text-4xl">Built for how landlords actually work</h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            From a single unit to a large portfolio — Landie scales with your business and keeps you in control.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp} initial="hidden" whileInView="show" custom={i % 3}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-400/40 hover:bg-white/8"
            >
              {/* Glow on hover */}
              <div className="absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: 'radial-gradient(400px at 50% 0%, rgba(59,130,246,0.08), transparent)' }} />

              <div className="relative">
                <div className="mb-4 inline-flex rounded-xl border border-blue-400/20 bg-blue-400/10 p-3">
                  <f.icon className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PRODUCT PREVIEW ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-[#0f1e3d] to-[#0b1120]" />
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex flex-col items-center gap-10 px-6 py-16 text-center md:px-12 lg:flex-row lg:text-left">
            {/* Text */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="show"
              viewport={{ once: true }}
              className="flex-1"
            >
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">For landlords</p>
              <h2 className="mb-5 text-3xl font-bold leading-snug sm:text-4xl">
                Your entire portfolio,<br />one clean dashboard
              </h2>
              <ul className="mb-8 space-y-3 text-left inline-block">
                {[
                  'Real-time revenue & occupancy stats',
                  'Approve or reject tenant applications',
                  'Generate and send invoices instantly',
                  'Maintenance request tracking built in',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-300">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-blue-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
              >
                Start Managing
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </motion.div>

            {/* Image */}
            <motion.div
              variants={fadeIn} initial="hidden" whileInView="show"
              viewport={{ once: true }}
              className="flex-1 w-full max-w-lg"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
                {/* Glassmorphism overlay on image */}
                <Image
                  src="/hero-desktop.png"
                  alt="Landie dashboard preview"
                  width={600}
                  height={400}
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 to-transparent" />

                {/* Floating glass card */}
                <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-white">KES 284,000</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Occupancy rate</p>
                      <p className="text-2xl font-bold text-green-400">91%</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FIND A HOME CTA ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show"
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f1e3d] to-[#0b1120] px-6 py-14 text-center sm:px-12"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

          <HomeModernIcon className="mx-auto mb-4 h-12 w-12 text-blue-400" />
          <h2 className="mb-3 text-3xl font-bold sm:text-4xl">Looking for a place to stay?</h2>
          <p className="mb-8 text-gray-400 max-w-md mx-auto">
            Browse verified vacant listings from approved landlords — no account needed.
          </p>
          <Link
            href="/houses"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-sm font-semibold text-blue-950 shadow-xl transition hover:bg-blue-50"
          >
            Browse Listings
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 bg-[#070e1a]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <LandieLogo />
            <nav className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-white transition">{l.label}</Link>
              ))}
              <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition">Terms</Link>
            </nav>
          </div>
          <p className="mt-8 text-center text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Landie. All rights reserved.
          </p>
        </div>
      </footer>

    </main>
  );
}
