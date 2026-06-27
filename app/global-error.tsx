'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="mn">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5edd9',
          color: '#15151b',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: 24,
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 900, color: '#e24a31' }}>Алдаа</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: '8px 0' }}>
          Ямар нэг зүйл буруудлаа
        </h1>
        <p style={{ maxWidth: 380, lineHeight: 1.6, color: '#3a3a47' }}>
          Уучлаарай, системд алдаа гарлаа. Дахин оролдоно уу.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: 16,
            height: 52,
            padding: '0 28px',
            fontSize: 17,
            fontWeight: 700,
            border: '2.5px solid #15151b',
            borderRadius: 999,
            background: '#2536ce',
            color: '#fbf6ea',
            cursor: 'pointer',
          }}
        >
          Дахин оролдох
        </button>
      </body>
    </html>
  )
}
