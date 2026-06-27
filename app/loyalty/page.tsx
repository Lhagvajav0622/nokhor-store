import Link from 'next/link'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'

const TIERS = [
  { name: 'Шинэ',     min: 0,    max: 500,  color: '#9aa6ef', badge: '🌱' },
  { name: 'Хүрэл',    min: 500,  max: 1000, color: '#ef9f63', badge: '🥉' },
  { name: 'Мөнгөн',   min: 1000, max: 2000, color: '#a8a39a', badge: '🥈' },
  { name: 'Алтан',    min: 2000, max: 5000, color: '#ffc833', badge: '🥇' },
  { name: 'Платинум', min: 5000, max: Infinity, color: '#2536ce', badge: '💎' },
]

const USER_POINTS = 1240
const USER_TIER = 'Алтан'
const NEXT_TIER_THRESHOLD = 2000

export default function LoyaltyPage() {
  const progress = Math.min((USER_POINTS / NEXT_TIER_THRESHOLD) * 100, 100)

  return (
    <div className="max-w-[780px] mx-auto px-4 sm:px-6 py-8">
      <Link href="/account" className="inline-flex items-center gap-1.5 font-body font-bold text-[15px] text-ink-900 mb-5 hover:text-cobalt-600 transition-colors">
        <ArrowLeft weight="bold" size={18} />
        Профайл
      </Link>

      {/* Points card */}
      <div className="grain relative bg-cobalt-600 border-4 border-ink-900 rounded-xl shadow-hard-lg p-8 text-paper-0 overflow-hidden mb-6">
        <div
          className="absolute -top-6 -right-6 font-display font-black text-[80px] text-white/10 pointer-events-none select-none"
          aria-hidden="true"
        >
          ★
        </div>
        <div className="font-mono text-[12px] uppercase tracking-[.12em] text-cobalt-100 mb-1">
          Миний оноо
        </div>
        <div className="font-display font-black text-[64px] leading-none text-paper-0 mb-1">
          {USER_POINTS.toLocaleString('mn-MN')}
        </div>
        <div className="font-mono text-[14px] text-cobalt-100 mb-6">
          {USER_TIER} гишүүн · {NEXT_TIER_THRESHOLD - USER_POINTS} оноо нэмэлт цуглуулбал Платинум
        </div>
        {/* Progress */}
        <div className="bg-cobalt-700 rounded-pill border-2 border-ink-900 h-4 overflow-hidden">
          <div
            className="bg-marigold-500 h-full rounded-pill transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5 font-mono text-[11px] text-cobalt-100">
          <span>0</span>
          <span>Платинум: {NEXT_TIER_THRESHOLD.toLocaleString('mn-MN')}</span>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard p-6 mb-6">
        <h2 className="font-display font-extrabold text-[22px] text-ink-900 mb-4">Хэрхэн ажилладаг вэ?</h2>
        <div className="flex flex-col gap-4">
          {[
            { step: '01', title: 'Захиалга өг', desc: '₮1,000 тутамд 10 оноо цуглуулна' },
            { step: '02', title: 'Оноо хуримтлуул', desc: 'Онооны дагуу гишүүнчлэлийн түвшин дэвших' },
            { step: '03', title: 'Урамшуулал эдэл', desc: 'Цуглуулсан оноогоор хөнгөлөлт авна' },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 items-start">
              <div className="font-display font-black text-[32px] text-marigold-500 leading-none w-12 shrink-0">
                {item.step}
              </div>
              <div>
                <div className="font-bold text-[16px] text-ink-900">{item.title}</div>
                <div className="text-[14px] text-ink-800 mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tiers */}
      <h2 className="font-display font-extrabold text-[22px] text-ink-900 mb-4">Гишүүнчлэлийн түвшин</h2>
      <div className="flex flex-col gap-3">
        {TIERS.map((tier) => {
          const isCurrent = tier.name === USER_TIER
          return (
            <div
              key={tier.name}
              className={`flex items-center justify-between px-4 py-3.5 rounded-md border-[2.5px] border-ink-900 ${
                isCurrent ? 'shadow-hard' : 'shadow-hard-sm bg-paper-0'
              }`}
              style={isCurrent ? { background: tier.color } : {}}
            >
              <div className="flex items-center gap-3">
                <span className="text-[28px]">{tier.badge}</span>
                <div>
                  <div className={`font-bold text-[16px] ${isCurrent ? 'text-ink-900' : 'text-ink-900'}`}>
                    {tier.name} {isCurrent && <span className="font-mono text-[11px] bg-ink-900 text-paper-0 px-2 py-0.5 rounded-pill ml-2">Одоогийн</span>}
                  </div>
                  <div className="font-mono text-[12px] text-ink-500">
                    {tier.max === Infinity ? `${tier.min.toLocaleString()}+ оноо` : `${tier.min.toLocaleString()} – ${tier.max.toLocaleString()} оноо`}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
