'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = { id: string; qty: number }

type Store = {
  cart: CartItem[]
  favs: Record<string, boolean>
  cartOpen: boolean
  searchQuery: string

  addToCart: (id: string, qty?: number) => void
  removeFromCart: (id: string) => void
  setQty: (id: string, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleFav: (id: string) => void
  setSearch: (q: string) => void
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      cart: [],
      favs: {},
      cartOpen: false,
      searchQuery: '',

      addToCart: (id, qty = 1) =>
        set((s) => {
          const existing = s.cart.find((i) => i.id === id)
          return {
            cart: existing
              ? s.cart.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i))
              : [...s.cart, { id, qty }],
            cartOpen: true,
          }
        }),

      removeFromCart: (id) =>
        set((s) => ({ cart: s.cart.filter((i) => i.id !== id) })),

      setQty: (id, qty) =>
        set((s) => ({
          cart: qty < 1
            ? s.cart.filter((i) => i.id !== id)
            : s.cart.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),

      clearCart: () => set({ cart: [] }),

      openCart: () => set({ cartOpen: true }),
      closeCart: () => set({ cartOpen: false }),

      toggleFav: (id) =>
        set((s) => ({ favs: { ...s.favs, [id]: !s.favs[id] } })),

      setSearch: (q) => set({ searchQuery: q }),
    }),
    {
      name: 'nokhor-store',
      partialize: (s) => ({ cart: s.cart, favs: s.favs }),
    }
  )
)

export function cartTotal(cart: CartItem[], products: import('@/data/products').Product[]) {
  return cart.reduce((sum, ci) => {
    const p = products.find((pr) => pr.id === ci.id)
    return sum + (p ? p.price * ci.qty : 0)
  }, 0)
}

export function cartCount(cart: CartItem[]) {
  return cart.reduce((s, i) => s + i.qty, 0)
}
