import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-merriweather',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Progressive Cattle Fodder Industries Pvt. Ltd.',
  description:
    'Nepal\'s trusted manufacturer of high-quality bale silage and mash cattle feed. Providing premium livestock nutrition solutions for over four years.',
  keywords: 'cattle feed, silage, bale silage, mash cattle feed, Nepal, livestock, fodder',
  icons: {
    icon: '/images/branding/logo.svg',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="font-body bg-white text-gray-900 antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: '#363636', color: '#fff' },
              success: { style: { background: '#2d6b25' } },
              error: { style: { background: '#dc2626' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
