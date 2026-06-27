import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebaseAdmin'

// Returns orders for a phone number — used by the logged-in account page.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const phone = String(body.phone || '').replace(/\D/g, '')
  if (phone.length < 6) {
    return NextResponse.json({ ok: false, error: 'phone required', orders: [] }, { status: 422 })
  }

  const db = getDb()
  if (!db) return NextResponse.json({ ok: true, orders: [] })

  try {
    // Equality only (no orderBy) so no composite index is needed; sort in memory.
    const snap = await db.collection('orders').get()
    const orders = snap.docs
      .map((d) => d.data())
      .filter((o) => String(o.phone || '').replace(/\D/g, '') === phone)
      .map((o) => ({
        no: o.no,
        date: o.date,
        items: o.items,
        total: o.total,
        status: typeof o.status === 'number' ? o.status : 0,
        createdAt: o.createdAt?._seconds ?? 0,
      }))
      .sort((a, b) => b.createdAt - a.createdAt)
    return NextResponse.json({ ok: true, orders })
  } catch (e) {
    console.error('[mine]', e)
    return NextResponse.json({ ok: false, orders: [] }, { status: 500 })
  }
}
