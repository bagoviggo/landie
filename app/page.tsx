'use client';
import { motion } from 'framer-motion';
import LandieLogo from '@/app/ui/landie-logo';
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Header */}
      <header className="flex h-16 z-10 md:h-20 items-center bg-blue-950 px-6 md:px-12 shadow-lg">
          <div className="flex-shrink-0 h-full">
            <LandieLogo />
          </div>

          <nav className="flex flex-1 justify-center gap-6 text-white">
            <Link href="/features" className="hover:underline">Features</Link>
            <Link href="/pricing" className="hover:underline">Pricing</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </nav>

        <div className='flex items-center gap-4 ml-auto'>       
          <Link
            href="/login"
            className="hidden md:inline-block rounded-lg bg-transparent border border-white text-white px-4 py-2 text-sm font-medium hover:bg-white hover:text-blue-950"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="hidden md:inline-block rounded-lg bg-white text-blue-950 px-4 py-2 text-sm font-medium hover:bg-gray-200"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col-reverse md:flex-row items-center justify-between px-6 -mt-16 md:px-12 py-12">
        {/* Text Content */}
        <motion.div
          className="flex flex-col items-start gap-6 md:w-1/2"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={`${lusitana.className} text-3xl md:text-5xl font-bold text-gray-800`}>
            Why Choose Landie?
          </h2>
          <p className="text-lg text-gray-600">
            All-in-one property management solution designed to simplify your life.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <CheckCircleIcon className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Streamlined Operations</h3>
                <p className="text-gray-600">
                  Manage your properties effortlessly with our intuitive dashboard and tools.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <CheckCircleIcon className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className='text-lg font-semibold text-gray-800'>Secure Payments</h3>
                <p className="text-gray-600">
                  Track payments in real-time with our secure and reliable system.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <CheckCircleIcon className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">24/7 Support</h3>
                <p className="text-gray-600">
                  Get assistance whenever you need it with our dedicated support team.
                </p>
              </div>
            </li>
          </ul>
          <Link
            href="/get-started"
            className="mt-6 inline-block rounded-lg bg-blue-950 px-6 py-3 text-white text-sm font-medium transition-transform transform hover:scale-105"
          >
            Get Started
          </Link>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          className="relative md:w-1/2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="/hero-desktop.png"
            alt="Stylish apartment buildings"
            width={570}
            height={500}
            className="rounded-lg shadow-lg object-cover"
          />
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500 rounded-full opacity-20"></div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-300 rounded-full opacity-20"></div>
        </motion.div>
      </section>

      {/* Call-to-Action Section */}
      <section className="mt-12 px-6 md:px-12 py-8 bg-blue-950 text-white text-center rounded-lg shadow-lg">
        <motion.h2
          className="text-2xl md:text-3xl font-semibold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Ready to Get Started?
        </motion.h2>
        <motion.p
          className="mt-4 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Sign up today and experience the future of property management.
        </motion.p>
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            href="/signup"
            className="inline-block rounded-lg bg-white text-blue-950 px-6 py-3 text-sm font-medium transition-transform transform hover:scale-105"
          >
            Sign Up Now
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="mt-12 px-6 md:px-12 py-4 bg-gray-800 text-white text-center">
        <p>&copy; 2025 Landie. All rights reserved.</p>
        <nav className="mt-2">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link> | 
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
        </nav>
      </footer>
    </main>
  );
}