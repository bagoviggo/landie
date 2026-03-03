// Save as: app/ui/houses/houses-client.tsx
'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon, BuildingOfficeIcon, HomeIcon, XMarkIcon,
  CheckBadgeIcon, AdjustmentsHorizontalIcon, FunnelIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import type { VacantListing } from '@/app/houses/page';

function occupancyBadge(occupied: number, total: number) {
  const pct = total > 0 ? Math.round((occupied / total) * 100) : 0;
  if (pct >= 90) return { label: 'Almost Full', color: 'bg-red-100 text-red-700' };
  if (pct >= 60) return { label: 'Filling Fast', color: 'bg-amber-100 text-amber-700' };
  return { label: 'Good Availability', color: 'bg-green-100 text-green-700' };
}

function getAmenities(address: string): string[] {
  const seed = address.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const pool = ['Parking','Security','Water Included','Borehole','Generator','CCTV','Lift','Garden','Fibre Ready','Solar'];
  const picks: string[] = [];
  for (let i = 0; i < pool.length; i++) {
    if ((seed + i * 17) % 3 === 0) picks.push(pool[i]);
    if (picks.length >= 4) break;
  }
  return picks.length ? picks : ['Parking', 'Security'];
}

function EnquiryModal({ listing, onClose }: { listing: VacantListing; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100">
          <XMarkIcon className="h-5 w-5" />
        </button>
        {submitted ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500" />
            <h3 className="text-xl font-bold text-gray-900">Enquiry Sent!</h3>
            <p className="text-gray-500">The landlord will be in touch shortly. Create an account to track your applications.</p>
            <Link href="/signup" onClick={onClose} className="mt-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              Create Account
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <div className="mb-1 flex items-center gap-2 text-blue-600">
                <BuildingOfficeIcon className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">{listing.companyName}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{listing.address}</h3>
              <p className="mt-1 text-sm text-gray-500">{listing.vacantUnits.length} unit{listing.vacantUnits.length !== 1 ? 's' : ''} available</p>
            </div>
            <div className="mb-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Available Units</p>
              <div className="flex flex-wrap gap-2">
                {listing.vacantUnits.map((u) => (
                  <span key={u.id} className="rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200">
                    Unit {u.unitNumber}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Your full name" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              <input type="email" placeholder="Email address" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              <input type="tel" placeholder="Phone number" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              <textarea placeholder="Questions or preferred move-in date…" rows={3}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => setSubmitted(true)} className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Send Enquiry</button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

function PropertyCard({ listing, onEnquire }: { listing: VacantListing; onEnquire: (l: VacantListing) => void }) {
  const { label, color } = occupancyBadge(listing.occupiedCount, listing.totalUnits);
  const amenities = getAmenities(listing.address);
  const parts = listing.address.split(',');
  const mainAddress = parts[0]?.trim() ?? listing.address;
  const area = parts[1]?.trim();
  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25 }}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-blue-100">
      <div className="relative flex h-44 items-end bg-gradient-to-br from-blue-900 to-blue-700 p-4">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white" />
          <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white" />
        </div>
        <div className="relative flex w-full items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-300">{listing.companyName}</p>
            <h3 className="mt-1 text-lg font-bold leading-tight text-white">{mainAddress}</h3>
            {area && <p className="text-sm text-blue-200">{area}</p>}
          </div>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${color}`}>{label}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <HomeIcon className="h-4 w-4 text-blue-400" />
            <strong className="text-gray-900">{listing.vacantUnits.length}</strong> vacant
          </span>
          <span className="text-gray-200">•</span>
          <span className="flex items-center gap-1.5"><BuildingOfficeIcon className="h-4 w-4 text-gray-400" />{listing.totalUnits} total</span>
          <span className="text-gray-200">•</span>
          <span className="flex items-center gap-1.5"><CheckBadgeIcon className="h-4 w-4 text-green-500" />Verified</span>
        </div>
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Available Units</p>
          <div className="flex flex-wrap gap-1.5">
            {listing.vacantUnits.slice(0, 6).map((u) => (
              <span key={u.id} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">{u.unitNumber}</span>
            ))}
            {listing.vacantUnits.length > 6 && (
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">+{listing.vacantUnits.length - 6} more</span>
            )}
          </div>
        </div>
        <div className="mb-5 flex flex-wrap gap-1.5">
          {amenities.map((a) => (
            <span key={a} className="rounded-full bg-gray-50 px-2.5 py-1 text-xs text-gray-500 ring-1 ring-gray-100">{a}</span>
          ))}
        </div>
        <div className="mt-auto flex gap-2">
          <button onClick={() => onEnquire(listing)}
            className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-95">
            Enquire Now
          </button>
          <Link href="/signup" title="Save listing — requires account"
            className="flex items-center justify-center rounded-xl border border-gray-200 px-3 py-2.5 text-gray-400 transition hover:bg-gray-50 hover:text-gray-600">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function HousesClient({ listings }: { listings: VacantListing[] }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'availability' | 'name'>('availability');
  const [showFilters, setShowFilters] = useState(false);
  const [minVacant, setMinVacant] = useState(1);
  const [enquiryTarget, setEnquiryTarget] = useState<VacantListing | null>(null);

  const filtered = useMemo(() => {
    let result = listings.filter((l) => {
      const q = search.toLowerCase();
      return (!q || l.address.toLowerCase().includes(q) || l.companyName.toLowerCase().includes(q)) && l.vacantUnits.length >= minVacant;
    });
    return sortBy === 'availability'
      ? [...result].sort((a, b) => b.vacantUnits.length - a.vacantUnits.length)
      : [...result].sort((a, b) => a.address.localeCompare(b.address));
  }, [listings, search, sortBy, minVacant]);

  const totalVacant = listings.reduce((acc, l) => acc + l.vacantUnits.length, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Controls */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by address or landlord…" value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
        <select value={sortBy} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as 'availability' | 'name')}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
          <option value="availability">Most Available</option>
          <option value="name">Name A–Z</option>
        </select>
        <button onClick={() => setShowFilters((p) => !p)}
          className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-sm transition ${showFilters ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}>
          <AdjustmentsHorizontalIcon className="h-4 w-4" />
          Filters
          {minVacant > 1 && <span className="ml-1 rounded-full bg-blue-600 px-1.5 py-0.5 text-xs text-white">1</span>}
        </button>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Minimum vacant units</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 5].map((n) => (
                    <button key={n} onClick={() => setMinVacant(n)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${minVacant === n ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {n}+
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setMinVacant(1)} className="ml-auto text-xs text-gray-400 hover:text-gray-600">Reset</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {filtered.length === 0 ? 'No properties found'
            : `${filtered.length} propert${filtered.length !== 1 ? 'ies' : 'y'} — ${filtered.reduce((a, l) => a + l.vacantUnits.length, 0)} units available`}
        </p>
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <FunnelIcon className="h-3.5 w-3.5" />{totalVacant} total vacancies
        </span>
      </div>

      {/* Grid / empty state */}
      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 py-24 text-center">
          <div className="rounded-full bg-gray-100 p-6"><HomeIcon className="h-10 w-10 text-gray-400" /></div>
          <h3 className="text-lg font-semibold text-gray-700">No properties found</h3>
          <p className="text-sm text-gray-400">Try a different search or adjust your filters.</p>
          <button onClick={() => { setSearch(''); setMinVacant(1); }}
            className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100">
            Clear all filters
          </button>
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((listing) => (
              <PropertyCard key={listing.propertyId} listing={listing} onEnquire={setEnquiryTarget} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* CTA */}
      {filtered.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="mt-16 rounded-2xl bg-gradient-to-r from-blue-950 to-blue-800 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Found something you like?</h2>
          <p className="mt-2 text-blue-200">Create a free account to save listings, track enquiries, and manage your tenancy.</p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/signup" className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-950 hover:bg-blue-50">Create Free Account</Link>
            <Link href="/login" className="rounded-xl border border-white px-6 py-3 text-sm font-medium text-white hover:bg-white/10">Already have an account? Log in</Link>
          </div>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {enquiryTarget && <EnquiryModal listing={enquiryTarget} onClose={() => setEnquiryTarget(null)} />}
      </AnimatePresence>
    </div>
  );
}
