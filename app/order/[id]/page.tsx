'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Truck, Bag, CheckCircle } from '@phosphor-icons/react'
import { PRODUCTS, fmt } from '@/data/products'
import ProductIcon from '@/components/ProductIcon'

const ORDERS = [
  { no: 'NX-204881', date: '2026.06.24', status: 3, items: [{ id: 'p1', qty: 2 }, { id: 'p5', qty: 1 }], total: 118000 },
  { no: 'NX-203120', date: '2026.06.18', status: 4, items: [{ id: 'p10', qty: 1 }], total: 78000 },
  { no: 'NX-201744', date: '2026.06.09', status: 4, items: [{ id: 'p2', qty: 1 }, { id: 'p9', qty: 2 }], total: 42500 },
]

const STEPS = [
  { label: 'Захиалга өгсөн',     icon: 'receipt' },
  { label: 'Баталгаажсан',       icon: 'seal-check' },
  { label: 'Бэлтгэж байна',      icon: 'package' },
  { label: 'Хүргэлтэд гарсан',   icon: 'truck' },
  { label: 'Хүргэгдсэн',         icon: 'house-line' },
]

export default function OrderPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const order = ORDERS.find((o) => o.no === id) || ORDERS[0]
  const delivered = order.status >= 4

  return (
    <div className="max-w-[980px] mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => router.push('/account')}
        className="inline-flex items-center gap-1.5 bg-none border-0 cursor-pointer font-body font-bold text-[15px] text-ink-900 mb-5 p-0 hover:text-cobalt-600 transition-colors"
      >
        <ArrowLeft weight="bold" size={18} />
        Захиалгууд
      </button>

      <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
        <div>
          <h1 className="font-display font-extrabold text-[32px] text-ink-900 m-0" style={{ letterSpacing: '-0.02em' }}>
            Захиалга {order.no}
          </h1>
          <p className="font-mono text-[13px] text-ink-500 mt-1">{order.date}</p>
        </div>
        <span
          className={`font-mono text-[12px] font-bold px-3 py-1.5 rounded-pill border-2 border-ink-900 ${
            delivered ? 'bg-brand-green text-white' : 'bg-cobalt-600 text-paper-0'
          }`}
        >
          {STEPS[order.status]?.label}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {/* Tracking stepper */}
        <div className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard p-6">
          <h2 className="font-display font-extrabold text-[20px] text-ink-900 mb-5 flex items-center gap-2">
            <Truck weight="fill" size={22} className="text-cobalt-600" />
            Хүргэлтийн явц
          </h2>
          <div className="flex flex-col gap-5">
            {STEPS.map((step, i) => {
              const done = i <= order.status
              const active = i === order.status
              return (
                <div key={step.label} className="flex gap-3.5 items-start">
                  <div
                    className={`w-[46px] h-[46px] shrink-0 rounded-pill border-[2.5px] border-ink-900 flex items-center justify-center text-[20px] ${
                      active
                        ? 'bg-marigold-500 text-ink-900 shadow-hard-sm'
                        : done
                        ? 'bg-cobalt-600 text-paper-0'
                        : 'bg-paper-0 text-ink-300'
                    }`}
                  >
                    {done ? (active ? '●' : <CheckCircle weight="bold" size={20} />) : '○'}
                  </div>
                  <div className="pt-1">
                    <div
                      className={`font-body text-[16px] ${
                        active
                          ? 'font-extrabold text-ink-900'
                          : done
                          ? 'font-bold text-ink-900'
                          : 'font-semibold text-ink-500'
                      }`}
                    >
                      {step.label}
                    </div>
                    <div className="text-[12px] text-ink-500">
                      {active
                        ? 'Таны захиалга яг энд байна'
                        : done
                        ? 'Дууссан'
                        : 'Хүлээгдэж байна'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Items */}
        <div className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard p-6">
          <h2 className="font-display font-extrabold text-[20px] text-ink-900 mb-4 flex items-center gap-2">
            <Bag weight="fill" size={22} className="text-cobalt-600" />
            Бараа
          </h2>
          <div className="flex flex-col gap-3">
            {order.items.map((it) => {
              const p = PRODUCTS.find((pr) => pr.id === it.id)
              if (!p) return null
              return (
                <div key={it.id} className="flex items-center gap-3 pb-3 border-b border-dashed border-paper-200 last:border-0">
                  <div className="grain relative w-12 h-12 shrink-0 border-[2.5px] border-ink-900 rounded-sm bg-paper-100 flex items-center justify-center overflow-hidden">
                    <ProductIcon name={p.icon} size={24} className="text-ink-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[14px] text-ink-900 leading-snug">{p.name}</div>
                    <div className="font-mono text-[12px] text-ink-500">{it.qty} ширхэг</div>
                  </div>
                  <div className="font-mono font-bold text-[14px] text-ink-900 shrink-0">
                    {fmt(p.price * it.qty)}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="border-t-2 border-ink-900 mt-4 pt-3.5 flex justify-between items-center">
            <span className="font-extrabold text-ink-900">Нийт төлсөн</span>
            <b className="font-mono text-[20px] text-ink-900">{fmt(order.total)}</b>
          </div>
          <div className="mt-3.5 font-mono text-[12px] text-brand-green font-bold flex items-center gap-1.5">
            <CheckCircle weight="fill" size={14} />
            Банкны шилжүүлгээр төлсөн
          </div>
        </div>
      </div>
    </div>
  )
}
