import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Түгээмэл асуулт',
  description:
    'Нөхөр дэлгүүрийн хүргэлт, төлбөр, буцаалт, гишүүнчлэлийн талаарх түгээмэл асуултын хариулт.',
  alternates: { canonical: '/faq' },
}

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children
}
