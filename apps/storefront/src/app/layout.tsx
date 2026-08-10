import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/lib/providers'



export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  ),

  title: {
    default: 'Salis — تسوق ببساطة',
    template: '%s | Salis',
  
  },

  description:
    'منصة تسوق إلكتروني بسيطة وسريعة — تصفح المنتجات وأضفها لسلتك واستلمها بسهولة.',

  keywords: ['متجر إلكتروني', 'تسوق', 'Salis', 'منتجات', 'ecommerce'],

  authors: [{ name: 'Salis Team' }],

  // openGraph — 
  openGraph: {
    type: 'website',
    locale: 'ar_AR',
    siteName: 'Salis',
    title: 'Salis — تسوق ببساطة',
    description: 'منصة تسوق إلكتروني بسيطة وسريعة.',
    images: [
      {
        url: '/og-image.png',  
        width: 1200,
        height: 630,
        alt: 'Salis — متجرك الإلكتروني',
      },
    ],
  },

  // twitter — بيانات Twitter Cards
  twitter: {
    card: 'summary_large_image',
    title: 'Salis — تسوق ببساطة',
    description: 'منصة تسوق إلكتروني بسيطة وسريعة.',
    images: ['/og-image.png'],
  },

  // robots — تعليمات لـ Google crawler
  robots: {
    index: true,       // 
    follow: true,      // 
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
