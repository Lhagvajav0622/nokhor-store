import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebaseAdmin'

export async function GET(req: Request) {
  const expected = process.env.ADMIN_PASSWORD
  // When a password is set, require it. When not set, panel is open (demo).
  if (expected) {
    const pw = req.headers.get('x-admin-password')
    if (pw !== expected) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
    }
  }

  const db = getDb()
  if (!db) return NextResponse.json({ ok: true, orders: [], configured: false })

  try {
    const snap = await db.collection('orders').orderBy('createdAt', 'desc').limit(100).get()
    const orders = snap.docs.map((d) => {
      const o = d.data()
      return {
        id: d.id,
        no: o.no ?? '—',
        cust: o.cust ?? '—',
        phone: o.phone ?? '',
        date: o.date ?? '',
        items: o.items ?? 0,
        total: o.total ?? 0,
        status: typeof o.status === 'number' ? o.status : 0,
      }
    })
    return NextResponse.json({ ok: true, orders, configured: true })
  } catch (err) {
    console.error('[Admin orders]', err)
    return NextResponse.json({ ok: false, error: 'fetch failed', orders: [] }, { status: 500 })
  }
}

// Update an order's status: { id, status }
export async function PATCH(req: Request) {
  const expected = process.env.ADMIN_PASSWORD
  if (expected && req.headers.get('x-admin-password') !== expected) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }
  const db = getDb()
  if (!db) return NextResponse.json({ ok: false, error: 'not configured' }, { status: 503 })

  const body = await req.json().catch(() => ({}))
  const { id, status } = body
  if (!id || typeof status !== 'number') {
    return NextResponse.json({ ok: false, error: 'id and status required' }, { status: 400 })
  }
  await db.collection('orders').doc(id).set({ status }, { merge: true })
  return NextResponse.json({ ok: true })
}
