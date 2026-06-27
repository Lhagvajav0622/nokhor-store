import type { Metadata } from 'next'
import { PRODUCTS, fmt } from '@/data/products'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = PRODUCTS.find((p) => p.id === id)

  if (!product) {
    return {
      title: 'Бараа олдсонгүй',
      robots: { index: false, follow: true },
    }
  }

  const desc = `${product.name} — ${fmt(product.price)}. ${product.desc}`.slice(0, 160)

  return {
    title: product.name,
    description: desc,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      title: `${product.name} · Нөхөр`,
      description: desc,
      type: 'website',
    },
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children
}
