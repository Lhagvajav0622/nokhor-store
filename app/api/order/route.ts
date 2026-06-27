import { NextResponse } from 'next/server'

type OrderItem = { name?: string; qty: number; price: string }

type OrderPayload = {
  orderNo: string
  name: string
  phone: string
  address: string
  note: string
  items: OrderItem[]
  total: string
}

export async function POST(req: Request) {
  const body: OrderPayload = await req.json()

  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.ORDER_EMAIL || 'lhagvajavproo@gmail.com'

  if (!apiKey) {
    console.log('[Order]', body)
    return NextResponse.json({ ok: true, note: 'no email key — logged to console' })
  }

  const itemsHtml = body.items
    .map((it) => `<tr><td>${it.name || 'Unknown'}</td><td>${it.qty} ш</td><td>${it.price}</td></tr>`)
    .join('')

  const html = `
    <h2 style="color:#2536ce">🐾 Шинэ захиалга — ${body.orderNo}</h2>
    <table border="0" cellpadding="8" cellspacing="0">
      <tr><th align="left">Нэр</th><td>${body.name}</td></tr>
      <tr><th align="left">Утас</th><td>${body.phone}</td></tr>
      <tr><th align="left">Хаяг</th><td>${body.address}</td></tr>
      ${body.note ? `<tr><th align="left">Тэмдэглэл</th><td>${body.note}</td></tr>` : ''}
    </table>
    <h3>Бараа</h3>
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse">
      <tr><th>Нэр</th><th>Тоо</th><th>Дүн</th></tr>
      ${itemsHtml}
    </table>
    <p><strong>Нийт: ${body.total}</strong></p>
    <p style="color:#6a6a78;font-size:12px">Нөхөр дэлгүүр · nokhor.mn</p>
  `

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Нөхөр захиалга <onboarding@resend.dev>',
        to: [toEmail],
        subject: `🐾 Захиалга ${body.orderNo} — ${body.name}`,
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[Resend error]', err)
      return NextResponse.json({ ok: false, error: err }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Order API]', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
