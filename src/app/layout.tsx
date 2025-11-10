import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NotificationToast from '@/components/NotificationToast';
import { AppProviders } from '@/context/AppProviders';

export const metadata: Metadata = {
  title: {
    default: "Soni Artificial Fashion – Premium Gold Plated Jewelry & Accessories",
    template: '%s | Soni Artificial Fashion'
  },
  description: "Discover beautiful artificial gold plated jewelry and fashion accessories at affordable prices from Soni Artificial Fashion.",
  keywords: [
    'Soni Artificial Fashion',
    'artificial jewelry',
    'gold plated jewelry',
    'fashion accessories',
    'jewelry',
    'accessories',
    'online jewelry store',
    'fashion',
    'trendy accessories',
    'Indian jewelry',
    'affordable luxury'
  ],
  authors: [{ name: 'Soni Artificial Fashion' }],
  creator: 'Soni Artificial Fashion',
  publisher: 'Soni Artificial Fashion',
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: "Soni Artificial Fashion – Premium Gold Plated Jewelry & Accessories",
    description: "Discover beautiful artificial gold plated jewelry and fashion accessories at affordable prices from Soni Artificial Fashion.",
    url: 'https://soniartificialfashion.com',
    siteName: 'Soni Artificial Fashion',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Soni Artificial Fashion – Premium Gold Plated Jewelry & Accessories',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    title: "Soni Artificial Fashion – Premium Gold Plated Jewelry & Accessories",
    description: "Discover beautiful artificial gold plated jewelry and fashion accessories at affordable prices from Soni Artificial Fashion.",
    card: 'summary_large_image',
    images: ['/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://soniartificialfashion.com',
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/api/favicon" type="image/x-icon" />
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