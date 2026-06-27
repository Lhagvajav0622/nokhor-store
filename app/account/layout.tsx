import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Миний профайл',
  description: 'Захиалгын түүх, гишүүнчлэлийн оноо, хувийн мэдээллээ удирдаарай.',
  alternates: { canonical: '/account' },
  robots: { index: false, follow: false },
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children
}
