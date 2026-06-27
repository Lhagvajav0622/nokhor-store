'use client'

import { useRouter } from 'next/navigation'
import { Heart, Plus, Star } from '@phosphor-icons/react'
import { useStore } from '@/lib/store'
import { type Product, fmt } from '@/data/products'
import ProductIcon from './ProductIcon'

const BADGE_STYLES: Record<string, string> = {
  sale:   'bg-brand-red text-white',
  new:    'bg-cobalt-600 text-paper-0',
  accent: 'bg-marigold-500 text-ink-900',
}

type Props = {
  product: Product
  size?: 'sm' | 'md'
}

export default function ProductCard({ product: p, size = 'md' }: Props) {
  const router = useRouter()
  const { addToCart, toggleFav, favs } = useStore()
  const isFav = !!favs[p.id]

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation()
    if (!p.soldOut) addToCart(p.id, 1)
  }

  function handleFav(e: React.MouseEvent) {
    e.stopPropagation()
    toggleFav(p.id)
  }

  const iconSize = size === 'sm' ? 48 : 64

  return (
    <article
      className="nx-lift flex flex-col bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard overflow-hidden cursor-pointer"
      onClick={() => router.push(`/products/${p.id}`)}
      aria-label={p.name}
    >
      {/* Image area */}
      <div className="grain relative aspect-square bg-paper-100 border-b-[2.5px] border-ink-900 flex items-center justify-center overflow-hidden">
        <ProductIcon name={p.icon} size={iconSize} className="text-ink-300" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          {p.badge && (
            <span
              className={`font-mono text-[11px] font-bold uppercase tracking-[.06em] px-2 py-0.5 rounded-sm border-2 border-ink-900 shadow-hard-sm ${BADGE_STYLES[p.badge.variant]}`}
            >
              {p.badge.label}
            </span>
          )}
          {p.soldOut && (
            <span className="font-mono text-[11px] font-bold uppercase tracking-[.06em] px-2 py-0.5 rounded-sm border-2 border-ink-900 bg-ink-900 text-paper-0">
              Дууссан
            </span>
          )}
        </div>

        {/* Fav button */}
        <button
          onClick={handleFav}
          aria-label={isFav ? 'Дуртайгаас хасах' : 'Дуртайд нэмэх'}
          className={`absolute bottom-2.5 right-2.5 w-9 h-9 shrink-0 border-[2.5px] border-ink-900 rounded-pill cursor-pointer flex items-center justify-center text-[16px] shadow-hard-sm transition-colors ${
            isFav ? 'bg-marigold-500 text-ink-900' : 'bg-paper-0 text-ink-900'
          }`}
        >
          <Heart weight={isFav ? 'fill' : 'bold'} size={16} />
        </button>
      </div>

      {/* Info */}
      <div className={`flex flex-col gap-1 flex-1 ${size === 'sm' ? 'p-3.5' : 'p-4'}`}>
        <span className="font-mono text-[12px] font-bold uppercase tracking-[.06em] text-ink-800">
          {p.category}
        </span>
        <h3 className={`font-body font-bold leading-snug text-ink-900 m-0 ${size === 'sm' ? 'text-[16px]' : 'text-[18px]'}`}>
          {p.name}
        </h3>
        <span className="flex items-center gap-1 font-mono text-[13px] font-semibold text-ink-800">
          <Star weight="fill" size={14} className="text-marigold-600" />
          {p.rating}
        </span>

        {/* Price row */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono font-bold text-[20px] text-ink-900">{fmt(p.price)}</span>
            {p.oldPrice && (
              <span className="font-mono font-semibold text-[13px] text-ink-500 line-through">
                {fmt(p.oldPrice)}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            aria-label="Сагсанд нэмэх"
            disabled={p.soldOut}
            className={`nx-press h-[34px] px-3.5 inline-flex items-center gap-1.5 font-bold text-[14px] border-[2.5px] border-ink-900 rounded-pill cursor-pointer shadow-hard-sm transition-colors ${
              p.soldOut
                ? 'bg-paper-100 text-ink-500 cursor-not-allowed opacity-60'
                : 'bg-cobalt-600 text-paper-0'
            }`}
          >
            <Plus weight="bold" size={14} />
            Нэмэх
          </button>
        </div>
      </div>
    </article>
  )
}
