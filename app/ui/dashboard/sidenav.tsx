import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import LandieLogo from '@/app/ui/landie-logo';
import LogoutButton from '@/app/ui/dashboard/logout-button';
 
export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-center rounded-md bg-blue-950 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <LandieLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2 md:overflow-hidden">
        {/* Scrollable nav links */}
        <div className="flex flex-row space-x-2 md:flex-col md:space-x-0 md:space-y-2 md:overflow-y-auto md:flex-1">
          <NavLinks />
        </div>
        {/* Logout always visible at bottom */}
        <div className="md:mt-2">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
