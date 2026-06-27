import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Бүх бараа',
  description:
    'Муур, нохой, туулай, загас, шувууны хоол, тоглоом, дагалдах хэрэгсэл — Нөхөр дэлгүүрийн бүх бараа.',
  alternates: { canonical: '/products' },
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children
}
