'use client'

import Link from 'next/link'
import { Heart, ArrowLeft, Storefront } from '@phosphor-icons/react'
import { useStore } from '@/lib/store'
import { useProducts } from '@/lib/useProducts'
import ProductCard from '@/components/ProductCard'

export default function WishlistPage() {
  const { favs } = useStore()
  const products = useProducts()
  const items = products.filter((p) => favs[p.id])

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-body font-bold text-[15px] text-ink-900 mb-5 hover:text-cobalt-600 transition-colors"
      >
        <ArrowLeft weight="bold" size={18} />
        Нүүр
      </Link>

      <h1 className="font-display font-extrabold text-[34px] text-ink-900 mb-1 flex items-center gap-2" style={{ letterSpacing: '-0.02em' }}>
        <Heart weight="fill" size={32} className="text-brand-red" />
        Дуртай бараа
      </h1>
      <p className="font-mono text-[13px] text-ink-500 mb-6">{items.length} бараа хадгалсан</p>

      {items.length === 0 ? (
        <div className="text-center py-16 text-ink-500">
          <Heart size={56} className="text-ink-300 mx-auto mb-3" />
          <p className="font-bold text-ink-900 mb-1">Дуртай бараа алга байна 🐾</p>
          <p className="text-[14px] mb-5">Бараан дээрх зүрхэн дээр дарж хадгалаарай</p>
          <Link
            href="/products"
            className="nx-press h-12 px-6 inline-flex items-center gap-2 font-bold text-[16px] border-[2.5px] border-ink-900 rounded-pill bg-cobalt-600 text-paper-0 shadow-hard"
          >
            <Storefront weight="bold" size={18} />
            Дэлгүүр үзэх
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
