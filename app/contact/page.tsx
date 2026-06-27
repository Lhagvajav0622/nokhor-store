'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Phone,
  MapPin,
  Clock,
  PaperPlaneTilt,
  CheckCircle,
  WarningCircle,
  FacebookLogo,
  InstagramLogo,
  TiktokLogo,
} from '@phosphor-icons/react'

type Errors = { name?: string; contact?: string; message?: string }

const INFO = [
  { icon: Phone, title: 'Утас', lines: ['7700-1234', '9911-5678 (Viber)'] },
  { icon: MapPin, title: 'Хаяг', lines: ['Сүхбаатар дүүрэг, 1-р хороо', 'Чингисийн өргөн чөлөө, Улаанбаатар'] },
  { icon: Clock, title: 'Цагийн хуваарь', lines: ['Даваа–Баасан 10:00–20:00', 'Бямба–Ням 11:00–18:00'] },
]

export default function ContactPage() {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'ok' | 'fail'>('idle')

  function validate(): Errors {
    const e: Errors = {}
    if (name.trim().length < 2) e.name = 'Нэрээ оруулна уу.'
    if (contact.trim().length < 5) e.contact = 'Утас эсвэл имэйл хаягаа оруулна уу.'
    if (message.trim().length < 5) e.message = 'Зурвасаа дэлгэрэнгүй бичнэ үү.'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length > 0) return

    setLoading(true)
    setStatus('idle')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, subject, message }),
      })
      if (!res.ok) throw new Error('request failed')
      setStatus('ok')
      setName('')
      setContact('')
      setSubject('')
      setMessage('')
      setErrors({})
    } catch {
      setStatus('fail')
    } finally {
      setLoading(false)
    }
  }

  const fieldClass =
    'h-[46px] px-4 font-body text-[15px] border-[2.5px] border-ink-900 rounded-md bg-paper-50 focus:outline-none focus:border-cobalt-600'

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-body font-bold text-[15px] text-ink-900 mb-5 hover:text-cobalt-600 transition-colors"
      >
        <ArrowLeft weight="bold" size={18} />
        Нүүр
      </Link>

      <h1
        className="font-display font-extrabold text-[34px] text-ink-900 mb-2"
        style={{ letterSpacing: '-0.02em' }}
      >
        Холбоо барих
      </h1>
      <p className="text-[16px] text-ink-800 mb-8 max-w-[560px]">
        Асуулт, санал хүсэлт, хамтын ажиллагааны талаар бидэнтэй холбогдоорой. Бид ажлын
        өдрүүдэд 24 цагийн дотор хариу өгнө.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[.8fr_1fr] gap-7 items-start">
        {/* Info column */}
        <div className="flex flex-col gap-4">
          {INFO.map((c) => (
            <div
              key={c.title}
              className="bg-paper-0 border-[2.5px] border-ink-900 rounded-lg shadow-hard-sm p-5 flex gap-3.5"
            >
              <span className="shrink-0 w-11 h-11 rounded-md bg-cobalt-600 border-[2.5px] border-ink-900 flex items-center justify-center text-paper-0">
                <c.icon weight="fill" size={22} />
              </span>
              <div>
                <div className="font-extrabold text-ink-900 mb-1">{c.title}</div>
                {c.lines.map((l) => (
                  <div key={l} className="text-[14px] text-ink-800 leading-relaxed">
                    {l}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-marigold-200 border-[2.5px] border-ink-900 rounded-lg shadow-hard-sm p-5">
            <div className="font-extrabold text-ink-900 mb-2.5">Сошиал хаягууд</div>
            <div className="flex gap-3 text-ink-900 text-[26px]">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-cobalt-600 transition-colors">
                <FacebookLogo weight="fill" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-cobalt-600 transition-colors">
                <InstagramLogo weight="fill" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="hover:text-cobalt-600 transition-colors">
                <TiktokLogo weight="fill" />
              </a>
            </div>
          </div>
        </div>

        {/* Form column */}
        <div className="bg-paper-0 border-4 border-ink-900 rounded-xl shadow-hard-lg p-6">
          {status === 'ok' && (
            <div className="mb-5 flex items-start gap-2.5 bg-brand-green-light border-[2.5px] border-ink-900 rounded-md p-4 animate-pop">
              <CheckCircle weight="fill" size={22} className="text-brand-green shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-ink-900">Зурвас илгээгдлээ! 🐾</div>
                <div className="text-[14px] text-ink-800">Бид удахгүй тантай холбогдоно. Баярлалаа.</div>
              </div>
            </div>
          )}
          {status === 'fail' && (
            <div className="mb-5 flex items-start gap-2.5 bg-brand-red-light border-[2.5px] border-ink-900 rounded-md p-4">
              <WarningCircle weight="fill" size={22} className="text-brand-red shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-ink-900">Илгээхэд алдаа гарлаа</div>
                <div className="text-[14px] text-ink-800">Дахин оролдох эсвэл 7700-1234 руу залгана уу.</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="grid gap-3.5">
            <div className="grid gap-1.5">
              <label htmlFor="c-name" className="font-bold text-[14px] text-ink-900">Нэр *</label>
              <input
                id="c-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Таны нэр"
                aria-invalid={!!errors.name}
                className={fieldClass}
              />
              {errors.name && <span className="text-brand-red text-[13px] font-semibold">{errors.name}</span>}
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="c-contact" className="font-bold text-[14px] text-ink-900">Утас эсвэл имэйл *</label>
              <input
                id="c-contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="9911-5678 эсвэл name@mail.com"
                aria-invalid={!!errors.contact}
                className={fieldClass}
              />
              {errors.contact && <span className="text-brand-red text-[13px] font-semibold">{errors.contact}</span>}
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="c-subject" className="font-bold text-[14px] text-ink-900">Сэдэв</label>
              <input
                id="c-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Захиалга, буцаалт, хамтын ажиллагаа…"
                className={fieldClass}
              />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="c-message" className="font-bold text-[14px] text-ink-900">Зурвас *</label>
              <textarea
                id="c-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Бидэнд юу хэлэх вэ?"
                rows={5}
                aria-invalid={!!errors.message}
                className="px-4 py-3 font-body text-[15px] border-[2.5px] border-ink-900 rounded-md bg-paper-50 focus:outline-none focus:border-cobalt-600 resize-none"
              />
              {errors.message && <span className="text-brand-red text-[13px] font-semibold">{errors.message}</span>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="nx-press mt-1 h-14 flex items-center justify-center gap-2 font-bold text-[17px] border-[2.5px] border-ink-900 rounded-pill bg-cobalt-600 text-paper-0 cursor-pointer shadow-hard disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <PaperPlaneTilt weight="bold" size={20} />
              {loading ? 'Илгээж байна…' : 'Зурвас илгээх'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
