'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  Gauge, Receipt, Package, Users, Gear, ArrowLeft,
  ShoppingBag, Wallet, UsersThree, ChartLineUp, Plus, Trash, Warning, X,
} from '@phosphor-icons/react'
import { PRODUCTS, PET_CATEGORIES, PRODUCT_TYPES, fmt, type Product } from '@/data/products'

type Tab = 'overview' | 'orders' | 'products' | 'customers' | 'settings'

const STATUS_LABELS = ['Захиалга өгсөн', 'Баталгаажсан', 'Бэлтгэж байна', 'Хүргэлтэд гарсан', 'Хүргэгдсэн']
const STATUS_CHIP_STYLE = [
  'bg-marigold-200 text-ink-900',
  'bg-cobalt-100 text-cobalt-600',
  'bg-paper-100 text-ink-800',
  'bg-cobalt-600 text-paper-0',
  'bg-brand-green-light text-brand-green',
]
const WEEKDAYS = ['Ня', 'Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя']

const NAV_ITEMS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'overview',  label: 'Самбар',       icon: <Gauge size={20} weight="fill" /> },
  { key: 'orders',    label: 'Захиалга',     icon: <Receipt size={20} weight="fill" /> },
  { key: 'products',  label: 'Бараа',        icon: <Package size={20} weight="fill" /> },
  { key: 'customers', label: 'Үйлчлүүлэгч',  icon: <Users size={20} weight="fill" /> },
  { key: 'settings',  label: 'Тохиргоо',     icon: <Gear size={20} weight="fill" /> },
]

type AdminOrder = {
  id?: string
  no: string
  cust: string
  phone?: string
  date: string
  items: number
  total: number | string
  status: number
}

const PET_ICON: Record<string, string> = { cat: 'Cat', dog: 'Dog', rabbit: 'Rabbit', fish: 'Fish', bird: 'Bird' }
const PET_EMOJI: Record<string, string> = { cat: '🐱', dog: '🐶', rabbit: '🐰', fish: '🐟', bird: '🐦' }

function parseTotal(t: number | string): number {
  if (typeof t === 'number') return t
  const n = Number(String(t).replace(/[^\d]/g, ''))
  return isNaN(n) ? 0 : n
}

function tierFor(spent: number): string {
  if (spent >= 1000000) return 'Алтан'
  if (spent >= 500000) return 'Мөнгөн'
  if (spent >= 100000) return 'Хүрэл'
  return 'Шинэ'
}

