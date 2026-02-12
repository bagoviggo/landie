import "@/app/ui/global.css";
import { CurrencyProvider } from '@/app/context/currency-context';
import { AuthProvider } from '@/app/context/auth-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-inter antialiased">
        <AuthProvider>
          <CurrencyProvider>
            {children}
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
