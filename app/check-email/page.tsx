import Link from 'next/link';
import LandieLogo from '@/app/ui/landie-logo';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

export default function CheckEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-100">
          <div className="h-1.5 bg-gradient-to-r from-blue-600 to-blue-400" />
          <div className="px-8 py-10 text-center">
            <div className="mb-6 flex justify-center">
              <LandieLogo />
            </div>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
              <EnvelopeIcon className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="mb-3 text-2xl font-bold text-gray-900">Check your inbox</h1>
            <p className="mb-2 text-gray-500">
              We sent an email to the address you registered with.
            </p>
            <p className="mb-8 text-sm text-gray-400">
              Follow the link in the email to continue. It expires in 24 hours.
            </p>
            <div className="mb-8 rounded-xl border border-gray-100 bg-gray-50 p-4 text-left">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Didn&apos;t get it?
              </p>
              <ul className="space-y-1.5 text-sm text-gray-500">
                <li>• Check your spam or junk folder</li>
                <li>• Make sure you entered the correct email</li>
                <li>• Allow a minute or two for delivery</li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Back to Login
              </Link>
              <Link href="/signup" className="text-sm text-blue-600 hover:underline">
                Use a different email
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
