import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

export const metadata: Metadata = {
  title: { default: 'TradeSupplyFinder — Find Trade Supply Houses Near You', template: '%s | TradeSupplyFinder' },
  description:
    'Compare plumbing, HVAC, electrical, and general trade supply houses by city. Find will-call hours, ratings, and contractor-friendly services.',
  icons: { icon: '/favicon.svg' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: 'TradeSupplyFinder',
    title: 'TradeSupplyFinder — Find Trade Supply Houses Near You',
    description:
      'Compare plumbing, HVAC, electrical, and general trade supply houses by city with contractor-focused details.',
    url: 'https://tradesupplyfinder.com',
  },
  alternates: { canonical: 'https://tradesupplyfinder.com' },
};

function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TradeSupplyFinder',
    url: 'https://tradesupplyfinder.com',
    description:
      'Directory for finding trade supply houses in plumbing, HVAC, electrical, and general contractor categories.',
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <OrganizationSchema />
        {ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
