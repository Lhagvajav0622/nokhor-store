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
