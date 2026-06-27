import type { Metadata, Viewport } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import ProductsLoader from '@/components/ProductsLoader'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nokhor.mn'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Нөхөр — Улаанбаатарын амьтны дэлгүүр',
    template: '%s · Нөхөр',
  },
  description:
    'Муур, нохой, туулай — бүгдэд хайртай хоол, тоглоом, дагалдах хэрэгсэл. Улаанбаатарт нэг өдрийн дотор хүргэнэ.',
  keywords: ['амьтны тэжээл', 'нохой', 'муур', 'туулай', 'QPay', 'Улаанбаатар', 'pet shop', 'Монгол'],
  applicationName: 'Нөхөр',
  authors: [{ name: 'Нөхөр ХХК' }],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Нөхөр — Улаанбаатарын амьтны дэлгүүр',
    description: 'Чиний хамгийн сайн нөхөр. 12,000+ аз жаргалтай гэр бүл.',
    type: 'website',
    locale: 'mn_MN',
    siteName: 'Нөхөр',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Нөхөр — Улаанбаатарын амьтны дэлгүүр',
    description: 'Чиний хамгийн сайн нөхөр. 12,000+ аз жаргалтай гэр бүл.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#2536ce',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-paper-50 text-ink-800">
        <ProductsLoader />
        <Header />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  )
}
