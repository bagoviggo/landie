import SignupForm from '@/app/ui/signup-form';
import { lusitana } from '@/app/ui/fonts';
 
export default function SignupPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-950 p-3 md:h-36">
          <div className="w-full text-white">
            <h1 className={`${lusitana.className} text-2xl font-bold`}>
              Landie
            </h1>
            <p className="text-sm">Property Management System</p>
          </div>
        </div>
        <SignupForm />
      </div>
    </main>
  );
}

