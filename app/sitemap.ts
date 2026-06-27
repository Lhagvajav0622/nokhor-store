import type { MetadataRoute } from 'next'
import { PRODUCTS } from '@/data/products'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nokhor.mn'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes = ['', '/products', '/sale', '/about', '/faq', '/loyalty', '/contact'].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.7,
    })
  )

  const productRoutes = PRODUCTS.map((p) => ({
    url: `${SITE_URL}/products/${p.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...productRoutes]
}
