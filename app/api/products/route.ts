import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/products'

export const dynamic = 'force-dynamic'

// Public — the storefront reads the live product list from here.
export async function GET() {
  const products = await getProducts()
  return NextResponse.json({ products })
}
