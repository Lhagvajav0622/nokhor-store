import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebaseAdmin'
import { FieldValue } from 'firebase-admin/firestore'

function authed(req: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return true // open demo mode
  return req.headers.get('x-admin-password') === expected
}

const unauthorized = () => NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
const noDb = () => NextResponse.json({ ok: false, error: 'Firebase тохируулаагүй байна.' }, { status: 503 })

// List every product (including out-of-stock) for management.
export async function GET(req: Request) {
  if (!authed(req)) return unauthorized()
  const db = getDb()
  if (!db) return NextResponse.json({ ok: true, products: [], configured: false })
  try {
    const snap = await db.collection('products').orderBy('order', 'asc').get()
    const products = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    return NextResponse.json({ ok: true, products, configured: true })
  } catch (e) {
    console.error('[admin products GET]', e)
    return NextResponse.json({ ok: false, error: 'fetch failed', products: [] }, { status: 500 })
  }
}

// Create a product.
export async function POST(req: Request) {
  if (!authed(req)) return unauthorized()
  const db = getDb()
  if (!db) return noDb()
  const body = await req.json().catch(() => ({}))
  const stock = Number(body.stock) || 0
  const doc = {
    name: (body.name || 'Шинэ бараа').toString(),
    category: (body.category || '').toString(),
    price: Number(body.price) || 0,
    oldPrice: body.oldPrice ? Number(body.oldPrice) : null,
    rating: Number(body.rating) || 4.5,
    icon: (body.icon || 'PawPrint').toString(),
    pet: (body.pet || 'cat').toString(),
    type: (body.type || 'food').toString(),
    desc: (body.desc || '').toString(),
    stock,
    soldOut: stock === 0,
    badge: body.badge || null,
    order: Date.now(),
    createdAt: FieldValue.serverTimestamp(),
  }
  const ref = await db.collection('products').add(doc)
  return NextResponse.json({ ok: true, id: ref.id })
}

// Update fields of a product (id + any subset).
export async function PATCH(req: Request) {
  if (!authed(req)) return unauthorized()
  const db = getDb()
  if (!db) return noDb()
  const body = await req.json().catch(() => ({}))
  const { id, ...fields } = body
  if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 })

  if (fields.price !== undefined) fields.price = Number(fields.price)
  if (fields.rating !== undefined) fields.rating = Number(fields.rating)
  if (fields.oldPrice !== undefined) fields.oldPrice = fields.oldPrice ? Number(fields.oldPrice) : null
  if (fields.stock !== undefined) {
    fields.stock = Number(fields.stock)
    fields.soldOut = fields.stock === 0
  }
  await db.collection('products').doc(id).set(fields, { merge: true })
  return NextResponse.json({ ok: true })
}

// Delete a product (?id=...).
export async function DELETE(req: Request) {
  if (!authed(req)) return unauthorized()
  const db = getDb()
  if (!db) return noDb()
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 })
  await db.collection('products').doc(id).delete()
  return NextResponse.json({ ok: true })
}
