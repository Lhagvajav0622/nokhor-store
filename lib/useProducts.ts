'use client'

import { create } from 'zustand'
import { PRODUCTS, type Product } from '@/data/products'

type ProductState = {
  products: Product[]
  status: 'idle' | 'loading' | 'ready' | 'error'
  ensure: () => void
  refetch: () => Promise<void>
}

// Starts with the bundled list (instant render, no empty flash), then syncs
// the live list from Firestore via /api/products.
export const useProductStore = create<ProductState>((set, get) => ({
  products: PRODUCTS,
  status: 'idle',
  ensure: () => {
    if (get().status === 'idle') get().refetch()
  },
  refetch: async () => {
    set({ status: 'loading' })
    try {
      const r = await fetch('/api/products', { cache: 'no-store' })
      const d = await r.json()
      if (Array.isArray(d.products) && d.products.length > 0) {
        set({ products: d.products, status: 'ready' })
      } else {
        set({ status: 'ready' })
      }
    } catch {
      set({ status: 'error' })
    }
  },
}))

export function useProducts(): Product[] {
  return useProductStore((s) => s.products)
}
