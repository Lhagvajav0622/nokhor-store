import Link from 'next/link'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'

export default function AboutPage() {
  return (
    <div className="max-w-[860px] mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 font-body font-bold text-[15px] text-ink-900 mb-5 hover:text-cobalt-600 transition-colors">
        <ArrowLeft weight="bold" size={18} />
        Нүүр
      </Link>

      {/* Hero */}
      <div className="grain relative bg-ink-900 border-4 border-ink-900 rounded-xl shadow-hard-lg p-10 sm:p-14 text-center overflow-hidden mb-10">
        <div
          className="absolute top-6 left-8 font-display italic font-black text-transparent pointer-events-none select-none"
          style={{ fontSize: 64, WebkitTextStroke: '2px #2536ce', transform: 'rotate(-10deg)', opacity: 0.7 }}
          aria-hidden="true"
        >
          ГАВ!
        </div>
        <div
          className="absolute bottom-6 right-8 font-display italic font-black text-transparent pointer-events-none select-none"
          style={{ fontSize: 64, WebkitTextStroke: '2px #ffc833', transform: 'rotate(8deg)', opacity: 0.7 }}
          aria-hidden="true"
        >
          МЯУ!
        </div>
        <h1
          className="font-display font-black text-paper-0 mb-4"
          style={{ fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '-0.03em', lineHeight: 1 }}
        >
          Амьтдыг гэр бүл шиг<br />
          <span className="text-marigold-500">хайрладаг</span> дэлгүүр.
        </h1>
        <p className="text-[17px] text-cobalt-100 max-w-[520px] mx-auto leading-relaxed">
          Нөхөр бол 2023 онд Улаанбаатарт байгуулагдсан амьтны тэжээл, дагалдах хэрэгсэл зардаг онлайн дэлгүүр.
        </p>
      </div>

      {/* Story */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {[
          { emoji: '🐾', title: 'Бидний түүх', text: 'Гэрийн тэжээвэр амьтантай болж, Улаанбаатарт чанартай, итгэмжтэй барааны дэлгүүр байхгүйг мэдэрлээ. Тэр л мөчид "Нөхөр" төрсөн.' },
          { emoji: '💙', title: 'Бидний эрхэм зорилго', text: 'Таны гэрийн дорвитой найзыг баяр жаргалтай, эрүүл байлгах бүтээгдэхүүнийг хурдан, найдвартай хүргэх.' },
          { emoji: '🌿', title: 'Чанарын баталгаа', text: 'Бид зөвхөн баталгаажсан, аюулгүй барааг борлуулдаг. 14 хоногийн буцаалтын бодлого танд найдвар өгнө.' },
          { emoji: '🏙️', title: 'Улаанбаатар хотод', text: '24 цагийн дотор хүргэлт, утасны дэмжлэг, Messenger-ээр шуурхай харилцаа бидний амлалт.' },
        ].map((card) => (
          <div key={card.title} className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard-sm p-5">
            <div className="text-[36px] mb-3">{card.emoji}</div>
            <h3 className="font-display font-extrabold text-[20px] text-ink-900 mb-2">{card.title}</h3>
            <p className="text-[15px] leading-relaxed text-ink-800">{card.text}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-marigold-500 border-4 border-ink-900 rounded-xl shadow-hard-lg p-6 sm:p-8 text-center">
        <h2 className="font-display font-extrabold text-[28px] text-ink-900 mb-6">Тоо баримт</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { num: '12,000+', label: 'Аз жаргалтай гэр бүл' },
            { num: '200+',    label: 'Барааны нэр төрөл' },
            { num: '24ц',     label: 'Хүргэлтийн хугацаа' },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-display font-black text-[36px] sm:text-[48px] text-ink-900">{s.num}</div>
              <div className="font-mono text-[13px] text-ink-800 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
