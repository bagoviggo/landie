import LandieLogo from '@/app/ui/landie-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import { imageOptimizer } from 'next/dist/server/image-optimizer';
import Image from 'next/image';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className='flex h-20 shrink-0 items-center rounded-lg bg-blue-950 p-4 md:h-52 overflow-hidden'>
        <LandieLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Welcome to Landie</strong> Access your properties, track payments,
            and communicate with tenants all in one place{' '}
            <span className="text-blue-950"> Effortlessly </span>
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-800 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here */}
          <Image
            src="/hero-desktop.png"
            width={1000}
            height={760}
            className="hidden md:block"
            alt="Hexagonal images of apartment buildings desktop version"
          />
          <Image
            src="/hero-mobile.png"
            width={560}
            height={620}
            className="block md:hidden"
            alt="Hexagonal images of apartment buildings mobile version"
          />
        </div>
      </div>
    </main>
  );
}
