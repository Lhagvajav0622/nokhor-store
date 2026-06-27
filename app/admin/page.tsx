'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Gauge,
  Receipt,
  Package,
  Users,
  Gear,
  ArrowLeft,
  Eye,
  ShoppingBag,
  UserPlus,
  TrendUp,
  TrendDown,
  Wallet,
  UsersThree,
} from '@phosphor-icons/react'
import { PRODUCTS, fmt } from '@/data/products'

type Tab = 'overview' | 'orders' | 'products' | 'customers' | 'settings'

const ADMIN_ORDERS = [
  { no: 'NX-204884', cust: 'Энхжин Б.', date: '2026.06.27', status: 0, items: 3, total: 64000 },
  { no: 'NX-204883', cust: 'Тэмүүлэн Г.', date: '2026.06.27', status: 1, items: 1, total: 22000 },
  { no: 'NX-204882', cust: 'Сараа Б.', date: '2026.06.26', status: 2, items: 2, total: 46500 },
  { no: 'NX-204881', cust: 'Болормаа Б.', date: '2026.06.24', status: 3, items: 3, total: 118000 },
  { no: 'NX-203120', cust: 'Оюунаа Г.', date: '2026.06.18', status: 4, items: 1, total: 78000 },
  { no: 'NX-201744', cust: 'Бат-Эрдэнэ Д.', date: '2026.06.09', status: 4, items: 3, total: 42500 },
]

const STATUS_LABELS = ['Захиалга өгсөн', 'Баталгаажсан', 'Бэлтгэж байна', 'Хүргэлтэд гарсан', 'Хүргэгдсэн']

const STATUS_CHIP_STYLE = [
  'bg-marigold-200 text-ink-900',
  'bg-cobalt-100 text-cobalt-600',
  'bg-paper-100 text-ink-800',
  'bg-cobalt-600 text-paper-0',
  'bg-brand-green-light text-brand-green',
]

const CUSTOMERS = [
  { name: 'Болормаа Б.', phone: '+976 9911-2233', orders: 14, spent: 1840000, tier: 'Алтан', pet: '🐱' },
  { name: 'Оюунаа Г.', phone: '+976 8800-4521', orders: 9, spent: 962000, tier: 'Мөнгөн', pet: '🐶' },
  { name: 'Бат-Эрдэнэ Д.', phone: '+976 9505-1180', orders: 7, spent: 534000, tier: 'Мөнгөн', pet: '🐶' },
  { name: 'Сараа Б.', phone: '+976 9119-7744', orders: 5, spent: 421000, tier: 'Хүрэл', pet: '🐰' },
  { name: 'Энхжин Б.', phone: '+976 8811-2390', orders: 3, spent: 198000, tier: 'Хүрэл', pet: '🐱' },
  { name: 'Тэмүүлэн Г.', phone: '+976 9404-6612', orders: 1, spent: 22000, tier: 'Шинэ', pet: '🐶' },
]

const STOCK: Record<string, number> = { p1:34, p2:128, p3:9, p4:52, p5:6, p6:0, p7:21, p8:74, p9:46, p10:12, p11:88, p12:3 }

const WEEK = [
  { d: 'Да', v: 980 }, { d: 'Мя', v: 1120 }, { d: 'Лх', v: 1340 },
  { d: 'Пү', v: 1210 }, { d: 'Ба', v: 1560 }, { d: 'Бя', v: 1880 }, { d: 'Ня', v: 1640 },
]
const WEEK_MAX = Math.max(...WEEK.map((w) => w.v))

const NAV_ITEMS: { key: Tab; label: string; icon: React.ReactNode; badge?: string }[] = [
  { key: 'overview',   label: 'Самбар',         icon: <Gauge size={20} weight="fill" />, },
  { key: 'orders',     label: 'Захиалга',        icon: <Receipt size={20} weight="fill" />, badge: '4' },
  { key: 'products',   label: 'Бараа',           icon: <Package size={20} weight="fill" /> },
  { key: 'customers',  label: 'Үйлчлүүлэгч',    icon: <Users size={20} weight="fill" /> },
  { key: 'settings',   label: 'Тохиргоо',        icon: <Gear size={20} weight="fill" /> },
]

