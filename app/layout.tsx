import "@/app/ui/global.css";
import { inter } from '@/app/ui/fonts';
import { CurrencyProvider } from '@/app/context/currency-context';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </body>
    </html>
  );
}
