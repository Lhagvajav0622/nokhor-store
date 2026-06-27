import { NextResponse } from 'next/server'

// GET — tells the admin UI whether a password gate is active.
export async function GET() {
  return NextResponse.json({ protected: Boolean(process.env.ADMIN_PASSWORD) })
}

// POST — validates the admin password.
export async function POST(req: Request) {
  const expected = process.env.ADMIN_PASSWORD
  // No password configured → admin panel stays open (demo mode).
  if (!expected) return NextResponse.json({ ok: true, open: true })

  let password = ''
  try {
    const body = await req.json()
    password = typeof body?.password === 'string' ? body.password : ''
  } catch {
    /* ignore */
  }

  if (password && password === expected) {
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ ok: false, error: 'Нууц үг буруу байна.' }, { status: 401 })
}
