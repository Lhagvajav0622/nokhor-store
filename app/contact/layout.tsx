import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Холбоо барих',
  description:
    'Нөхөр амьтны дэлгүүртэй холбогдох — утас 7700-1234, Улаанбаатар. Асуулт, санал хүсэлтээ илгээнэ үү.',
  alternates: { canonical: '/contact' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
