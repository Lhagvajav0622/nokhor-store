'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  PawPrint,
  InstagramLogo,
  FacebookLogo,
  TiktokLogo,
  PaperPlaneTilt,
  Gauge,
} from '@phosphor-icons/react'
import { useState } from 'react'

export default function Footer() {
  const pathname = usePathname()
  const [email, setEmail] = useState('')

  if (pathname.startsWith('/admin')) return null

  return (
    <footer className="bg-ink-900 text-paper-0 mt-20" role="contentinfo">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
        {/* Brand */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2.5 mb-4">
            <span className="w-11 h-11 rounded-[12px] bg-cobalt-600 border-[2.5px] border-ink-700 flex items-center justify-center">
              <PawPrint weight="fill" size={24} className="text-paper-0" />
            </span>
            <span className="font-display font-black text-2xl text-paper-0" style={{ letterSpacing: '-0.02em' }}>
              Нөхөр
            </span>
          </Link>
          <p className="text-[14px] leading-relaxed text-ink-300 mb-4">
            Чиний хамгийн сайн нөхөр.<br />
            Улаанбаатарын амьтны дэлгүүр.
          </p>
          <div className="flex gap-4 text-marigold-500 text-2xl">
            <a href="#" aria-label="Instagram"><InstagramLogo /></a>
            <a href="#" aria-label="Facebook"><FacebookLogo /></a>
            <a href="#" aria-label="TikTok"><TiktokLogo /></a>
          </div>
        </div>

        {/* Shop */}
        <div className="flex flex-col gap-2.5">
          <h4 className="font-mono text-xs text-marigold-500 uppercase tracking-[.12em] mb-1">Дэлгүүр</h4>
          <Link href="/products?pet=cat" className="text-[14px] text-paper-200 hover:text-paper-0 transition-colors">Муур</Link>
          <Link href="/products?pet=dog" className="text-[14px] text-paper-200 hover:text-paper-0 transition-colors">Нохой</Link>
          <Link href="/products" className="text-[14px] text-paper-200 hover:text-paper-0 transition-colors">Бүх бараа</Link>
          <Link href="/sale" className="text-[14px] text-paper-200 hover:text-paper-0 transition-colors">Хямдрал</Link>
        </div>

        {/* Help */}
        <div className="flex flex-col gap-2.5">
          <h4 className="font-mono text-xs text-marigold-500 uppercase tracking-[.12em] mb-1">Тусламж</h4>
          <Link href="/faq" className="text-[14px] text-paper-200 hover:text-paper-0 transition-colors">Хүргэлт</Link>
          <Link href="/faq" className="text-[14px] text-paper-200 hover:text-paper-0 transition-colors">Буцаалт</Link>
          <Link href="/faq" className="text-[14px] text-paper-200 hover:text-paper-0 transition-colors">Түгээмэл асуулт</Link>
          <Link href="/faq" className="text-[14px] text-paper-200 hover:text-paper-0 transition-colors">Холбоо барих</Link>
        </div>

        {/* About */}
        <div className="flex flex-col gap-2.5">
          <h4 className="font-mono text-xs text-marigold-500 uppercase tracking-[.12em] mb-1">Нөхөр</h4>
          <Link href="/about" className="text-[14px] text-paper-200 hover:text-paper-0 transition-colors">Бидний тухай</Link>
          <Link href="/loyalty" className="text-[14px] text-paper-200 hover:text-paper-0 transition-colors">Урамшуулал</Link>
          <Link href="/account" className="text-[14px] text-paper-200 hover:text-paper-0 transition-colors">Миний профайл</Link>
        </div>

        {/* Newsletter */}
        <div className="col-span-2 sm:col-span-1 flex flex-col gap-2.5">
          <h4 className="font-mono text-xs text-marigold-500 uppercase tracking-[.12em] mb-1">Мэдээлэл авах</h4>
          <p className="text-[14px] text-ink-300">Шинэ бараа, хямдралын мэдээ.</p>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="имэйл хаяг"
              className="flex-1 h-[42px] px-3.5 border-[2.5px] border-paper-0 rounded-pill bg-transparent text-paper-0 font-body text-[14px] placeholder:text-ink-300 focus:outline-none focus:border-marigold-500"
            />
            <button
              onClick={() => setEmail('')}
              aria-label="Бүртгүүлэх"
              className="nx-press h-[42px] px-4 border-[2.5px] border-ink-900 rounded-pill bg-marigold-500 text-ink-900 font-bold cursor-pointer shadow-hard-sm flex items-center"
            >
              <PaperPlaneTilt weight="bold" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ink-700">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 flex justify-between flex-wrap gap-2.5 text-[12px] text-ink-300">
          <span>© 2026 Нөхөр ХХК · Улаанбаатар</span>
          <span className="flex gap-4 items-center">
            <Link
              href="/admin"
              className="font-mono text-marigold-500 flex items-center gap-1.5 hover:text-marigold-200 transition-colors"
            >
              <Gauge weight="bold" size={14} />
              Админ
            </Link>
            <span className="font-mono">МЯУ · PROW · ГАВ</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
