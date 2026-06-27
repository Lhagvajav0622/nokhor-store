import { getDb } from '@/lib/firebaseAdmin'
import { PRODUCTS, type Product } from '@/data/products'

// Server-side product access. Reads Firestore when configured; otherwise (or on
// any error / empty collection) falls back to the bundled static list so the
// store always renders.

export async function getProducts(): Promise<Product[]> {
  const db = getDb()
  if (!db) return PRODUCTS
  try {
    const snap = await db.collection('products').orderBy('order', 'asc').get()
    if (snap.empty) return PRODUCTS
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) })) as Product[]
  } catch (e) {
    console.error('[getProducts]', e)
    return PRODUCTS
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = getDb()
  if (!db) return PRODUCTS.find((p) => p.id === id) ?? null
  try {
    const doc = await db.collection('products').doc(id).get()
    if (!doc.exists) return PRODUCTS.find((p) => p.id === id) ?? null
    return { id: doc.id, ...(doc.data() as Record<string, unknown>) } as Product
  } catch {
    return PRODUCTS.find((p) => p.id === id) ?? null
  }
}
