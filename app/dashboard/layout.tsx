import SideNav from '@/app/ui/dashboard/sidenav';

// Everything under /dashboard reads live, personalized data from the
// database. Force dynamic rendering here so Next.js never tries to
// statically pre-render a nested page at build time (which would run
// Prisma queries before DATABASE_URL / any runtime env is available).
export const dynamic = 'force-dynamic';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}