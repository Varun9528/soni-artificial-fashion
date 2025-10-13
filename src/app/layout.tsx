import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NotificationToast from '@/components/NotificationToast';
import { AppProviders } from '@/context/AppProviders';

export const metadata: Metadata = {
  title: {
    default: "Lettex Marketplace – Your Local Store Online",
    template: '%s | Lettex Marketplace'
  },
  description: "Shop groceries, dairy, refined oils, and Lettex products with trusted local quality.",
  keywords: [
    'Lettex',
    'groceries',
    'dairy',
    'refined oils',
    'milk products',
    'local marketplace',
    'online grocery',
    'fresh products'
  ],
  authors: [{ name: 'Lettex Marketplace' }],
  creator: 'Lettex',
  publisher: 'Lettex',
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: "Lettex Marketplace – Your Local Store Online",
    description: "Shop groceries, dairy, refined oils, and Lettex products with trusted local quality.",
    url: 'https://lettex.com',
    siteName: 'Lettex Marketplace',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lettex Marketplace – Your Local Store Online',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    title: "Lettex Marketplace – Your Local Store Online",
    description: "Shop groceries, dairy, refined oils, and Lettex products with trusted local quality.",
    card: 'summary_large_image',
    images: ['/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://lettex.com',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/images/icons/icon-32x32.png" type="image/png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/icons/icon-180x180.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#f59e0b" />
      </head>
      <body className="font-sans">
        <AppProviders>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <NotificationToast />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}