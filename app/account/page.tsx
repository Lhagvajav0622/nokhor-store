'use client'

import Link from 'next/link'
import { ArrowLeft, Heart, MapPin, Package, Star } from '@phosphor-icons/react'
import { useStore } from '@/lib/store'
import { PRODUCTS, fmt } from '@/data/products'

const SAMPLE_ORDERS = [
  { no: 'NX-204881', date: '2026.06.24', status: 'Хүргэлтэд гарсан', delivered: false, items: [{ id: 'p1', qty: 2 }, { id: 'p5', qty: 1 }], total: 118000 },
  { no: 'NX-203120', date: '2026.06.18', status: 'Хүргэгдсэн', delivered: true, items: [{ id: 'p10', qty: 1 }], total: 78000 },
  { no: 'NX-201744', date: '2026.06.09', status: 'Хүргэгдсэн', delivered: true, items: [{ id: 'p2', qty: 1 }, { id: 'p9', qty: 2 }], total: 42500 },
]

export default function AccountPage() {
  const { favs } = useStore()
  const favCount = Object.values(favs).filter(Boolean).length

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-body font-bold text-[15px] text-ink-900 mb-5 hover:text-cobalt-600 transition-colors"
      >
        <ArrowLeft weight="bold" size={18} />
        Нүүр
      </Link>

      {/* Profile banner */}
      <div className="grain relative bg-cobalt-600 border-4 border-ink-900 rounded-xl shadow-hard-lg p-6 sm:p-7 text-paper-0 flex items-center gap-4 flex-wrap mb-5 overflow-hidden">
        <div className="w-[72px] h-[72px] shrink-0 rounded-pill border-[3px] border-ink-900 bg-marigold-500 flex items-center justify-center font-display font-black text-[32px] text-ink-900 shadow-hard">
          Б
        </div>
        <div className="flex-1 min-w-[160px]">
          <h1 className="font-display font-extrabold text-[28px] text-paper-0 m-0">Болормаа Б.</h1>
          <p className="font-mono text-[13px] text-cobalt-100 mt-1">+976 9911-2233 · 2024 оноос гишүүн</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-paper-0 border-[2.5px] border-ink-900 rounded-md p-4 shadow-hard-sm">
          <div className="font-mono text-[12px] text-ink-500 uppercase tracking-[.08em]">Захиалга</div>
          <div className="font-display font-extrabold text-[30px] text-ink-900">{SAMPLE_ORDERS.length}</div>
        </div>
        <Link
          href="/wishlist"
          className="nx-press bg-paper-0 border-[2.5px] border-ink-900 rounded-md p-4 shadow-hard-sm cursor-pointer block"
        >
          <div className="font-mono text-[12px] text-ink-500 uppercase tracking-[.08em]">Дуртай</div>
          <div className="font-display font-extrabold text-[30px] text-ink-900 flex items-center gap-1">
            {favCount}
            <Heart weight="fill" size={20} className="text-brand-red" />
          </div>
        </Link>
        <Link
          href="/loyalty"
          className="nx-press bg-marigold-500 border-[2.5px] border-ink-900 rounded-md p-4 shadow-hard-sm cursor-pointer block"
        >
          <div className="font-mono text-[12px] text-ink-900 uppercase tracking-[.08em]">Оноо</div>
          <div className="font-display font-extrabold text-[30px] text-ink-900">1,240</div>
        </Link>
      </div>

      {/* Orders */}
      <h2 className="font-display font-extrabold text-[24px] text-ink-900 mb-4">Миний захиалга</h2>
      <div className="flex flex-col gap-3 mb-10">
        {SAMPLE_ORDERS.map((o) => {
          const firstItem = PRODUCTS.find((p) => p.id === o.items[0].id)
          const names = o.items.map((it) => PRODUCTS.find((p) => p.id === it.id)?.name || '').filter(Boolean)
          return (
            <Link
              key={o.no}
              href={`/order/${o.no}`}
              className="nx-press flex items-center gap-4 bg-paper-0 border-[2.5px] border-ink-900 rounded-md p-4 shadow-hard-sm cursor-pointer"
            >
              <div className="grain relative w-[52px] h-[52px] shrink-0 border-[2.5px] border-ink-900 rounded-sm bg-paper-100 flex items-center justify-center overflow-hidden">
                <Package weight="fill" size={26} className="text-ink-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono font-bold text-ink-900">{o.no}</span>
                  <span
                    className={`font-mono text-[12px] font-bold px-3 py-1 rounded-pill border-2 border-ink-900 ${
                      o.delivered
                        ? 'bg-brand-green text-white'
                        : 'bg-cobalt-600 text-paper-0'
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
                <p className="text-[13px] text-ink-500 mt-1">
                  {o.date} · {names.slice(0, 2).join(', ')}
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono font-bold text-ink-900">{fmt(o.total)}</div>
                <div className="text-[12px] text-cobalt-600 font-bold">Дэлгэрэнгүй →</div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Address */}
      <h2 className="font-display font-extrabold text-[24px] text-ink-900 mb-4">Хадгалсан хаяг</h2>
      <div className="flex items-start gap-3.5 bg-paper-0 border-[2.5px] border-dashed border-ink-900 rounded-md p-4">
        <MapPin weight="fill" size={26} className="text-cobalt-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-bold text-ink-900">Гэр</div>
          <div className="text-[14px] text-ink-800">ХУД, 11-р хороо, 43-р байр, 12 тоот · +976 9911-2233</div>
        </div>
        <button className="font-mono text-[12px] font-bold text-cobalt-600 hover:underline cursor-pointer bg-none border-0">
          Засах
        </button>
      </div>

      {/* Loyalty promo */}
      <div className="mt-6 bg-marigold-200 border-[2.5px] border-ink-900 rounded-lg p-4 flex items-center gap-3">
        <Star weight="fill" size={28} className="text-marigold-600 shrink-0" />
        <div className="flex-1">
          <div className="font-bold text-ink-900">Алтан гишүүн · 1,240 оноо</div>
          <div className="font-mono text-[12px] text-ink-800">760 оноо нэмэлт цуглуулбал Платинум</div>
        </div>
        <Link href="/loyalty" className="font-mono text-[12px] font-bold text-cobalt-600 hover:underline shrink-0">
          Дэлгэрэнгүй →
        </Link>
      </div>
    </div>
  )
}
