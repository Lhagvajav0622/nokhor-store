'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Heart, Package, SignIn, SignOut, MagnifyingGlass, Sparkle, UserCircle,
} from '@phosphor-icons/react'
import { useStore } from '@/lib/store'
import { useAuth } from '@/lib/auth'

const STATUS_LABELS = ['Захиалга өгсөн', 'Баталгаажсан', 'Бэлтгэж байна', 'Хүргэлтэд гарсан', 'Хүргэгдсэн']
const STATUS_CHIP = [
  'bg-marigold-200 text-ink-900', 'bg-cobalt-100 text-cobalt-600', 'bg-paper-100 text-ink-800',
  'bg-cobalt-600 text-paper-0', 'bg-brand-green-light text-brand-green',
]

const TIERS = [
  { name: 'Шинэ', min: 0 }, { name: 'Хүрэл', min: 500 }, { name: 'Мөнгөн', min: 1000 },
  { name: 'Алтан', min: 2000 }, { name: 'Платинум', min: 5000 },
]
const tierFor = (pts: number) => [...TIERS].reverse().find((t) => pts >= t.min)?.name ?? 'Шинэ'

type Order = { no: string; date: string; items: number; total: number | string; status: number }

const fieldCls =
  'h-[46px] px-4 font-body text-[15px] border-[2.5px] border-ink-900 rounded-md bg-paper-50 focus:outline-none focus:border-cobalt-600'

