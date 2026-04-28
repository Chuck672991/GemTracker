import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { ThemeProvider } from '@/components/theme-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gemtracker.app';
const SITE_NAME = 'GemTracker';
const DESCRIPTION =
  'Real-time gold (24K, 22K, 18K), silver, and global currency exchange rates in USD, INR, and EUR — updated every 60 seconds.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Live Gold, Silver & Currency Rates`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    'gold price today', 'silver price today', '24k gold price', '22k gold price',
    '18k gold price', 'gold price per gram', 'gold rate in INR', 'gold rate in EUR',
    'currency exchange rates', 'XAU USD', 'XAG USD', 'precious metals tracker',
  ],
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Live Gold, Silver & Currency Rates`,
    description: DESCRIPTION,
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Live Gold, Silver & Currency Rates`,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: SITE_URL },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  url: SITE_URL,
  description: DESCRIPTION,
  applicationCategory: 'FinanceApplication',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  mainEntity: [
    { '@type': 'FinancialProduct', name: 'Gold 24K (XAU)', category: 'Precious Metal', currency: 'USD' },
    { '@type': 'FinancialProduct', name: 'Gold 22K', category: 'Precious Metal', currency: 'USD' },
    { '@type': 'FinancialProduct', name: 'Gold 18K', category: 'Precious Metal', currency: 'USD' },
    { '@type': 'FinancialProduct', name: 'Silver (XAG)', category: 'Precious Metal', currency: 'USD' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
