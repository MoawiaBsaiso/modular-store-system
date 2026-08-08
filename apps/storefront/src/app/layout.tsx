import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/lib/providers'

// ─── Metadata الأساسية ─────────────────────────────────────
// Next.js بيأخذ هاد الـ object ويولّد تلقائياً:
// <title>, <meta name="description">, og:tags, twitter:tags
// بدون ما تكتب HTML يدوياً
//
// شرح الـ properties:
// metadataBase — الـ base URL للمشروع، لازم لتوليد og:image
// title.default — العنوان الافتراضي
// title.template — لو صفحة ثانية ما عرّفت title، بتاخد هاد القالب
// openGraph — بيانات المشاركة على وسائل التواصل (Facebook, LinkedIn)
// twitter — بيانات Twitter Cards
// robots — بيقول لـ Google crawler كيف يتعامل مع الصفحة

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  ),

  title: {
    default: 'Salis — تسوق ببساطة',
    template: '%s | Salis',
    // %s بيتحول لعنوان الصفحة الفرعية
    // مثال: صفحة منتج → "قميص كتان | Salis"
  },

  description:
    'منصة تسوق إلكتروني بسيطة وسريعة — تصفح المنتجات وأضفها لسلتك واستلمها بسهولة.',

  keywords: ['متجر إلكتروني', 'تسوق', 'Salis', 'منتجات', 'ecommerce'],

  authors: [{ name: 'Salis Team' }],

  // openGraph — بيانات المشاركة على وسائل التواصل
  openGraph: {
    type: 'website',
    locale: 'ar_AR',
    siteName: 'Salis',
    title: 'Salis — تسوق ببساطة',
    description: 'منصة تسوق إلكتروني بسيطة وسريعة.',
    images: [
      {
        url: '/og-image.png',  // سنضيف هاد الملف لاحقاً
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
    index: true,       // اسمح لـ Google يفهرس الصفحة
    follow: true,      // اتبع الروابط في الصفحة
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
