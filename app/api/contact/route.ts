import { NextResponse } from 'next/server'

type ContactPayload = {
  name: string
  contact: string
  subject?: string
  message: string
}

function isValid(b: Partial<ContactPayload>): b is ContactPayload {
  return Boolean(
    b &&
      typeof b.name === 'string' &&
      b.name.trim().length >= 2 &&
      typeof b.contact === 'string' &&
      b.contact.trim().length >= 5 &&
      typeof b.message === 'string' &&
      b.message.trim().length >= 5
  )
}

export async function POST(req: Request) {
  let body: Partial<ContactPayload>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 })
  }

  if (!isValid(body)) {
    return NextResponse.json(
      { ok: false, error: 'Мэдээллээ бүрэн бөглөнө үү.' },
      { status: 422 }
    )
  }

  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.ORDER_EMAIL || 'lhagvajavproo@gmail.com'

  if (!apiKey) {
    console.log('[Contact]', body)
    return NextResponse.json({ ok: true, note: 'no email key — logged to console' })
  }

  const html = `
    <h2 style="color:#2536ce">🐾 Шинэ хүсэлт — Нөхөр дэлгүүр</h2>
    <table border="0" cellpadding="8" cellspacing="0">
      <tr><th align="left">Нэр</th><td>${body.name}</td></tr>
      <tr><th align="left">Холбоо барих</th><td>${body.contact}</td></tr>
      ${body.subject ? `<tr><th align="left">Сэдэв</th><td>${body.subject}</td></tr>` : ''}
    </table>
    <h3>Зурвас</h3>
    <p style="white-space:pre-wrap">${body.message}</p>
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
        from: 'Нөхөр холбоо барих <onboarding@resend.dev>',
        to: [toEmail],
        subject: `🐾 Холбоо барих — ${body.name}`,
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[Resend error]', err)
      return NextResponse.json({ ok: false, error: 'Илгээхэд алдаа гарлаа.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Contact API]', err)
    return NextResponse.json({ ok: false, error: 'Сервер алдаа.' }, { status: 500 })
  }
}