export default function AccountPage() {
  const { favs } = useStore()
  const { user, login, logout } = useAuth()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const favCount = Object.values(favs).filter(Boolean).length

  // Login form
  const [phone, setPhone] = useState('')
  const [pw, setPw] = useState('')
  const [loginErr, setLoginErr] = useState('')

  // Track form
  const [trackNo, setTrackNo] = useState('')
  const [trackPhone, setTrackPhone] = useState('')
  const [tracking, setTracking] = useState(false)
  const [trackErr, setTrackErr] = useState('')
  const [tracked, setTracked] = useState<Order | null>(null)

  // My orders (logged in)
  const [myOrders, setMyOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    setOrdersLoading(true)
    fetch('/api/orders/mine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: user.phone }),
    })
      .then((r) => r.json())
      .then((d) => setMyOrders(d.ok ? d.orders : []))
      .catch(() => setMyOrders([]))
      .finally(() => setOrdersLoading(false))
  }, [user])

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginErr('')
    const res = login(phone, pw)
    if (!res.ok) setLoginErr(res.error || 'Нэвтрэх амжилтгүй.')
    else { setPhone(''); setPw('') }
  }

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault()
    setTrackErr('')
    setTracked(null)
    setTracking(true)
    try {
      const r = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNo: trackNo, phone: trackPhone }),
      })
      const d = await r.json()
      if (d.ok) setTracked(d.order)
      else setTrackErr(d.error || 'Олдсонгүй.')
    } catch {
      setTrackErr('Алдаа гарлаа.')
    } finally {
      setTracking(false)
    }
  }

  const Back = (
    <Link href="/" className="inline-flex items-center gap-1.5 font-body font-bold text-[15px] text-ink-900 mb-5 hover:text-cobalt-600 transition-colors">
      <ArrowLeft weight="bold" size={18} /> Нүүр
    </Link>
  )

  if (!mounted) {
    return <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8"><div className="h-40 bg-paper-100 rounded-xl animate-pulse" /></div>
  }

  // ─────────── LOGGED IN ───────────
  if (user) {
    return (
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8">
        {Back}
        <div className="grain relative bg-cobalt-600 border-4 border-ink-900 rounded-xl shadow-hard-lg p-6 sm:p-7 text-paper-0 flex items-center gap-4 flex-wrap mb-5 overflow-hidden">
          <div className="w-[72px] h-[72px] shrink-0 rounded-pill border-[3px] border-ink-900 bg-marigold-500 flex items-center justify-center font-display font-black text-[32px] text-ink-900 shadow-hard">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-[160px]">
            <h1 className="font-display font-extrabold text-[28px] text-paper-0 m-0">{user.name}</h1>
            <p className="font-mono text-[13px] text-cobalt-100 mt-1">+976 {user.phone.replace(/(\d{4})(\d{4})/, '$1-$2')} · {user.since} оноос гишүүн</p>
          </div>
          <button
            onClick={logout}
            className="nx-press inline-flex items-center gap-1.5 h-10 px-4 font-bold text-[14px] border-[2.5px] border-ink-900 rounded-pill bg-paper-0 text-ink-900 shadow-hard-sm cursor-pointer"
          >
            <SignOut weight="bold" size={16} /> Гарах
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-paper-0 border-[2.5px] border-ink-900 rounded-md p-4 shadow-hard-sm">
            <div className="font-mono text-[12px] text-ink-500 uppercase tracking-[.08em]">Захиалга</div>
            <div className="font-display font-extrabold text-[30px] text-ink-900">{myOrders.length}</div>
          </div>
          <Link href="/wishlist" className="nx-press bg-paper-0 border-[2.5px] border-ink-900 rounded-md p-4 shadow-hard-sm cursor-pointer block">
            <div className="font-mono text-[12px] text-ink-500 uppercase tracking-[.08em]">Дуртай</div>
            <div className="font-display font-extrabold text-[30px] text-ink-900 flex items-center gap-1">
              {favCount}<Heart weight="fill" size={20} className="text-brand-red" />
            </div>
          </Link>
          <Link href="/loyalty" className="nx-press bg-marigold-500 border-[2.5px] border-ink-900 rounded-md p-4 shadow-hard-sm cursor-pointer block">
            <div className="font-mono text-[12px] text-ink-900 uppercase tracking-[.08em]">Оноо · {tierFor(user.points)}</div>
            <div className="font-display font-extrabold text-[30px] text-ink-900">{user.points.toLocaleString('mn-MN')}</div>
          </Link>
        </div>

        <h2 className="font-display font-extrabold text-[24px] text-ink-900 mb-4">Миний захиалга</h2>
        {ordersLoading ? (
          <div className="h-20 bg-paper-100 rounded-md animate-pulse" />
        ) : myOrders.length === 0 ? (
          <div className="bg-paper-0 border-[2.5px] border-ink-900 rounded-md p-8 text-center text-ink-500">
            <Package size={40} className="text-ink-300 mx-auto mb-2" />
            <p className="font-bold text-ink-900">Захиалга алга байна</p>
            <Link href="/products" className="text-cobalt-600 font-bold hover:underline text-[14px]">Дэлгүүр үзэх →</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mb-10">
            {myOrders.map((o) => (
              <div key={o.no} className="flex items-center gap-4 bg-paper-0 border-[2.5px] border-ink-900 rounded-md p-4 shadow-hard-sm">
                <span className="w-10 h-10 shrink-0 rounded-md bg-cobalt-600 border-2 border-ink-900 flex items-center justify-center text-paper-0">
                  <Package weight="fill" size={20} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-mono font-bold text-ink-900">{o.no}</div>
                  <div className="font-mono text-[12px] text-ink-500">{o.date} · {o.items} бараа</div>
                </div>
                <span className={`font-mono text-[11.5px] font-bold px-2.5 py-1 rounded-pill border-2 border-ink-900 ${STATUS_CHIP[o.status]}`}>
                  {STATUS_LABELS[o.status]}
                </span>
                <span className="font-mono font-bold text-ink-900 hidden sm:block">{o.total}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ─────────── GUEST ───────────
  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8">
      {Back}
      <h1 className="font-display font-extrabold text-[34px] text-ink-900 mb-2" style={{ letterSpacing: '-0.02em' }}>
        Профайл
      </h1>
      <p className="text-[16px] text-ink-800 mb-8 max-w-[560px]">
        Бүртгэлгүйгээр чөлөөтэй худалдан авалт хийж, захиалгаа хянах боломжтой. Оноо цуглуулж,
        онцгой урамшуулал авахыг хүсвэл нэвтэрнэ үү.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Order tracking — no login needed */}
        <div className="bg-paper-0 border-4 border-ink-900 rounded-xl shadow-hard-lg p-6">
          <h2 className="font-display font-extrabold text-[20px] text-ink-900 mb-1 flex items-center gap-2">
            <MagnifyingGlass weight="bold" size={22} className="text-cobalt-600" /> Захиалга хянах
          </h2>
          <p className="text-[14px] text-ink-500 mb-4">Бүртгэлгүйгээр — захиалгын дугаар + утсаараа.</p>
          <form onSubmit={handleTrack} className="grid gap-3">
            <input className={fieldCls} placeholder="Захиалгын дугаар (ж: NX-204881)" value={trackNo} onChange={(e) => setTrackNo(e.target.value)} />
            <input className={fieldCls} placeholder="Утасны дугаар" value={trackPhone} onChange={(e) => setTrackPhone(e.target.value)} />
            {trackErr && <p className="text-brand-red text-[13px] font-semibold">{trackErr}</p>}
            <button type="submit" disabled={tracking} className="nx-press h-12 font-bold text-[15px] border-[2.5px] border-ink-900 rounded-pill bg-cobalt-600 text-paper-0 shadow-hard cursor-pointer disabled:opacity-60">
              {tracking ? 'Хайж байна…' : 'Хянах'}
            </button>
          </form>
          {tracked && (
            <div className="mt-4 bg-paper-50 border-[2.5px] border-ink-900 rounded-md p-4 animate-pop">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono font-bold text-ink-900">{tracked.no}</span>
                <span className={`font-mono text-[11.5px] font-bold px-2.5 py-1 rounded-pill border-2 border-ink-900 ${STATUS_CHIP[tracked.status]}`}>
                  {STATUS_LABELS[tracked.status]}
                </span>
              </div>
              <div className="font-mono text-[12px] text-ink-500">{tracked.date} · {tracked.items} бараа · {tracked.total}</div>
            </div>
          )}
        </div>

        {/* Optional login */}
        <div className="bg-paper-0 border-[2.5px] border-ink-900 rounded-xl shadow-hard p-6">
          <h2 className="font-display font-extrabold text-[20px] text-ink-900 mb-1 flex items-center gap-2">
            <UserCircle weight="bold" size={22} className="text-cobalt-600" /> Нэвтрэх
          </h2>
          <p className="text-[14px] text-ink-500 mb-4 flex items-center gap-1.5">
            <Sparkle weight="fill" size={14} className="text-marigold-600" />
            Оноо цуглуулж, онцгой урамшуулал аваарай.
          </p>
          <form onSubmit={handleLogin} className="grid gap-3">
            <input className={fieldCls} placeholder="Утасны дугаар" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input className={fieldCls} type="password" placeholder="Нууц үг" value={pw} onChange={(e) => setPw(e.target.value)} />
            {loginErr && <p className="text-brand-red text-[13px] font-semibold">{loginErr}</p>}
            <button type="submit" className="nx-press h-12 inline-flex items-center justify-center gap-2 font-bold text-[15px] border-[2.5px] border-ink-900 rounded-pill bg-marigold-500 text-ink-900 shadow-hard cursor-pointer">
              <SignIn weight="bold" size={18} /> Нэвтрэх
            </button>
          </form>
          <div className="mt-4 bg-cobalt-100 border-2 border-cobalt-600 rounded-md p-3 font-mono text-[12px] text-cobalt-700">
            Туршилтын бүртгэл — Утас: <b>9911-2233</b> · Нууц үг: <b>123456</b>
          </div>
        </div>
      </div>
    </div>
  )
}
