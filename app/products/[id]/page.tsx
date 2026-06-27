'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Truck,
  ArrowsCounterClockwise,
  ShieldCheck,
} from '@phosphor-icons/react'
import { REVIEWS, fmt } from '@/data/products'
import { useStore } from '@/lib/store'
import { useProducts } from '@/lib/useProducts'
import ProductCard from '@/components/ProductCard'
import ProductIcon from '@/components/ProductIcon'

const BADGE_STYLES: Record<string, string> = {
  sale:   'bg-brand-red text-white',
  new:    'bg-cobalt-600 text-paper-0',
  accent: 'bg-marigold-500 text-ink-900',
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { addToCart } = useStore()
  const [qty, setQty] = useState(1)
  const products = useProducts()

  const product = products.find((p) => p.id === id)

  if (!product) {
    return (
      <div className="text-center py-24">
        <p className="font-display font-black text-[48px] text-ink-900">🐾</p>
        <p className="font-bold text-ink-900">Бараа олдсонгүй</p>
        <button onClick={() => router.push('/products')} className="mt-4 text-cobalt-600 font-bold hover:underline">
          ← Буцах
        </button>
      </div>
    )
  }

  const related = products.filter((p) => p.pet === product.pet && p.id !== product.id).slice(0, 4)
  const discountPct = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0

  function handleAdd() {
    if (product && !product.soldOut) {
      addToCart(product.id, qty)
      setQty(1)
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 bg-none border-0 cursor-pointer font-body font-bold text-[15px] text-ink-900 mb-5 p-0 hover:text-cobalt-600 transition-colors"
      >
        <ArrowLeft weight="bold" size={18} />
        Буцах
      </button>

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Image */}
        <div className="grain relative aspect-square bg-paper-100 border-4 border-ink-900 rounded-xl shadow-hard-lg flex items-center justify-center overflow-hidden">
          <ProductIcon name={product.icon} size={180} className="text-ink-300" />
          {product.badge && (
            <div className="absolute top-4 left-4">
              <span className={`font-mono text-[11px] font-bold uppercase tracking-[.06em] px-2 py-1 rounded-sm border-2 border-ink-900 shadow-hard-sm ${BADGE_STYLES[product.badge.variant]}`}>
                {product.badge.label}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pt-1">
          <span className="font-mono text-[13px] font-bold uppercase tracking-[.06em] text-ink-800">
            {product.category}
          </span>
          <h1
            className="font-display font-extrabold text-ink-900 mt-2 mb-2.5 leading-tight"
            style={{ fontSize: 'clamp(28px, 4vw, 38px)', letterSpacing: '-0.02em' }}
          >
            {product.name}
          </h1>

          {/* Rating */}
          <div className="font-mono text-[14px] font-semibold text-ink-800 flex items-center gap-1.5 mb-4">
            <Star weight="fill" size={16} className="text-marigold-600" />
            {product.rating} · 128 сэтгэгдэл
          </div>

          {/* Old price on top */}
          {product.oldPrice && (
            <div className="font-mono font-semibold text-[18px] text-ink-500 line-through mb-1">
              {fmt(product.oldPrice)}
            </div>
          )}

          {/* Price row */}
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono font-bold text-[34px] text-ink-900">
              {fmt(product.price)}
            </span>
            {product.oldPrice && (
              <span className="font-mono text-[13px] font-bold px-2 py-1 rounded-sm border-2 border-ink-900 bg-brand-red text-white">
                -{discountPct}%
              </span>
            )}
          </div>

          <p className="text-[16px] leading-relaxed text-ink-800 max-w-[460px] mb-5">
            {product.desc}
          </p>

          {/* Qty + Add */}
          <div className="flex gap-3 items-stretch flex-wrap">
            <div className="inline-flex items-center border-[2.5px] border-ink-900 rounded-pill bg-paper-0 shadow-hard-sm overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                aria-label="Хасах"
                className="w-[46px] h-[54px] border-0 bg-none cursor-pointer flex items-center justify-center text-ink-900 hover:bg-paper-100 transition-colors"
              >
                <Minus weight="bold" size={18} />
              </button>
              <span className="min-w-[38px] text-center font-mono font-bold text-[18px] text-ink-900">
                {qty}
              </span>
              <button
                onClick={() => setQty(Math.min(10, qty + 1))}
                aria-label="Нэмэх"
                className="w-[46px] h-[54px] border-0 bg-none cursor-pointer flex items-center justify-center text-ink-900 hover:bg-paper-100 transition-colors"
              >
                <Plus weight="bold" size={18} />
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={product.soldOut}
              className={`nx-press flex-1 min-w-[200px] h-14 px-6 inline-flex items-center justify-center gap-2 font-bold text-[18px] border-[2.5px] border-ink-900 rounded-pill shadow-hard cursor-pointer ${
                product.soldOut
                  ? 'bg-paper-100 text-ink-500 cursor-not-allowed'
                  : 'bg-cobalt-600 text-paper-0'
              }`}
            >
              <ShoppingCart weight="bold" size={20} />
              {product.soldOut ? 'Дууссан' : 'Сагсанд нэмэх'}
            </button>
          </div>

          {/* Guarantees */}
          <div className="mt-4 border-[2.5px] border-dashed border-ink-900 rounded-md p-3.5 bg-paper-0">
            <div className="flex gap-4 flex-wrap font-mono text-[12px] text-ink-800">
              <span className="flex items-center gap-1.5">
                <Truck weight="fill" size={14} className="text-cobalt-600" />
                24 цагийн хүргэлт
              </span>
              <span className="flex items-center gap-1.5">
                <ArrowsCounterClockwise weight="fill" size={14} className="text-cobalt-600" />
                14 хоног буцаалт
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck weight="fill" size={14} className="text-cobalt-600" />
                Баталгаат
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-14">
        <div className="flex items-baseline gap-3 mb-4">
          <h2 className="font-display font-extrabold text-[26px] text-ink-900 m-0">Сэтгэгдэл</h2>
          <span className="font-mono text-[14px] text-ink-500">
            <Star weight="fill" size={13} className="text-marigold-600 inline mb-0.5" /> {product.rating} · 128 үнэлгээ
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {REVIEWS.map((r) => (
            <div
              key={r.name}
              className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard-sm p-4"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-10 h-10 shrink-0 rounded-pill border-[2.5px] border-ink-900 bg-marigold-500 flex items-center justify-center font-display font-extrabold text-ink-900">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-ink-900">{r.name}</div>
                  <div className="font-mono text-[11px] text-ink-500">{r.date}</div>
                </div>
              </div>
              <div className="flex gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    weight={n <= r.rating ? 'fill' : 'regular'}
                    size={15}
                    className="text-marigold-600"
                  />
                ))}
              </div>
              <p className="text-[14px] leading-relaxed text-ink-800 m-0">{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="font-display font-extrabold text-[26px] text-ink-900 mb-4">Холбоотой бараа</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} size="sm" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
