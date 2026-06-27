import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div
        className="font-display font-black text-[120px] sm:text-[160px] leading-none text-cobalt-600 pointer-events-none select-none"
        aria-hidden="true"
        style={{ WebkitTextStroke: '3px #15151b' }}
      >
        404
      </div>
      <div
        className="font-display font-black text-[48px] text-marigold-500 -mt-4 mb-4"
        style={{ WebkitTextStroke: '2px #15151b' }}
        aria-hidden="true"
      >
        МЯУ!
      </div>
      <h1 className="font-display font-extrabold text-[28px] text-ink-900 mb-2">
        Хуудас олдсонгүй
      </h1>
      <p className="text-[16px] text-ink-800 max-w-[360px] mb-8 leading-relaxed">
        Харамсалтай нь таны хайсан зүйл тэнд байсангүй. Нэгдсэн орхиод нүүр хуудас руу буцъя.
      </p>
      <Link
        href="/"
        className="nx-press h-14 px-8 inline-flex items-center gap-2 font-bold text-[18px] border-[2.5px] border-ink-900 rounded-pill bg-cobalt-600 text-paper-0 shadow-hard"
      >
        🏠 Нүүр хуудас
      </Link>
    </div>
  )
}
