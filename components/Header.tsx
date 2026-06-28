'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  MagnifyingGlass,
  Heart,
  User,
  ShoppingCart,
  Truck,
  Phone,
  PawPrint,
} from '@phosphor-icons/react'
import { useStore, cartCount } from '@/lib/store'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { cart, favs, openCart, setSearch, searchQuery } = useStore()

  const count = cartCount(cart)
  const favCount = Object.values(favs).filter(Boolean).length
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) return null

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setSearch(q)
    if (q && pathname === '/') router.push('/products')
  }

  function handleSearchKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && searchQuery) router.push('/products')
  }

  return (
    <header
      className="sticky top-0 z-30 bg-paper-50 border-b-[2.5px] border-ink-900"
      role="banner"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0"
          aria-label="Нөхөр нүүр хуудас"
        >
          <span
            className="w-10 h-10 rounded-[12px] bg-cobalt-600 border-[2.5px] border-ink-900 flex items-center justify-center shadow-hard-sm"
            aria-hidden="true"
          >
            <PawPrint weight="fill" size={24} className="text-paper-0" />
          </span>
          <span
            className="font-display font-black text-2xl tracking-tight text-ink-900 leading-none"
            style={{ letterSpacing: '-0.02em' }}
          >
            Нөхөр
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 relative hidden sm:flex items-center">
          <MagnifyingGlass
            size={20}
            className="absolute left-4 text-ink-500 pointer-events-none"
          />
          <input
            value={searchQuery}
            onChange={handleSearch}
            onKeyDown={handleSearchKey}
            placeholder="Хоол, тоглоом, брэнд хайх…"
            className="w-full h-[46px] pl-11 pr-4 font-body text-[15px] border-[2.5px] border-ink-900 rounded-pill bg-paper-0 shadow-hard-sm focus:outline-none focus:border-cobalt-600"
            aria-label="Бараа хайх"
          />
        </div>

        {/* Nav icons */}
        <nav className="flex items-center gap-2.5" aria-label="Хэрэглэгчийн цэс">
          {/* Wishlist */}
          <Link
            href="/wishlist"
            aria-label={`Дуртай бараа${favCount > 0 ? ` (${favCount})` : ''}`}
            className="nx-icbtn relative w-11 h-11 border-[2.5px] border-ink-900 rounded-pill bg-paper-0 cursor-pointer flex items-center justify-center text-ink-900 shadow-hard-sm"
          >
            <Heart weight="bold" size={20} />
            {favCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-marigold-500 text-ink-900 rounded-pill border-2 border-ink-900 font-mono text-[11px] font-bold flex items-center justify-center">
                {favCount}
              </span>
            )}
          </Link>

          {/* Account */}
          <Link
            href="/account"
            aria-label="Профайл"
            className="nx-icbtn w-11 h-11 border-[2.5px] border-ink-900 rounded-pill bg-paper-0 cursor-pointer flex items-center justify-center text-ink-900 shadow-hard-sm"
          >
            <User weight="bold" size={20} />
          </Link>

          {/* Cart */}
          <div className="relative">
            <button
              onClick={openCart}
              aria-label={`Сагс${count > 0 ? ` (${count})` : ''}`}
              className="nx-icbtn w-11 h-11 border-[2.5px] border-ink-900 rounded-[14px] bg-cobalt-600 text-paper-0 cursor-pointer flex items-center justify-center shadow-hard-sm"
            >
              <ShoppingCart weight="bold" size={20} />
            </button>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-brand-red text-white rounded-pill border-2 border-ink-900 font-mono text-[11px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </div>
        </nav>
      </div>

      {/* Info strip */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-3 hidden sm:flex gap-6 flex-wrap font-mono text-[12.5px] font-semibold text-ink-800">
        <span className="flex items-center gap-1.5">
          <Truck weight="fill" size={14} />
          ₮100,000-аас дээш үнэгүй хүргэлт
        </span>
        <span className="flex items-center gap-1.5">
          <Phone weight="fill" size={14} />
          7700-1234
        </span>
        <span className="flex items-center gap-1.5">
          <PawPrint weight="fill" size={14} />
          12,000+ аз жаргалтай гэр бүл
        </span>
      </div>
    </header>
  )
}