const emptyForm = { name: '', category: '', price: '', stock: '', pet: 'cat', type: 'food', desc: '' }

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('overview')
  const [checking, setChecking] = useState(true)
  const [needsPw, setNeedsPw] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [authPw, setAuthPw] = useState('')
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState('')

  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [products, setProducts] = useState<Product[]>(PRODUCTS)
  const [dbConfigured, setDbConfigured] = useState(true)

  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  function headers(extra: Record<string, string> = {}) {
    return authPw ? { 'x-admin-password': authPw, ...extra } : extra
  }

  async function verify(password: string): Promise<boolean> {
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      return Boolean((await r.json()).ok)
    } catch {
      return false
    }
  }

  async function loadOrders(password: string) {
    try {
      const r = await fetch('/api/admin/orders', { headers: password ? { 'x-admin-password': password } : {} })
      const d = await r.json()
      if (d.ok && Array.isArray(d.orders)) setOrders(d.orders)
    } catch { /* ignore */ }
  }

  async function loadProducts(password: string) {
    try {
      const r = await fetch('/api/admin/products', { headers: password ? { 'x-admin-password': password } : {} })
      const d = await r.json()
      if (d.ok && Array.isArray(d.products) && d.products.length > 0) {
        setProducts(d.products)
        setDbConfigured(d.configured !== false)
      } else {
        setDbConfigured(d.configured !== false)
      }
    } catch { /* keep fallback */ }
  }

  useEffect(() => {
    let cancelled = false
    async function init() {
      try {
        const r = await fetch('/api/admin/login')
        const d = await r.json()
        if (cancelled) return
        if (!d.protected) {
          setAuthed(true); setAuthPw(''); loadOrders(''); loadProducts(''); setChecking(false); return
        }
        const saved = sessionStorage.getItem('nx-admin-pw')
        if (saved && (await verify(saved))) {
          if (cancelled) return
          setAuthed(true); setAuthPw(saved); loadOrders(saved); loadProducts(saved); setChecking(false); return
        }
        sessionStorage.removeItem('nx-admin-pw')
        setNeedsPw(true); setChecking(false)
      } catch {
        if (!cancelled) { setAuthed(true); setChecking(false) }
      }
    }
    init()
    return () => { cancelled = true }
  }, [])

  async function submitPw(e: React.FormEvent) {
    e.preventDefault()
    setPwError('')
    if (await verify(pw)) {
      sessionStorage.setItem('nx-admin-pw', pw)
      setAuthed(true); setAuthPw(pw); setNeedsPw(false); loadOrders(pw); loadProducts(pw)
    } else {
      setPwError('Нууц үг буруу байна.')
    }
  }

  // ── Mutations ──
  async function updateOrderStatus(id: string | undefined, status: number) {
    if (!id) return
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)))
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ id, status }),
    }).catch(() => {})
  }

  async function updateProduct(id: string, fields: Partial<Product>) {
    setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, ...fields } : p)))
    await fetch('/api/admin/products', {
      method: 'PATCH',
      headers: headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ id, ...fields }),
    }).catch(() => {})
  }

  async function deleteProduct(id: string, name: string) {
    if (!confirm(`"${name}" барааг устгах уу?`)) return
    setProducts((ps) => ps.filter((p) => p.id !== id))
    await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: headers(),
    }).catch(() => {})
  }

  async function addProduct(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    const petCat = PET_CATEGORIES.find((c) => c.id === form.pet)
    const typeCat = PRODUCT_TYPES.find((t) => t.id === form.type)
    const body = {
      name: form.name.trim(),
      category: form.category.trim() || `${petCat?.label ?? ''} · ${typeCat?.label ?? ''}`,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      pet: form.pet,
      type: form.type,
      icon: PET_ICON[form.pet] ?? 'PawPrint',
      desc: form.desc.trim(),
    }
    await fetch('/api/admin/products', {
      method: 'POST',
      headers: headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body),
    }).catch(() => {})
    await loadProducts(authPw)
    setForm(emptyForm)
    setShowAdd(false)
    setSaving(false)
  }

  // ── Derived analytics ──
  const totalRevenue = useMemo(() => orders.reduce((s, o) => s + parseTotal(o.total), 0), [orders])
  const customers = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; orders: number; spent: number; pet: string }>()
    for (const o of orders) {
      const key = o.phone || o.cust || '—'
      const ex = map.get(key) || { name: o.cust || '—', phone: o.phone || '', orders: 0, spent: 0, pet: '🐾' }
      ex.orders += 1
      ex.spent += parseTotal(o.total)
      if (!ex.name) ex.name = o.cust
      map.set(key, ex)
    }
    return Array.from(map.values()).sort((a, b) => b.spent - a.spent)
  }, [orders])

  const week = useMemo(() => {
    const out: { d: string; v: number; today: boolean }[] = []
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const dt = new Date(now)
      dt.setDate(now.getDate() - i)
      const key = `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}.${String(dt.getDate()).padStart(2, '0')}`
      out.push({ d: WEEKDAYS[dt.getDay()], v: orders.filter((o) => o.date === key).length, today: i === 0 })
    }
    return out
  }, [orders])
  const weekMax = Math.max(1, ...week.map((w) => w.v))

  const statusCounts = useMemo(() => {
    const c = [0, 0, 0, 0, 0]
    orders.forEach((o) => { if (o.status >= 0 && o.status < 5) c[o.status]++ })
    return c
  }, [orders])

  const lowStock = useMemo(() => products.filter((p) => (p.stock ?? 0) <= 10).sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0)), [products])

  // ── Gates ──
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
        <form onSubmit={submitPw} className="w-full max-w-[380px] bg-paper-0 border-4 border-ink-900 rounded-xl shadow-hard-lg p-7">
          <div className="font-display font-black text-[26px] text-ink-900 mb-1">🐾 Нөхөр Admin</div>
          <p className="text-[14px] text-ink-500 mb-5">Удирдлагын самбарт нэвтрэх нууц үгээ оруулна уу.</p>
          <input
            type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Нууц үг" autoFocus
            aria-invalid={!!pwError}
            className="w-full h-[48px] px-4 font-body text-[15px] border-[2.5px] border-ink-900 rounded-md bg-paper-50 focus:outline-none focus:border-cobalt-600"
          />
          {pwError && <p className="text-brand-red text-[13px] font-semibold mt-2">{pwError}</p>}
          <button type="submit" className="nx-press w-full mt-4 h-[50px] font-bold text-[16px] border-[2.5px] border-ink-900 rounded-pill bg-cobalt-600 text-paper-0 cursor-pointer shadow-hard">
            Нэвтрэх
          </button>
          <Link href="/" className="block text-center mt-4 text-[13px] text-ink-500 hover:text-cobalt-600 font-bold">← Дэлгүүр рүү буцах</Link>
        </form>
      </div>
    )
  }

  const kpis = [
    { label: 'Нийт захиалга', value: String(orders.length), icon: <ShoppingBag weight="fill" size={24} />, accent: '#2536ce' },
    { label: 'Нийт орлого', value: fmt(totalRevenue), icon: <Wallet weight="fill" size={24} />, accent: '#2f9457' },
    { label: 'Үйлчлүүлэгч', value: String(customers.length), icon: <UsersThree weight="fill" size={24} />, accent: '#ffc833' },
    { label: 'Дундаж захиалга', value: fmt(orders.length ? Math.round(totalRevenue / orders.length) : 0), icon: <ChartLineUp weight="fill" size={24} />, accent: '#e24a31' },
  ]

  const fieldCls = 'h-[42px] px-3 font-body text-[14px] border-[2.5px] border-ink-900 rounded-md bg-paper-50 focus:outline-none focus:border-cobalt-600'

  return (
    <div className="flex min-h-screen bg-ink-900" style={{ fontFamily: 'Rubik, sans-serif' }}>
      {/* Sidebar */}
      <aside className="w-[64px] sm:w-[220px] shrink-0 flex flex-col border-r-[2.5px] border-ink-700 bg-ink-900">
        <div className="p-4 sm:p-5 border-b border-ink-700 text-center sm:text-left">
          <div className="font-display font-black text-[22px] text-paper-0" style={{ letterSpacing: '-0.02em' }}>
            🐾<span className="hidden sm:inline"> Нөхөр</span>
          </div>
          <div className="hidden sm:block font-mono text-[11px] text-ink-500 mt-0.5 uppercase tracking-[.1em]">Admin</div>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1" aria-label="Админ цэс">
          {NAV_ITEMS.map((item) => {
            const badge = item.key === 'orders' && statusCounts[0] > 0 ? String(statusCounts[0]) : undefined
            return (
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
                  fontWeight: 700, fontSize: 14.5,
                }}
              >
                {item.icon}
                <span className="hidden sm:block flex-1">{item.label}</span>
                {badge && (
                  <span className="font-mono text-[11px] font-bold bg-brand-red text-white rounded-pill px-1.5 py-0.5 border border-ink-900 absolute top-1 right-1 sm:static">
                    {badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="p-3 border-t border-ink-700">
          <Link href="/" title="Дэлгүүр рүү" className="flex items-center justify-center sm:justify-start gap-2 px-3.5 py-2.5 rounded-xl text-ink-300 hover:text-paper-0 transition-colors font-body font-bold text-[14px]">
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

          {!dbConfigured && (
            <div className="mb-6 flex items-center gap-2.5 bg-marigold-200 border-[2.5px] border-ink-900 rounded-md p-3.5 text-[14px] text-ink-900">
              <Warning weight="fill" size={20} className="text-marigold-600 shrink-0" />
              Demo горим — Firebase тохируулаагүй тул өөрчлөлт хадгалагдахгүй.
            </div>
          )}

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi) => (
                  <div key={kpi.label} className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[12px] text-ink-500 uppercase tracking-[.06em]">{kpi.label}</span>
                      <span style={{ color: kpi.accent }}>{kpi.icon}</span>
                    </div>
                    <div className="font-display font-extrabold text-[24px] text-ink-900 leading-none">{kpi.value}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
                {/* 7-day orders chart */}
                <div className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard-sm p-5">
                  <h3 className="font-display font-extrabold text-[18px] text-ink-900 mb-4">7 хоногийн захиалга</h3>
                  <div className="flex items-end gap-2 h-40">
                    {week.map((w, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="font-mono text-[11px] text-ink-500">{w.v}</span>
                        <div className="w-full flex flex-col-reverse" style={{ height: '100%' }}>
                          <div className="w-full rounded-t-sm border-[2.5px] border-ink-900 transition-all"
                            style={{ height: `${Math.round((w.v / weekMax) * 100)}%`, background: w.today ? '#ffc833' : '#2536ce', minHeight: 6 }} />
                        </div>
                        <span className="font-mono text-[11px] text-ink-500">{w.d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status breakdown */}
                <div className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard-sm p-5">
                  <h3 className="font-display font-extrabold text-[18px] text-ink-900 mb-4">Захиалгын статус</h3>
                  <div className="flex flex-col gap-3">
                    {STATUS_LABELS.map((label, i) => {
                      const pct = orders.length ? Math.round((statusCounts[i] / orders.length) * 100) : 0
                      return (
                        <div key={label}>
                          <div className="flex justify-between font-mono text-[12px] text-ink-800 mb-1">
                            <span>{label}</span><span>{statusCounts[i]}</span>
                          </div>
                          <div className="h-2 bg-paper-100 rounded-pill border border-ink-900 overflow-hidden">
                            <div className="h-full rounded-pill transition-all" style={{ width: `${pct}%`, background: ['#f5b115', '#2536ce', '#a8a39a', '#2536ce', '#2f9457'][i] }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Recent orders */}
              <div className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard-sm p-5">
                <h3 className="font-display font-extrabold text-[18px] text-ink-900 mb-4">Сүүлийн захиалга</h3>
                {orders.length === 0 ? (
                  <p className="text-[14px] text-ink-500 py-4 text-center">Одоогоор захиалга алга байна 🐾</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {orders.slice(0, 5).map((o) => (
                      <div key={o.id ?? o.no} className="flex items-center gap-3 py-2 border-b border-dashed border-paper-200 last:border-0">
                        <span className="w-8 h-8 rounded-md flex items-center justify-center text-white border-2 border-ink-900 shrink-0 bg-cobalt-600">
                          <ShoppingBag size={18} weight="fill" />
                        </span>
                        <span className="flex-1 text-[14px] text-ink-800"><b className="font-mono">{o.no}</b> · {o.cust}</span>
                        <span className="font-mono text-[13px] font-bold text-ink-900 shrink-0">{typeof o.total === 'number' ? fmt(o.total) : o.total}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Low stock */}
              {lowStock.length > 0 && (
                <div className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard-sm p-5">
                  <h3 className="font-display font-extrabold text-[18px] text-ink-900 mb-4 flex items-center gap-2">
                    <Warning weight="fill" size={20} className="text-marigold-600" /> Нөөц багатай бараа
                  </h3>
                  <div className="flex flex-col gap-2">
                    {lowStock.slice(0, 6).map((p) => (
                      <div key={p.id} className="flex items-center justify-between text-[14px] py-1.5 border-b border-dashed border-paper-200 last:border-0">
                        <span className="text-ink-800">{p.name}</span>
                        <span className={`font-mono font-bold ${(p.stock ?? 0) === 0 ? 'text-brand-red' : 'text-marigold-600'}`}>{p.stock ?? 0} ш</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── ORDERS ── */}
          {tab === 'orders' && (
            <div className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard overflow-hidden">
              {orders.length === 0 ? (
                <p className="text-[15px] text-ink-500 py-16 text-center">Одоогоор захиалга алга байна 🐾</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-[14px]">
                    <thead>
                      <tr className="border-b-[2.5px] border-ink-900 bg-paper-100">
                        {['Дугаар', 'Хэрэглэгч', 'Огноо', 'Бараа', 'Нийт', 'Статус'].map((h) => (
                          <th key={h} className="text-left px-4 py-3 font-mono text-[12px] uppercase tracking-[.06em] text-ink-500">{h}</th>
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
                            {o.id ? (
                              <select
                                value={o.status}
                                onChange={(e) => updateOrderStatus(o.id, Number(e.target.value))}
                                className={`font-mono text-[11.5px] font-bold px-2 py-1 rounded-pill border-2 border-ink-900 cursor-pointer ${STATUS_CHIP_STYLE[o.status]}`}
                              >
                                {STATUS_LABELS.map((l, i) => <option key={i} value={i}>{l}</option>)}
                              </select>
                            ) : (
                              <span className={`font-mono text-[11.5px] font-bold px-2.5 py-1 rounded-pill border-2 border-ink-900 ${STATUS_CHIP_STYLE[o.status]}`}>{STATUS_LABELS[o.status]}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── PRODUCTS ── */}
          {tab === 'products' && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[13px] text-ink-500">{products.length} бараа</p>
                <button
                  onClick={() => setShowAdd((s) => !s)}
                  className="nx-press inline-flex items-center gap-1.5 h-10 px-4 font-bold text-[14px] border-[2.5px] border-ink-900 rounded-pill bg-cobalt-600 text-paper-0 shadow-hard-sm cursor-pointer"
                >
                  {showAdd ? <X weight="bold" size={16} /> : <Plus weight="bold" size={16} />}
                  {showAdd ? 'Болих' : 'Бараа нэмэх'}
                </button>
              </div>

              {showAdd && (
                <form onSubmit={addProduct} className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard p-5 grid sm:grid-cols-2 gap-3">
                  <input className={fieldCls} placeholder="Барааны нэр *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <input className={fieldCls} placeholder="Ангилал (жишээ: Муур · Хоол)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                  <input className={fieldCls} type="number" placeholder="Үнэ (₮)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                  <input className={fieldCls} type="number" placeholder="Нөөц (ш)" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                  <select className={fieldCls} value={form.pet} onChange={(e) => setForm({ ...form, pet: e.target.value })}>
                    {PET_CATEGORIES.filter((c) => c.id !== 'all').map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                  <select className={fieldCls} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    {PRODUCT_TYPES.filter((t) => t.id !== 'all').map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                  <textarea className={`${fieldCls} h-auto py-2.5 sm:col-span-2 resize-none`} rows={2} placeholder="Тайлбар" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
                  <button type="submit" disabled={saving} className="nx-press sm:col-span-2 h-12 font-bold text-[15px] border-[2.5px] border-ink-900 rounded-pill bg-brand-green text-white shadow-hard cursor-pointer disabled:opacity-60">
                    {saving ? 'Хадгалж байна…' : 'Бараа хадгалах'}
                  </button>
                </form>
              )}

              <div className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-[14px]">
                    <thead>
                      <tr className="border-b-[2.5px] border-ink-900 bg-paper-100">
                        {['Нэр', 'Үнэ (₮)', 'Нөөц', 'Статус', ''].map((h) => (
                          <th key={h} className="text-left px-4 py-3 font-mono text-[12px] uppercase tracking-[.06em] text-ink-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => {
                        const stock = p.stock ?? 0
                        const out = stock === 0
                        const low = stock > 0 && stock <= 10
                        return (
                          <tr key={p.id} className="border-b border-dashed border-paper-200 hover:bg-paper-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="font-bold text-ink-900">{p.name}</div>
                              <div className="font-mono text-[11px] text-ink-500">{p.category}</div>
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number" defaultValue={p.price} key={`price-${p.id}-${p.price}`}
                                onBlur={(e) => { const v = Number(e.target.value); if (v !== p.price) updateProduct(p.id, { price: v }) }}
                                className="w-24 h-9 px-2 font-mono font-bold text-[13px] border-2 border-ink-900 rounded-sm bg-paper-50 focus:outline-none focus:border-cobalt-600"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number" defaultValue={stock} key={`stock-${p.id}-${stock}`}
                                onBlur={(e) => { const v = Number(e.target.value); if (v !== stock) updateProduct(p.id, { stock: v }) }}
                                className={`w-20 h-9 px-2 font-mono font-bold text-[13px] border-2 border-ink-900 rounded-sm bg-paper-50 focus:outline-none focus:border-cobalt-600 ${out ? 'text-brand-red' : low ? 'text-marigold-600' : 'text-ink-900'}`}
                              />
                            </td>
                            <td className="px-4 py-3">
                              <span className={`font-mono text-[11.5px] font-bold px-2.5 py-1 rounded-pill border-2 border-ink-900 ${out ? 'bg-brand-red-light text-brand-red' : low ? 'bg-marigold-200 text-ink-900' : 'bg-brand-green-light text-brand-green'}`}>
                                {out ? 'Дууссан' : low ? 'Бага үлдсэн' : 'Хангалттай'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <button onClick={() => deleteProduct(p.id, p.name)} aria-label="Устгах" className="text-ink-500 hover:text-brand-red transition-colors p-1">
                                <Trash weight="bold" size={18} />
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── CUSTOMERS ── */}
          {tab === 'customers' && (
            customers.length === 0 ? (
              <div className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard-sm p-12 text-center text-ink-500">
                <Users size={48} className="text-ink-300 mx-auto mb-3" />
                <p className="font-bold text-ink-900 mb-1">Үйлчлүүлэгч алга байна 🐾</p>
                <p className="text-[14px]">Захиалга ирэхэд үйлчлүүлэгчид энд харагдана.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {customers.map((c) => {
                  const tier = tierFor(c.spent)
                  return (
                    <div key={c.phone || c.name} className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard-sm p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 shrink-0 rounded-pill border-[2.5px] border-ink-900 bg-marigold-500 flex items-center justify-center font-display font-black text-ink-900">
                          {c.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-[15px] text-ink-900 truncate">{c.name}</div>
                          <div className="font-mono text-[11px] text-ink-500">{c.phone || '—'}</div>
                        </div>
                        <span className={`ml-auto font-mono text-[11.5px] font-bold px-2 py-0.5 rounded-pill border-2 border-ink-900 ${
                          tier === 'Алтан' ? 'bg-marigold-500 text-ink-900'
                            : tier === 'Мөнгөн' ? 'bg-paper-100 text-ink-800'
                            : tier === 'Хүрэл' ? 'bg-marigold-200 text-ink-900'
                            : 'bg-cobalt-100 text-cobalt-600'
                        }`}>{tier}</span>
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
                  )
                })}
              </div>
            )
          )}

          {/* ── SETTINGS ── */}
          {tab === 'settings' && (
            <div className="max-w-[640px] flex flex-col gap-5">
              <div className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard p-5">
                <h3 className="font-display font-extrabold text-[18px] text-ink-900 mb-2">Дэлгүүрийн мэдээлэл</h3>
                <p className="text-[13px] text-ink-500 mb-4">Эдгээр утгыг <code className="font-mono">data/products.ts</code> болон орчны хувьсагчаас тохируулна.</p>
                <div className="flex flex-col gap-3">
                  {[
                    { label: 'Нэр', value: 'Нөхөр' },
                    { label: 'Утас', value: '7700-1234' },
                    { label: 'Бараа', value: `${products.length} төрөл` },
                    { label: 'Захиалга', value: `${orders.length} нийт` },
                  ].map((f) => (
                    <div key={f.label} className="flex justify-between items-center border-b border-dashed border-paper-200 pb-2.5">
                      <span className="font-mono text-[12px] text-ink-500 uppercase tracking-[.06em]">{f.label}</span>
                      <span className="font-bold text-ink-900">{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-cobalt-600 border-[2.5px] border-ink-900 rounded-lg shadow-hard p-5 text-paper-0">
                <h3 className="font-display font-extrabold text-[18px] mb-1.5">Backend холбогдсон ✓</h3>
                <p className="text-[14px] text-cobalt-100">
                  Бараа, захиалга, үйлчлүүлэгч бүгд Firestore өгөгдлийн сангаас бодит цагийн горимоор ажиллаж байна.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
