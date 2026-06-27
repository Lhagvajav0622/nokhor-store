import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebaseAdmin'
import { FieldValue } from 'firebase-admin/firestore'
import { PRODUCTS } from '@/data/products'

function authed(req: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return true
  return req.headers.get('x-admin-password') === expected
}

// One-time seed: copies the bundled product list into Firestore.
// Skips if products already exist (unless ?force=1).
export async function POST(req: Request) {
  if (!authed(req)) return NextResponse.json({ ok: false }, { status: 401 })
  const db = getDb()
  if (!db) return NextResponse.json({ ok: false, configured: false }, { status: 503 })

  const force = new URL(req.url).searchParams.get('force') === '1'
  const existing = await db.collection('products').limit(1).get()
  if (!existing.empty && !force) {
    return NextResponse.json({ ok: true, seeded: 0, note: 'already seeded' })
  }

  const batch = db.batch()
  PRODUCTS.forEach((p, i) => {
    const { id, ...rest } = p
    batch.set(db.collection('products').doc(id), {
      ...rest,
      order: i + 1,
      createdAt: FieldValue.serverTimestamp(),
    })
  })
  await batch.commit()
  return NextResponse.json({ ok: true, seeded: PRODUCTS.length })
}
