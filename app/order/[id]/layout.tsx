import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Захиалгын мэдээлэл',
  description: 'Захиалгын явц, төлбөр, хүргэлтийн мэдээллээ хянаарай.',
  robots: { index: false, follow: false },
}

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return children
}
