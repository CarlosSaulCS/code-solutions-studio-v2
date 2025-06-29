import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import Providers from './providers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import LoadingSpinner from '@/components/LoadingSpinner'
import ToastContainer from '@/components/ToastContainer'

// Optimized font loading with better fallbacks
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif']
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://codesolutions.studio'),
  title: 'Code Solutions Studio - Servicios Digitales Profesionales de T.I.',
  description: 'Transformamos ideas en soluciones digitales exitosas. Desarrollo web, aplicaciones móviles, e-commerce, migración a la nube, IA y consultoría tecnológica profesional.',
  keywords: [
    'desarrollo web profesional',
    'aplicaciones móviles nativas',
    'tiendas e-commerce',
    'migración a la nube',
    'inteligencia artificial',
    'consultoría tecnológica',
    'Next.js',
    'React',
    'TypeScript',
    'servicios digitales México'
  ].join(', '),
  authors: [{ name: 'Code Solutions Studio', url: 'https://code-solutions.studio' }],
  creator: 'Code Solutions Studio',
  publisher: 'Code Solutions Studio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://code-solutions.studio',
    languages: {
      'es-MX': 'https://code-solutions.studio/es',
      'en-US': 'https://code-solutions.studio/en',
    }
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    alternateLocale: ['en_US'],
    title: 'Code Solutions Studio - Servicios Digitales Profesionales',
    description: 'Transformamos ideas en soluciones digitales exitosas. Desarrollo web, apps móviles, e-commerce y más.',
    url: 'https://code-solutions.studio',
    siteName: 'Code Solutions Studio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Code Solutions Studio - Servicios Digitales',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Code Solutions Studio - Servicios Digitales Profesionales',
    description: 'Transformamos ideas en soluciones digitales exitosas. Desarrollo web, apps móviles, e-commerce y más.',
    images: ['/twitter-image.jpg'],
    creator: '@codesolutions',
  },
  verification: {
    google: 'your-google-site-verification',
  },
  category: 'technology',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' }
  ],
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.className} bg-white text-gray-900 antialiased optimized-scroll`}>
        <Providers>
          <div className="flex flex-col min-h-screen relative">
            <Suspense fallback={<LoadingSpinner size="lg" className="fixed top-4 right-4 z-50" />}>
              <Navbar />
            </Suspense>
            
            <main className="flex-1 critical-resource">
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <LoadingSpinner size="xl" text="Cargando..." />
                </div>
              }>
                {children}
              </Suspense>
            </main>
            
            <Suspense fallback={null}>
              <Footer />
            </Suspense>
            
            <Suspense fallback={null}>
              <BackToTop />
            </Suspense>
          </div>
            <Suspense fallback={null}>
            <ToastContainer />
          </Suspense>
        </Providers>
      </body>
    </html>
  )
}
