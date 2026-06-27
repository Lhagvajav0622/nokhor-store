'use client'

import Link from 'next/link'
import { ArrowLeft } from '@phosphor-icons/react'
import ProductCard from '@/components/ProductCard'
import { useProducts } from '@/lib/useProducts'

export default function SalePage() {
  const products = useProducts()
  const saleProducts = products.filter((p) => p.oldPrice)

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 font-body font-bold text-[15px] text-ink-900 mb-5 hover:text-cobalt-600 transition-colors">
        <ArrowLeft weight="bold" size={18} />
        Нүүр
      </Link>

      {/* Sale hero */}
      <div
        className="grain relative bg-brand-red border-4 border-ink-900 rounded-xl shadow-hard-lg p-8 sm:p-12 text-center text-white overflow-hidden mb-10"
      >
        <div
          className="absolute top-4 left-8 font-display italic font-black text-transparent pointer-events-none select-none"
          style={{ fontSize: 64, WebkitTextStroke: '2px rgba(255,255,255,0.3)', transform: 'rotate(-8deg)' }}
          aria-hidden="true"
        >
          МЯУ!
        </div>
        <div
          className="absolute bottom-4 right-8 font-display italic font-black text-transparent pointer-events-none select-none"
          style={{ fontSize: 64, WebkitTextStroke: '2px rgba(255,255,255,0.3)', transform: 'rotate(6deg)' }}
          aria-hidden="true"
        >
          ГАВ!
        </div>
        <span className="font-mono uppercase tracking-[.14em] text-[12px] font-bold text-white/80 block mb-3">
          Онцгой урамшуулал
        </span>
        <h1
          className="font-display font-black text-white leading-none mb-3"
          style={{ fontSize: 'clamp(36px, 5vw, 60px)', letterSpacing: '-0.03em' }}
        >
          Хямдрал эхэллээ!
        </h1>
        <p className="text-[17px] text-white/80 max-w-[480px] mx-auto">
          Шилдэг барааг хямдарсан үнээр авах боломж. Хязгаарлагдмал хугацаанд!
        </p>
      </div>

      {saleProducts.length === 0 ? (
        <div className="text-center py-16 text-ink-500">
          <p className="font-bold text-ink-900">Одоогоор хямдрал байхгүй 🐾</p>
          <Link href="/products" className="mt-4 inline-block text-cobalt-600 font-bold hover:underline">Бүх бараа харах →</Link>
        </div>
      ) : (
        <>
          <p className="font-mono text-[13px] text-ink-500 mb-4">{saleProducts.length} хямдарсан бараа</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {saleProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
