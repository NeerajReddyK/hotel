import { Inter } from 'next/font/google';
import './globals.css';
import { BottomNav } from '@/components/BottomNav';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-50 pb-16">
          {children}
          <BottomNav />
        </main>
      </body>
    </html>
  );
}