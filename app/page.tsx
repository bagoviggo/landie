import LandieLogo from '@/app/ui/landie-logo';
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6 overflow-hidden bg-gray-100">
      <header className="flex h-16 md:h-20 items-center justify-between rounded-lg bg-blue-950 px-6 md:px-12">
        <LandieLogo />
        <nav className="hidden md:flex gap-6 text-white">
          <Link href="/features" className="hover:underline">Features</Link>
          <Link href="/pricing" className="hover:underline">Pricing</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </nav>
      </header>
      <section className="flex grow flex-col md:flex-row">
        <article className="flex flex-col justify-center gap-6 p-6 md:w-2/5 md:px-12">
          <h1 className={`${lusitana.className} text-2xl text-gray-800 md:text-4xl`}>
            <strong>Welcome to Landie</strong>
          </h1>
          <p className="text-gray-600">
            <span className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-blue-500" />
              All-in-one property management solution
            </span>
          </p>
          <p className="text-gray-600">
            <span className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-blue-500" />
              Real-time payment tracking
            </span>
          </p>
          <p className="text-gray-600">
            <span className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-blue-500" />
              Simplified maintenance management
            </span>
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-950 px-6 py-3 text-sm font-medium text-white transition-transform transform hover:scale-105 md:text-base"
            aria-label="Log in to Landie"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </article>
        <div className="relative flex items-center justify-center md:w-3/5">
          <Image
            src="/hero-desktop.png"
            sizes="(min-width:768px) 60vw, 100vw"
            width={1000}
            height={760}
            className="hidden md:block object-cover rounded-lg shadow-lg"
            alt="Hexagonal images of apartment buildings"
          />
          <Image
            src="/hero-mobile.png"
            width={560}
            height={620}
            sizes="100vw"
            className="block md:hidden object-cover rounded-lg shadow-lg"
            alt="Hexagonal images of apartment buildings"
          />
        </div>
      </section>
      <section className="mt-8 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 md:text-2xl">Why Choose Landie?</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <CheckCircleIcon className="w-10 h-10 text-blue-500" />
            <h3 className="mt-2 text-lg font-medium text-gray-800">Ease of Use</h3>
            <p className="text-gray-600">Manage properties effortlessly with our intuitive interface.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <CheckCircleIcon className="w-10 h-10 text-blue-500" />
            <h3 className="mt-2 text-lg font-medium text-gray-800">Secure Payments</h3>
            <p className="text-gray-600">Track payments securely in real-time.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <CheckCircleIcon className="w-10 h-10 text-blue-500" />
            <h3 className="mt-2 text-lg font-medium text-gray-800">24/7 Support</h3>
            <p className="text-gray-600">Get assistance whenever you need it.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
