'use client';

import {
  UserGroupIcon,
  HomeIcon,
  WrenchIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';

const baseLinks = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Invoices', href: '/dashboard/invoices', icon: DocumentDuplicateIcon },
  { name: 'Tenants', href: '/dashboard/tenants', icon: UserGroupIcon },
  { name: 'Maintenance', href: '/dashboard/maintenance', icon: WrenchIcon },
  { name: 'Reports', href: '/dashboard/report-and-analytics', icon: ChartBarIcon },
];

const landlordLinks = [
  { name: 'Properties', href: '/dashboard/properties', icon: BuildingOfficeIcon },
];

const adminLinks = [
  { name: 'Landlords', href: '/dashboard/landlords', icon: UserGroupIcon },
  { name: 'Properties', href: '/dashboard/properties', icon: BuildingOfficeIcon },
  { name: 'Admin Panel', href: '/dashboard/admin', icon: ShieldCheckIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;

  let links = [...baseLinks];

  if (userRole === 'landlord') {
    links = [...links, ...landlordLinks];
  }

  if (userRole === 'admin') {
    links = [...links, ...adminLinks];
  }

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.href}
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
