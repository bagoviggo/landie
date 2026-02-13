'use client';
 
import { useTransition } from 'react';
import { PowerIcon } from '@heroicons/react/24/outline';
import { logout } from '@/app/lib/actions';
 
export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();
 
  return (
    <button
      onClick={() => startTransition(() => logout())}
      className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-800 md:flex-none md:justify-start md:p-2 md:px-3"
      disabled={isPending}
    >
      <PowerIcon className="w-6" />
      <div className="hidden md:block">Sign Out</div>
    </button>
  );
}
