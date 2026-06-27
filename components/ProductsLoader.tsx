'use client'

import { useEffect } from 'react'
import { useProductStore } from '@/lib/useProducts'

// Mounted once in the root layout — kicks off the live product sync.
export default function ProductsLoader() {
  const ensure = useProductStore((s) => s.ensure)
  useEffect(() => {
    ensure()
  }, [ensure])
  return null
}
