import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'

export const metadata: Metadata = {
  title: 'Нөхөр — Улаанбаатарын амьтны дэлгүүр',
  description:
    'Муур, нохой, туулай — бүгдэд хайртай хоол, тоглоом, дагалдах хэрэгсэл. Улаанбаатарт нэг өдрийн дотор хүргэнэ.',
  keywords: 'амьтны тэжээл, нохой, муур, туулай, QPay, Улаанбаатар',
  openGraph: {
    title: 'Нөхөр — Улаанбаатарын амьтны дэлгүүр',
    description: 'Чиний хамгийн сайн нөхөр. 12,000+ аз жаргалтай гэр бүл.',
    type: 'website',
    locale: 'mn_MN',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-paper-50 text-ink-800">
        <Header />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  )
}
