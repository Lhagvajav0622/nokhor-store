'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Minus } from '@phosphor-icons/react'
import { FAQS } from '@/data/products'

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="max-w-[780px] mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 font-body font-bold text-[15px] text-ink-900 mb-5 hover:text-cobalt-600 transition-colors">
        <ArrowLeft weight="bold" size={18} />
        Нүүр
      </Link>

      <h1 className="font-display font-extrabold text-[34px] text-ink-900 mb-2" style={{ letterSpacing: '-0.02em' }}>
        Түгээмэл асуулт
      </h1>
      <p className="text-[16px] text-ink-800 mb-8">Хариулт олдохгүй бол <b>7700-1234</b> дугаарт залгаарай.</p>

      <div className="flex flex-col gap-3">
        {FAQS.map((faq, i) => (
          <div
            key={i}
            className={`bg-paper-0 border-[2.5px] border-ink-900 rounded-lg overflow-hidden transition-shadow ${
              open === i ? 'shadow-hard' : 'shadow-hard-sm'
            }`}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left cursor-pointer bg-none border-0"
              aria-expanded={open === i}
            >
              <span className="font-bold text-[16px] text-ink-900">{faq.q}</span>
              <span className="shrink-0 text-cobalt-600">
                {open === i ? <Minus weight="bold" size={20} /> : <Plus weight="bold" size={20} />}
              </span>
            </button>
            {open === i && (
              <div className="px-5 pb-5 border-t border-dashed border-paper-200">
                <p className="text-[15px] leading-relaxed text-ink-800 mt-3 m-0">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="mt-10 bg-cobalt-600 border-4 border-ink-900 rounded-xl shadow-hard-lg p-6 text-paper-0 text-center">
        <h2 className="font-display font-extrabold text-[24px] mb-2">Асуух зүйл байна уу?</h2>
        <p className="text-cobalt-100 mb-4">Бид тантай холбогдоход баяртай байна</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a
            href="tel:77001234"
            className="nx-press h-12 px-6 inline-flex items-center gap-2 font-bold text-[16px] border-[2.5px] border-ink-900 rounded-pill bg-paper-0 text-ink-900 shadow-hard cursor-pointer"
          >
            📞 7700-1234
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="nx-press h-12 px-6 inline-flex items-center gap-2 font-bold text-[16px] border-[2.5px] border-ink-900 rounded-pill bg-marigold-500 text-ink-900 shadow-hard cursor-pointer"
          >
            💬 Messenger
          </a>
        </div>
      </div>
    </div>
  )
}