type AdminOrder = {
  id?: string
  no: string
  cust: string
  date: string
  items: number
  total: number | string
  status: number
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('overview')
  const [checking, setChecking] = useState(true)
  const [needsPw, setNeedsPw] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState('')
  const [orders, setOrders] = useState<AdminOrder[]>(ADMIN_ORDERS)

  async function verify(password: string): Promise<boolean> {
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const d = await r.json()
      return Boolean(d.ok)
    } catch {
      return false
    }
  }

  async function loadOrders(password: string) {
    try {
      const r = await fetch('/api/admin/orders', {
        headers: password ? { 'x-admin-password': password } : {},
      })
      const d = await r.json()
      if (d.ok && Array.isArray(d.orders) && d.orders.length > 0) setOrders(d.orders)
    } catch {
      /* keep placeholder data */
    }
  }

  useEffect(() => {
    let cancelled = false
    async function init() {
      try {
        const r = await fetch('/api/admin/login')
        const d = await r.json()
        if (cancelled) return
        if (!d.protected) {
          setAuthed(true)
          loadOrders('')
          setChecking(false)
          return
        }
        const saved = sessionStorage.getItem('nx-admin-pw')
        if (saved && (await verify(saved))) {
          if (cancelled) return
          setAuthed(true)
          loadOrders(saved)
          setChecking(false)
          return
        }
        sessionStorage.removeItem('nx-admin-pw')
        setNeedsPw(true)
        setChecking(false)
      } catch {
        if (!cancelled) {
          setAuthed(true)
          setChecking(false)
        }
      }
    }
    init()
    return () => {
      cancelled = true
    }
  }, [])

  async function submitPw(e: React.FormEvent) {
    e.preventDefault()
    setPwError('')
    const ok = await verify(pw)
    if (ok) {
      sessionStorage.setItem('nx-admin-pw', pw)
      setAuthed(true)
      setNeedsPw(false)
      loadOrders(pw)
    } else {
      setPwError('Нууц үг буруу байна.')
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-900 text-paper-0" style={{ fontFamily: 'Rubik, sans-serif' }}>
        <div className="font-display font-black text-[22px] animate-pulse">🐾 Ачааллаж байна…</div>
      </div>
    )
  }

  if (needsPw && !authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-900 px-4" style={{ fontFamily: 'Rubik, sans-serif' }}>
        <form
          onSubmit={submitPw}
          className="w-full max-w-[380px] bg-paper-0 border-4 border-ink-900 rounded-xl shadow-hard-lg p-7"
        >
          <div className="font-display font-black text-[26px] text-ink-900 mb-1">🐾 Нөхөр Admin</div>
          <p className="text-[14px] text-ink-500 mb-5">Удирдлагын самбарт нэвтрэх нууц үгээ оруулна уу.</p>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Нууц үг"
            autoFocus
            aria-invalid={!!pwError}
            className="w-full h-[48px] px-4 font-body text-[15px] border-[2.5px] border-ink-900 rounded-md bg-paper-50 focus:outline-none focus:border-cobalt-600"
          />
          {pwError && <p className="text-brand-red text-[13px] font-semibold mt-2">{pwError}</p>}
          <button
            type="submit"
            className="nx-press w-full mt-4 h-[50px] font-bold text-[16px] border-[2.5px] border-ink-900 rounded-pill bg-cobalt-600 text-paper-0 cursor-pointer shadow-hard"
          >
            Нэвтрэх
          </button>
          <Link href="/" className="block text-center mt-4 text-[13px] text-ink-500 hover:text-cobalt-600 font-bold">
            ← Дэлгүүр рүү буцах
          </Link>
        </form>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-ink-900" style={{ fontFamily: 'Rubik, sans-serif' }}>
      {/* Sidebar */}
      <aside className="w-[64px] sm:w-[220px] shrink-0 flex flex-col border-r-[2.5px] border-ink-700 bg-ink-900">
        {/* Logo */}
        <div className="p-4 sm:p-5 border-b border-ink-700 text-center sm:text-left">
          <div className="font-display font-black text-[22px] text-paper-0" style={{ letterSpacing: '-0.02em' }}>
            🐾<span className="hidden sm:inline"> Нөхөр</span>
          </div>
          <div className="hidden sm:block font-mono text-[11px] text-ink-500 mt-0.5 uppercase tracking-[.1em]">Admin</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 flex flex-col gap-1" aria-label="Админ цэс">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              title={item.label}
              aria-label={item.label}
              aria-current={tab === item.key ? 'page' : undefined}
              className="relative flex items-center justify-center sm:justify-start gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer border-[2.5px] text-left transition-none"
              style={{
                background: tab === item.key ? '#ffc833' : 'transparent',
                color: tab === item.key ? '#15151b' : '#e6d8b9',
                borderColor: tab === item.key ? '#15151b' : 'transparent',
                boxShadow: tab === item.key ? '2px 2px 0 0 #15151b' : 'none',
                fontWeight: 700,
                fontSize: 14.5,
              }}
            >
              {item.icon}
              <span className="hidden sm:block flex-1">{item.label}</span>
              {item.badge && (
                <span className="font-mono text-[11px] font-bold bg-brand-red text-white rounded-pill px-1.5 py-0.5 border border-ink-900 absolute top-1 right-1 sm:static">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Back to store */}
        <div className="p-3 border-t border-ink-700">
          <Link
            href="/"
            title="Дэлгүүр рүү"
            className="flex items-center justify-center sm:justify-start gap-2 px-3.5 py-2.5 rounded-xl text-ink-300 hover:text-paper-0 transition-colors font-body font-bold text-[14px]"
          >
            <ArrowLeft size={18} weight="bold" />
            <span className="hidden sm:inline">Дэлгүүр рүү</span>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-paper-50">
        <div className="p-6 sm:p-8 max-w-[1100px]">
          <h1 className="font-display font-extrabold text-[28px] text-ink-900 mb-6" style={{ letterSpacing: '-0.02em' }}>
            {NAV_ITEMS.find((n) => n.key === tab)?.label}
          </h1>

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <div className="flex flex-col gap-6">
              {/* KPI tiles */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Өнөөдрийн зочид', value: '1,640', delta: '+12.4%', up: true, icon: <UsersThree weight="fill" size={24} />, accent: '#2536ce' },
                  { label: 'Нийт үзэлт', value: '17,910', delta: '+8.1%', up: true, icon: <Eye weight="fill" size={24} />, accent: '#ffc833' },
                  { label: 'Хөрвөлт', value: '3.2%', delta: '+0.6%', up: true, icon: <TrendUp weight="fill" size={24} />, accent: '#2f9457' },
                  { label: 'Өнөөдрийн орлого', value: fmt(4218000), delta: '-3.2%', up: false, icon: <Wallet weight="fill" size={24} />, accent: '#e24a31' },
                ].map((kpi) => (
                  <div key={kpi.label} className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[12px] text-ink-500 uppercase tracking-[.06em]">{kpi.label}</span>
                      <span style={{ color: kpi.accent }}>{kpi.icon}</span>
                    </div>
                    <div className="font-display font-extrabold text-[26px] text-ink-900 leading-none mb-1">{kpi.value}</div>
                    <div className={`font-mono text-[12px] font-bold flex items-center gap-1 ${kpi.up ? 'text-brand-green' : 'text-brand-red'}`}>
                      {kpi.up ? <TrendUp size={14} weight="bold" /> : <TrendDown size={14} weight="bold" />}
                      {kpi.delta} өнгөрсөн 7 хоногтой харьцуулахад
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart + Sources */}
              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
                {/* Bar chart */}
                <div className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard-sm p-5">
                  <h3 className="font-display font-extrabold text-[18px] text-ink-900 mb-4">7 хоногийн зочин</h3>
                  <div className="flex items-end gap-2 h-40">
                    {WEEK.map((w) => (
                      <div key={w.d} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex flex-col-reverse" style={{ height: '100%' }}>
                          <div
                            className="w-full rounded-t-sm border-[2.5px] border-ink-900 transition-all"
                            style={{
                              height: `${Math.round((w.v / WEEK_MAX) * 100)}%`,
                              background: w.d === 'Ня' ? '#ffc833' : '#2536ce',
                              minHeight: 8,
                            }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-ink-500">{w.d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Traffic sources */}
                <div className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard-sm p-5">
                  <h3 className="font-display font-extrabold text-[18px] text-ink-900 mb-4">Эх сурвалж</h3>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: 'Instagram', pct: 38, color: '#2536ce' },
                      { label: 'Шууд', pct: 24, color: '#15151b' },
                      { label: 'Google', pct: 18, color: '#ffc833' },
                      { label: 'Facebook', pct: 12, color: '#2f9457' },
                      { label: 'TikTok', pct: 8, color: '#e24a31' },
                    ].map((s) => (
                      <div key={s.label}>
                        <div className="flex justify-between font-mono text-[12px] text-ink-800 mb-1">
                          <span>{s.label}</span><span>{s.pct}%</span>
                        </div>
                        <div className="h-2 bg-paper-100 rounded-pill border border-ink-900 overflow-hidden">
                          <div className="h-full rounded-pill transition-all" style={{ width: `${s.pct}%`, background: s.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent activity */}
              <div className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard-sm p-5">
                <h3 className="font-display font-extrabold text-[18px] text-ink-900 mb-4">Хамгийн сүүлийн идэвх</h3>
                <div className="flex flex-col gap-3">
                  {[
                    { icon: <ShoppingBag size={18} weight="fill" />, tint: '#2536ce', text: `Шинэ захиалга #NX-204882 · ${fmt(64000)}`, time: 'саяхан' },
                    { icon: <Eye size={18} weight="fill" />, tint: '#ffc833', text: '"Зөөлөн муурны ор" 3 удаа үзэгдлээ', time: '2 мин' },
                    { icon: <UserPlus size={18} weight="fill" />, tint: '#2f9457', text: 'Шинэ хэрэглэгч бүртгүүлэв', time: '5 мин' },
                    { icon: <ShoppingBag size={18} weight="fill" />, tint: '#2536ce', text: `Шинэ захиалга #NX-204881 · ${fmt(118000)}`, time: '12 мин' },
                  ].map((ev, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-dashed border-paper-200 last:border-0">
                      <span className="w-8 h-8 rounded-md flex items-center justify-center text-white border-2 border-ink-900 shrink-0" style={{ background: ev.tint }}>
                        {ev.icon}
                      </span>
                      <span className="flex-1 text-[14px] text-ink-800">{ev.text}</span>
                      <span className="font-mono text-[11px] text-ink-500 shrink-0">{ev.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {tab === 'orders' && (
            <div className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[14px]">
                  <thead>
                    <tr className="border-b-[2.5px] border-ink-900 bg-paper-100">
                      {['Дугаар', 'Хэрэглэгч', 'Огноо', 'Бараа', 'Нийт', 'Статус'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 font-mono text-[12px] uppercase tracking-[.06em] text-ink-500">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id ?? o.no} className="border-b border-dashed border-paper-200 hover:bg-paper-50 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-ink-900">{o.no}</td>
                        <td className="px-4 py-3 font-bold text-ink-900">{o.cust}</td>
                        <td className="px-4 py-3 font-mono text-ink-500 text-[12px]">{o.date}</td>
                        <td className="px-4 py-3 text-ink-800">{o.items} бараа</td>
                        <td className="px-4 py-3 font-mono font-bold text-ink-900">{typeof o.total === 'number' ? fmt(o.total) : o.total}</td>
                        <td className="px-4 py-3">
                          <span className={`font-mono text-[11.5px] font-bold px-2.5 py-1 rounded-pill border-2 border-ink-900 ${STATUS_CHIP_STYLE[o.status]}`}>
                            {STATUS_LABELS[o.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── PRODUCTS ── */}
          {tab === 'products' && (
            <div className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[14px]">
                  <thead>
                    <tr className="border-b-[2.5px] border-ink-900 bg-paper-100">
                      {['Нэр', 'Үнэ', 'Нөөц', 'Статус'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 font-mono text-[12px] uppercase tracking-[.06em] text-ink-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PRODUCTS.map((p) => {
                      const stock = STOCK[p.id] ?? 20
                      const out = stock === 0
                      const low = stock > 0 && stock <= 10
                      return (
                        <tr key={p.id} className="border-b border-dashed border-paper-200 hover:bg-paper-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-bold text-ink-900">{p.name}</div>
                            <div className="font-mono text-[11px] text-ink-500">{p.category}</div>
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-ink-900">{fmt(p.price)}</td>
                          <td className="px-4 py-3">
                            <span className={`font-mono font-bold text-[14px] ${out ? 'text-brand-red' : low ? 'text-marigold-600' : 'text-ink-900'}`}>
                              {stock} ш
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`font-mono text-[11.5px] font-bold px-2.5 py-1 rounded-pill border-2 border-ink-900 ${
                              out
                                ? 'bg-brand-red-light text-brand-red'
                                : low
                                ? 'bg-marigold-200 text-ink-900'
                                : 'bg-brand-green-light text-brand-green'
                            }`}>
                              {out ? 'Дууссан' : low ? 'Бага үлдсэн' : 'Хангалттай'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── CUSTOMERS ── */}
          {tab === 'customers' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CUSTOMERS.map((c) => (
                <div key={c.name} className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard-sm p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 shrink-0 rounded-pill border-[2.5px] border-ink-900 bg-marigold-500 flex items-center justify-center font-display font-black text-ink-900">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-[15px] text-ink-900">{c.name}</div>
                      <div className="font-mono text-[11px] text-ink-500">{c.phone}</div>
                    </div>
                    <span className={`ml-auto font-mono text-[11.5px] font-bold px-2 py-0.5 rounded-pill border-2 border-ink-900 ${
                      c.tier === 'Алтан' ? 'bg-marigold-500 text-ink-900'
                        : c.tier === 'Мөнгөн' ? 'bg-paper-100 text-ink-800'
                        : c.tier === 'Хүрэл' ? 'bg-marigold-200 text-ink-900'
                        : 'bg-cobalt-100 text-cobalt-600'
                    }`}>
                      {c.tier}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-paper-50 rounded-sm p-2">
                      <div className="font-display font-extrabold text-[20px] text-ink-900">{c.orders}</div>
                      <div className="font-mono text-[11px] text-ink-500">захиалга</div>
                    </div>
                    <div className="bg-paper-50 rounded-sm p-2">
                      <div className="font-display font-extrabold text-[16px] text-ink-900">{fmt(c.spent)}</div>
                      <div className="font-mono text-[11px] text-ink-500">нийт зарлага</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── SETTINGS ── */}
          {tab === 'settings' && (
            <div className="max-w-[640px] flex flex-col gap-5">
              <div className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard p-5">
                <h3 className="font-display font-extrabold text-[18px] text-ink-900 mb-4">Дэлгүүрийн мэдээлэл</h3>
                <div className="flex flex-col gap-3">
                  {[
                    { label: 'Нэр', value: 'Нөхөр' },
                    { label: 'Утас', value: '7700-1234' },
                    { label: 'Имэйл', value: 'lhagvajavproo@gmail.com' },
                    { label: 'Хаяг', value: 'Улаанбаатар хот' },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="font-mono text-[12px] text-ink-500 uppercase tracking-[.06em]">{f.label}</label>
                      <input
                        defaultValue={f.value}
                        className="mt-1 w-full h-[42px] px-4 font-body text-[14px] border-[2.5px] border-ink-900 rounded-md bg-paper-50"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard p-5">
                <h3 className="font-display font-extrabold text-[18px] text-ink-900 mb-4">Хүргэлтийн тохиргоо</h3>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="font-mono text-[12px] text-ink-500 uppercase tracking-[.06em]">Үнэгүй хүргэлтийн доод дүн</label>
                    <input defaultValue="100000" type="number" className="mt-1 w-full h-[42px] px-4 font-mono font-bold text-[14px] border-[2.5px] border-ink-900 rounded-md bg-paper-50" />
                  </div>
                  <div>
                    <label className="font-mono text-[12px] text-ink-500 uppercase tracking-[.06em]">Хүргэлтийн үнэ</label>
                    <input defaultValue="5900" type="number" className="mt-1 w-full h-[42px] px-4 font-mono font-bold text-[14px] border-[2.5px] border-ink-900 rounded-md bg-paper-50" />
                  </div>
                </div>
              </div>

              <button className="nx-press h-12 px-6 self-start inline-flex items-center gap-2 font-bold text-[16px] border-[2.5px] border-ink-900 rounded-pill bg-cobalt-600 text-paper-0 shadow-hard cursor-pointer">
                Хадгалах
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
