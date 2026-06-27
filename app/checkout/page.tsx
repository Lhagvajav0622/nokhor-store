'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  MapPin,
  Bag,
  CheckCircle,
  House,
  Copy,
  Clock,
  Info,
} from '@phosphor-icons/react'
import { useStore, cartTotal } from '@/lib/store'
import { PRODUCTS, BANKS, fmt } from '@/data/products'
import ProductIcon from '@/components/ProductIcon'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useStore()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [orderNo, setOrderNo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedBank, setCopiedBank] = useState('')

  const subtotal = cartTotal(cart, PRODUCTS)
  const FREE_SHIP = 100000
  const shipping = subtotal >= FREE_SHIP || subtotal === 0 ? 0 : 5900
  const total = subtotal + shipping

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !phone || !address) {
      setError('Бүх талбарыг бөглөнө үү.')
      return
    }
    setError('')
    setLoading(true)

    const no = 'NX-' + String(Math.floor(100000 + Math.random() * 899999))
    const items = cart.map((ci) => {
      const p = PRODUCTS.find((pr) => pr.id === ci.id)
      return { name: p?.name, qty: ci.qty, price: p ? fmt(p.price * ci.qty) : '' }
    })

    try {
      await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNo: no, name, phone, address, note, items, total: fmt(total) }),
      })
    } catch (_) {}

    setOrderNo(no)
    setSubmitted(true)
    clearCart()
    setLoading(false)
    window.scrollTo(0, 0)
  }

  function copyAccount(acc: string, bank: string) {
    navigator.clipboard.writeText(acc).catch(() => {})
    setCopiedBank(bank)
    setTimeout(() => setCopiedBank(''), 2000)
  }

  if (cart.length === 0 && !submitted) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="font-display font-black text-[48px]">🛒</p>
        <p className="font-bold text-ink-900 text-[18px]">Сагс хоосон байна</p>
        <button onClick={() => router.push('/products')} className="mt-4 text-cobalt-600 font-bold hover:underline">
          Дэлгүүр рүү буцах →
        </button>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="max-w-[560px] mx-auto px-4 sm:px-6 py-12">
        <div className="text-center bg-paper-0 border-4 border-ink-900 rounded-xl shadow-hard-lg p-10">
          <div className="w-24 h-24 mx-auto mb-4 rounded-pill bg-brand-green border-[3px] border-ink-900 flex items-center justify-center text-white shadow-hard animate-pop">
            <CheckCircle weight="bold" size={54} />
          </div>
          <h1 className="font-display font-black text-[34px] text-ink-900 mb-2">
            Захиалга баталгаажлаа!
          </h1>
          <p className="text-[16px] text-ink-800 mb-1">
            Баярлалаа 🐾 Бид удахгүй холбогдоно.
          </p>
          <div className="inline-block font-mono text-[14px] font-bold bg-marigold-200 border-[2.5px] border-ink-900 rounded-pill px-4 py-2 mt-2.5 mb-1.5">
            Захиалгын дугаар: {orderNo}
          </div>
          <p className="font-mono text-[14px] text-ink-500 mb-6">
            Нийт дүн: {fmt(total)} · Банкны шилжүүлэг
          </p>

          <div className="text-left bg-marigold-200 border-[2.5px] border-ink-900 rounded-md p-4 mb-6">
            <p className="font-bold text-ink-900 mb-2 flex items-center gap-2">
              <Info weight="fill" size={16} className="text-cobalt-600" />
              Дараагийн алхам
            </p>
            <p className="text-[14px] text-ink-800 leading-relaxed">
              Доорх дансаар төлбөр шилжүүлж, гүйлгээний лавлагаа/зургийг{' '}
              <b>7700-1234</b> дугаарт Viber/WhatsApp-аар илгээнэ үү.
            </p>
          </div>

          <button
            onClick={() => router.push('/')}
            className="nx-press h-[52px] px-7 inline-flex items-center gap-2 font-bold text-[16px] border-[2.5px] border-ink-900 rounded-pill bg-cobalt-600 text-paper-0 cursor-pointer shadow-hard"
          >
            <House weight="bold" size={18} />
            Нүүр хуудас руу
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 bg-none border-0 cursor-pointer font-body font-bold text-[15px] text-ink-900 mb-5 p-0 hover:text-cobalt-600 transition-colors"
      >
        <ArrowLeft weight="bold" size={18} />
        Сагс руу буцах
      </button>

      <h1 className="font-display font-extrabold text-[34px] text-ink-900 mb-6" style={{ letterSpacing: '-0.02em' }}>
        Төлбөр төлөх
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_.85fr] gap-7 items-start">
          {/* Left */}
          <div className="flex flex-col gap-5">
            {/* Delivery */}
            <div className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard p-5">
              <h2 className="font-display font-extrabold text-[20px] text-ink-900 mb-4 flex items-center gap-2">
                <MapPin weight="fill" size={22} className="text-cobalt-600" />
                Хүргэлтийн мэдээлэл
              </h2>
              <div className="grid gap-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Нэр *"
                  required
                  className="h-[46px] px-4 font-body text-[15px] border-[2.5px] border-ink-900 rounded-md bg-paper-50 focus:outline-none focus:border-cobalt-600"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Утасны дугаар *"
                  required
                  type="tel"
                  className="h-[46px] px-4 font-body text-[15px] border-[2.5px] border-ink-900 rounded-md bg-paper-50 focus:outline-none focus:border-cobalt-600"
                />
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Хаяг (дүүрэг, хороо, байр, тоот) *"
                  required
                  className="h-[46px] px-4 font-body text-[15px] border-[2.5px] border-ink-900 rounded-md bg-paper-50 focus:outline-none focus:border-cobalt-600"
                />
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Нэмэлт тэмдэглэл (заавал биш)"
                  rows={2}
                  className="px-4 py-3 font-body text-[15px] border-[2.5px] border-ink-900 rounded-md bg-paper-50 focus:outline-none focus:border-cobalt-600 resize-none"
                />
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard p-5">
              <h2 className="font-display font-extrabold text-[20px] text-ink-900 mb-3 flex items-center gap-2">
                <Bag weight="fill" size={22} className="text-cobalt-600" />
                Захиалга
              </h2>
              <div className="flex flex-col gap-2.5">
                {cart.map((ci) => {
                  const p = PRODUCTS.find((pr) => pr.id === ci.id)
                  if (!p) return null
                  return (
                    <div key={ci.id} className="flex items-center gap-3">
                      <div className="grain relative w-12 h-12 shrink-0 border-[2.5px] border-ink-900 rounded-sm bg-paper-100 flex items-center justify-center overflow-hidden">
                        <ProductIcon name={p.icon} size={24} className="text-ink-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[14px] text-ink-900 leading-snug">{p.name}</div>
                        <div className="font-mono text-[12px] text-ink-500">{ci.qty} ш × {fmt(p.price)}</div>
                      </div>
                      <div className="font-mono font-bold text-[14px] text-ink-900">{fmt(p.price * ci.qty)}</div>
                    </div>
                  )
                })}
              </div>
              <div className="border-t border-dashed border-paper-200 mt-3.5 pt-3.5 flex flex-col gap-2 text-[14px]">
                <div className="flex justify-between">
                  <span>Дэд дүн</span>
                  <b className="font-mono">{fmt(subtotal)}</b>
                </div>
                <div className="flex justify-between">
                  <span>Хүргэлт</span>
                  <b className="font-mono">{shipping === 0 ? 'Үнэгүй' : fmt(shipping)}</b>
                </div>
                <div className="flex justify-between border-t-2 border-ink-900 pt-2.5 mt-1">
                  <span className="font-extrabold">Нийт төлөх</span>
                  <b className="font-mono text-[20px] text-ink-900">{fmt(total)}</b>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Payment */}
          <div className="flex flex-col gap-5">
            {/* Bank transfer */}
            <div className="bg-paper-0 border-4 border-ink-900 rounded-xl shadow-hard-lg overflow-hidden">
              <div className="bg-cobalt-600 text-paper-0 px-5 py-4 flex items-center justify-between border-b-4 border-ink-900">
                <span className="font-display font-extrabold text-[20px] flex items-center gap-2">
                  🏦 Банкны шилжүүлэг
                </span>
                <span className="font-mono text-[12px] font-bold bg-marigold-500 text-ink-900 px-3 py-1 rounded-pill border-2 border-ink-900">
                  Идэвхтэй
                </span>
              </div>
              <div className="p-5">
                <p className="text-[14px] text-ink-800 mb-4 leading-relaxed">
                  Захиалга баталгаажсаны дараа доорх дансуудаас аль нэгэнд{' '}
                  <b>{fmt(total)}</b> шилжүүлнэ үү.
                </p>
                <div className="flex flex-col gap-2.5">
                  {BANKS.map((b) => (
                    <div
                      key={b.name}
                      className="flex items-center justify-between bg-paper-50 border-[2.5px] border-ink-900 rounded-md px-3.5 py-2.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-8 h-8 rounded-sm flex items-center justify-center font-mono font-bold text-[11px] text-white border-2 border-ink-900"
                          style={{ background: b.bg }}
                        >
                          {b.name.slice(0, 2)}
                        </span>
                        <div>
                          <div className="font-bold text-[13px] text-ink-900">{b.name}</div>
                          <div className="font-mono text-[12px] text-ink-500">{b.account}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyAccount(b.account, b.name)}
                        className="flex items-center gap-1 font-mono text-[11px] font-bold text-cobalt-600 hover:text-cobalt-700 transition-colors"
                        aria-label={`${b.name} дансны дугаар хуулах`}
                      >
                        <Copy weight="bold" size={14} />
                        {copiedBank === b.name ? 'Хуулсан!' : 'Хуулах'}
                      </button>
                    </div>
                  ))}
                </div>
                <p className="font-mono text-[12px] text-ink-500 mt-3 leading-relaxed">
                  Гүйлгээний утга: захиалгын дугаар + нэр<br />
                  Гүйлгээний зургийг <b>7700-1234</b> дугаарт Viber-ээр илгээнэ үү.
                </p>
              </div>
            </div>

            {/* QPay coming soon */}
            <div className="bg-paper-100 border-[2.5px] border-dashed border-ink-900 rounded-lg p-4 flex items-center gap-3 opacity-70">
              <Clock weight="fill" size={22} className="text-ink-500 shrink-0" />
              <div>
                <div className="font-bold text-[14px] text-ink-900">QPay · Тун удахгүй</div>
                <div className="font-mono text-[12px] text-ink-500">QPay QR кодоор шууд төлөх боломж нэмэгдэх болно</div>
              </div>
            </div>

            {error && (
              <p className="text-brand-red font-bold text-[14px]">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="nx-press w-full h-14 flex items-center justify-center gap-2 font-bold text-[18px] border-[2.5px] border-ink-900 rounded-pill bg-brand-green text-white cursor-pointer shadow-hard disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <CheckCircle weight="bold" size={22} />
              {loading ? 'Илгээж байна…' : 'Захиалга баталгаажуулах'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
