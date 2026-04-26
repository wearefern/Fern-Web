import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { Albert_Sans } from 'next/font/google';
import { Inter } from 'next/font/google';
import { JetBrains_Mono } from 'next/font/google';

import { SSRQueryClientProvider } from '~api/shared/query-client/provider';

import { BASE_URL } from '~constants/index';

import '~styles/globals.css';

import { ThemeProvider } from '~ui/atoms/theme/theme-provider';
import { HomeFooter } from '~modules/home/home-footer';

import { cn, tw } from '~utils/style';

const fontSans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const fontBody = Albert_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const viewport: Viewport = {
  themeColor: tw.theme.colors.ctx.primary.DEFAULT,
  initialScale: 1.0,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: '%s | Fern',
    default: 'Fern',
  },
  description:
    'Fern is a software firm that designs, builds, and scales digital products for modern businesses.',
  manifest: `${BASE_URL}/manifest.webmanifest`,
  keywords: [
    'Fern',
    'Software Firm',
    'Software Development',
    'Product Engineering',
    'Digital Transformation',
    'Web Applications',
    'Mobile Applications',
    'Cloud Engineering',
    'UI UX Design',
    'Technology Consulting',
    'Insights',
    'React',
    'TypeScript',
    'Next.js',
    'Engineering Partner',
  ],
  authors: [{ name: 'Fern' }],
  creator: 'Fern',
  publisher: 'Fern',
  category: 'technology',
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'Fern',
    description:
      'Fern is a software firm that designs, builds, and scales digital products for modern businesses.',
    url: BASE_URL,
    siteName: 'Fern',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/content/800x600.jpg',
        width: 800,
        height: 600,
        alt: 'Fern software firm brand preview.',
      },
      {
        url: '/content/1800x1600.jpg',
        width: 1800,
        height: 1600,
        alt: 'Fern software firm brand preview.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fern',
    description:
      'Fern is a software firm that designs, builds, and scales digital products for modern businesses.',
    creator: '@fernsoftware',
    images: [
      {
        url: 'https://vsupu83zlkfucch6.public.blob.vercel-storage.com/800x600.jpg',
        width: 800,
        height: 600,
        alt: 'Fern software firm brand preview.',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={cn(
          `${fontSans.variable} ${fontBody.variable} ${fontMono.variable}`
        )}
      >
        <SSRQueryClientProvider>
          <ThemeProvider>
            {children}
            <HomeFooter />
          </ThemeProvider>
        </SSRQueryClientProvider>

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
