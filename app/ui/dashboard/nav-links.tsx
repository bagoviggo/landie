'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  WrenchIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';

// Base links visible to all users
const baseLinks = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Tenants', href: '/dashboard/tenants', icon: UserGroupIcon },
  { name: 'Maintenance', href: '/dashboard/maintenance', icon: WrenchIcon },
  { name: 'Report and Analytics', href: '/dashboard/report-and-analytics', icon: ChartBarIcon },
];

// Role-specific links
const landlordLinks = [
  { name: 'Landlords', href: '/dashboard/landlords', icon: BuildingOfficeIcon },
];

const adminLinks = [
  { name: 'Properties', href: '/dashboard/properties', icon: BuildingOfficeIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  // Build links array based on user role
  const links = [...baseLinks];

  // Add landlords link only for landlord or admin roles
  if (userRole === 'landlord' || userRole === 'admin') {
    links.push(...landlordLinks);
  }

  // Add properties link only for admin role
  if (userRole === 'admin') {
    links.push(...adminLinks);
  }

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
