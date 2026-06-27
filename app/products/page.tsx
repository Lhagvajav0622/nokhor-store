'use client'

import { useEffect, useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { MagnifyingGlass } from '@phosphor-icons/react'
import ProductCard from '@/components/ProductCard'
import { PRODUCTS, PET_CATEGORIES, PRODUCT_TYPES } from '@/data/products'
import { useStore } from '@/lib/store'

function ProductsInner() {
  const params = useSearchParams()
  const { searchQuery } = useStore()

  const [pet, setPet] = useState(params.get('pet') || 'all')
  const [type, setType] = useState('all')

  useEffect(() => {
    const p = params.get('pet')
    if (p) setPet(p)
  }, [params])

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return PRODUCTS.filter(
      (p) =>
        (pet === 'all' || p.pet === pet) &&
        (type === 'all' || p.type === type) &&
        (!q || (p.name + ' ' + p.category).toLowerCase().includes(q))
    )
  }, [pet, type, searchQuery])

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
      <h1
        className="font-display font-extrabold text-[34px] text-ink-900 mb-4"
        style={{ letterSpacing: '-0.02em' }}
      >
        Бүх бараа
      </h1>

      {/* Pet chips */}
      <div className="flex gap-2.5 flex-wrap mb-3">
        {PET_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setPet(c.id)}
            className="inline-flex items-center gap-2 px-4 py-2.5 font-mono text-[13px] font-bold border-[2.5px] border-ink-900 rounded-pill cursor-pointer transition-colors"
            style={{
              background: pet === c.id ? c.bg : '#fbf6ea',
              color: pet === c.id ? c.fg : '#15151b',
              boxShadow: pet === c.id ? 'none' : '2px 2px 0 0 #15151b',
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Type chips */}
      <div className="flex gap-2.5 flex-wrap mb-5">
        {PRODUCT_TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => setType(t.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 font-mono text-[13px] font-bold border-[2.5px] border-ink-900 rounded-pill cursor-pointer transition-colors ${
              type === t.id
                ? 'bg-ink-900 text-paper-0'
                : 'bg-paper-0 text-ink-900 shadow-hard-sm hover:bg-paper-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="font-mono text-[13px] text-ink-500 mb-4">{filtered.length} бараа олдлоо</p>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-ink-500">
          <MagnifyingGlass size={54} className="text-ink-300 mx-auto mb-3" />
          <p className="font-bold text-ink-900 mb-1">Бараа олдсонгүй 🐾</p>
          <span className="text-[14px]">Өөр ангилал эсвэл хайлт оролдоно уу</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <div className="h-8 bg-paper-100 rounded animate-pulse w-48 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square bg-paper-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    }>
      <ProductsInner />
    </Suspense>
  )
}
