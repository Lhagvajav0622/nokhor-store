import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Төлбөр төлөх',
  description: 'Захиалгаа баталгаажуулж, банкны шилжүүлгээр хялбар төлбөрөө хийгээрэй.',
  alternates: { canonical: '/checkout' },
  robots: { index: false, follow: false },
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children
}
