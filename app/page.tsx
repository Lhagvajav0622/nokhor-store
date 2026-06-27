'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Storefront, Truck, QrCode, ShieldCheck, PawPrint,
  Cat, Dog, Rabbit, Fish,
} from '@phosphor-icons/react'
import ProductCard from '@/components/ProductCard'
import { PET_CATEGORIES } from '@/data/products'
import { useProducts } from '@/lib/useProducts'

const CAT_ICONS: Record<string, React.ReactNode> = {
  cat:    <Cat weight="fill" size={38} />,
  dog:    <Dog weight="fill" size={38} />,
  rabbit: <Rabbit weight="fill" size={38} />,
  fish:   <Fish weight="fill" size={38} />,
}

const TILE_CATS = PET_CATEGORIES.filter(c => c.id !== 'all' && c.id !== 'bird')

export default function HomePage() {
  const router = useRouter()
  const products = useProducts()
  const featured = products.slice(0, 8)

  return (
    <div className="pb-12">
      {/* ── Hero ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mt-5">
        <div
          className="grain relative grid grid-cols-1 md:grid-cols-[1.1fr_.9fr] bg-cobalt-600 rounded-xl border-4 border-ink-900 shadow-hard-lg overflow-hidden"
          style={{ minHeight: 320 }}
        >
          {/* Left copy */}
          <div className="p-8 sm:p-12 text-paper-0">
            <span className="font-mono uppercase tracking-[.12em] text-[12px] font-bold flex items-center gap-1.5 mb-3 opacity-90">
              <PawPrint weight="fill" size={14} />
              Улаанбаатарын амьтны дэлгүүр
            </span>
            <h1
              className="font-display font-black text-paper-0 leading-none mb-4"
              style={{ fontSize: 'clamp(36px, 5vw, 52px)', letterSpacing: '-0.02em' }}
            >
              Шинэ найзаа<br />
              сайхан хооллоё.
            </h1>
            <p className="text-[17px] leading-relaxed max-w-[420px] mb-6 text-cobalt-100">
              Муур, нохой, туулай — бүгдэд хайртай хоол, тоглоом, дагалдах хэрэгсэл.
              Улаанбаатарт нэг өдрийн дотор хүргэнэ.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/products"
                className="nx-press h-14 px-7 inline-flex items-center gap-2 font-bold text-[18px] border-[2.5px] border-ink-900 rounded-pill bg-ink-900 text-paper-0 shadow-hard"
              >
                <Storefront weight="bold" size={20} />
                Дэлгүүр үзэх
              </Link>
              <Link
                href="/sale"
                className="nx-press h-14 px-7 inline-flex items-center gap-2 font-bold text-[18px] border-[2.5px] border-ink-900 rounded-pill bg-paper-0 text-ink-900 shadow-hard"
              >
                Хямдрал →
              </Link>
            </div>
          </div>

          {/* Right art */}
          <div className="relative bg-marigold-500 border-t-4 md:border-t-0 md:border-l-4 border-ink-900 flex items-center justify-center min-h-[220px] md:min-h-0">
            <div
              className="absolute top-5 left-5 font-display italic font-black text-paper-0 pointer-events-none select-none"
              style={{ fontSize: 42, WebkitTextStroke: '2.5px #15151b', transform: 'rotate(-8deg)' }}
              aria-hidden="true"
            >
              МЯУ!
            </div>
            <PawPrint
              weight="fill"
              size={200}
              className="text-cobalt-600 opacity-20"
              style={{ filter: 'drop-shadow(6px 6px 0 rgba(21,21,27,.2))' }}
            />
            <div className="absolute bottom-4 right-4 bg-paper-0 border-[2.5px] border-ink-900 rounded-pill px-3.5 py-2 font-mono text-[12px] font-bold flex gap-1.5 items-center shadow-hard-sm">
              <Truck weight="fill" size={14} />
              Үнэгүй хүргэлт
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mt-10">
        <h2 className="font-display font-extrabold text-[30px] text-ink-900 mb-4" style={{ letterSpacing: '-0.01em' }}>
          Ангилал
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {TILE_CATS.map((c) => (
            <button
              key={c.id}
              onClick={() => router.push(`/products?pet=${c.id}`)}
              className="nx-tile flex flex-col items-start justify-between gap-3 min-h-[110px] p-4 border-[2.5px] border-ink-900 rounded-lg shadow-hard cursor-pointer text-left"
              style={{ background: c.bg, color: c.fg }}
            >
              <span aria-hidden="true">{CAT_ICONS[c.id] || <PawPrint weight="fill" size={38} />}</span>
              <span className="font-display font-extrabold text-[20px]">{c.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Featured products ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mt-10">
        <div className="flex items-baseline justify-between gap-3 mb-4">
          <h2 className="font-display font-extrabold text-[30px] text-ink-900 m-0" style={{ letterSpacing: '-0.01em' }}>
            Онцлох бараа
          </h2>
          <Link
            href="/products"
            className="font-mono text-[13px] font-bold text-cobalt-600 hover:underline"
          >
            Бүгдийг үзэх →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ── Trust band ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <Truck weight="fill" size={30} className="text-cobalt-600" />, title: '24 цагт хүргэнэ', sub: 'Улаанбаатар хотод' },
            { icon: <QrCode weight="fill" size={30} className="text-cobalt-600" />, title: 'Хялбар төлбөр', sub: 'Банкны шилжүүлэг · QPay удахгүй' },
            { icon: <ShieldCheck weight="fill" size={30} className="text-cobalt-600" />, title: 'Баталгаат бараа', sub: '14 хоног буцаалт' },
          ].map((t) => (
            <div
              key={t.title}
              className="flex gap-3 items-center bg-paper-0 border-[2.5px] border-ink-900 rounded-md p-4 shadow-hard-sm"
            >
              {t.icon}
              <div>
                <div className="font-extrabold text-ink-900">{t.title}</div>
                <div className="text-[13px] text-ink-500">{t.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
