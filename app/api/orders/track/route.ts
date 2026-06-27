import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebaseAdmin'

// Guest order tracking — requires BOTH the order number and the phone used,
// so orders aren't enumerable by number alone.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const orderNo = String(body.orderNo || '').trim()
  const phone = String(body.phone || '').replace(/\D/g, '')

  if (!orderNo || phone.length < 6) {
    return NextResponse.json({ ok: false, error: 'Захиалгын дугаар болон утсаа оруулна уу.' }, { status: 422 })
  }

  const db = getDb()
  if (!db) return NextResponse.json({ ok: false, error: 'Систем тохируулагдаагүй байна.' }, { status: 503 })

  try {
    const snap = await db.collection('orders').where('no', '==', orderNo).limit(5).get()
    const doc = snap.docs.find((d) => String(d.data().phone || '').replace(/\D/g, '') === phone)
    if (!doc) {
      return NextResponse.json({ ok: false, error: 'Захиалга олдсонгүй. Дугаар/утсаа шалгана уу.' }, { status: 404 })
    }
    const o = doc.data()
    return NextResponse.json({
      ok: true,
      order: {
        no: o.no,
        cust: o.cust,
        date: o.date,
        items: o.items,
        lineItems: o.lineItems ?? [],
        total: o.total,
        status: typeof o.status === 'number' ? o.status : 0,
      },
    })
  } catch (e) {
    console.error('[track]', e)
    return NextResponse.json({ ok: false, error: 'Алдаа гарлаа.' }, { status: 500 })
  }
}
