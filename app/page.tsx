import LandieLogo from '@/app/ui/landie-logo';
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';

import Image from 'next/image';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6 overflow-hidden">
      <header className='flex h-12 shrink-0 items-center rounded-lg bg-blue-950 p-4 md:h-32 overflow-hidden'>
        <LandieLogo />
      </header>
      <section className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <article className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <h1 className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Welcome to Landie</strong>
          </h1>
          <p className='text-gray-600'>
            <span className='flex items-center gap-2'>
              <CheckCircleIcon className='w-5 h-5 text-blue-500' />
              All-in-one property management solution
            </span>
          </p>
          <p className='text-gray-600'>
            <span className='flex items-center gap-2'>
              <CheckCircleIcon className='w-5 h-5 text-blue-500' />
              Real-time payment tracking
            </span>
          </p>
          <p className='text-gray-600'>
            <span className='flex items-center gap-2'>
              <CheckCircleIcon className='w-5 h-5 text-blue-500' />
              Simplified maintenance management
            </span>
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-800 md:text-base"
            aria-label="Log in to Landie"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </article>
        <div className="flex items-center justify-center p-0 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here */}
          <Image
            src="/hero-desktop.png"
            sizes='(min-width:768px) 60vw, 100vw'
            width={1000}
            height={760}
            className="hidden md:block object-cover"
            alt="Hexagonal images of apartment buildings"
          />
          <Image
            src="/hero-mobile.png"
            width={560}
            height={620}
            sizes="100vw"
            className="block md:hidden object-cover"
            alt="Hexagonal images of apartment buildings"
          />
        </div>
      </section>
    </main>
  );
}
