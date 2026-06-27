import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Хямдрал',
  description:
    'Нөхөр дэлгүүрийн онцгой хямдралтай бараанууд — муур, нохой, туулайн хоол, тоглоом, дагалдах хэрэгсэл хямдарлаа.',
  alternates: { canonical: '/sale' },
}

export default function SaleLayout({ children }: { children: React.ReactNode }) {
  return children
}
