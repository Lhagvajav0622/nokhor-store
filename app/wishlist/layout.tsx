import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Дуртай бараа',
  description: 'Хадгалсан дуртай бараануудаа нэг дороос үзэж, сагсандаа нэмээрэй.',
  alternates: { canonical: '/wishlist' },
  robots: { index: false, follow: true },
}

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children
}
