'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowClockwise, House } from '@phosphor-icons/react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div
        className="font-display font-black text-[96px] sm:text-[120px] leading-none text-brand-red pointer-events-none select-none"
        aria-hidden="true"
        style={{ WebkitTextStroke: '3px #15151b' }}
      >
        Алдаа
      </div>
      <h1 className="font-display font-extrabold text-[26px] text-ink-900 mt-2 mb-2">
        Ямар нэг зүйл буруудлаа
      </h1>
      <p className="text-[16px] text-ink-800 max-w-[380px] mb-8 leading-relaxed">
        Уучлаарай, хуудсыг ачаалахад алдаа гарлаа. Дахин оролдоно уу эсвэл нүүр хуудас руу буцаарай.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={reset}
          className="nx-press h-14 px-7 inline-flex items-center gap-2 font-bold text-[17px] border-[2.5px] border-ink-900 rounded-pill bg-cobalt-600 text-paper-0 shadow-hard cursor-pointer"
        >
          <ArrowClockwise weight="bold" size={20} />
          Дахин оролдох
        </button>
        <Link
          href="/"
          className="nx-press h-14 px-7 inline-flex items-center gap-2 font-bold text-[17px] border-[2.5px] border-ink-900 rounded-pill bg-paper-0 text-ink-900 shadow-hard"
        >
          <House weight="bold" size={20} />
          Нүүр хуудас
        </Link>
      </div>
    </div>
  )
}
