import { ImageResponse } from 'next/og'

export const alt = 'Нөхөр — Улаанбаатарын амьтны дэлгүүр'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#f5edd9',
          padding: 64,
          fontFamily: 'sans-serif',
        }}
      >
        {/* Brand row */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: 24,
              background: '#2536ce',
              border: '5px solid #15151b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 54,
            }}
          >
            🐾
          </div>
          <div style={{ marginLeft: 24, fontSize: 56, fontWeight: 900, color: '#15151b' }}>
            Нөхөр
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 84, fontWeight: 900, color: '#15151b', lineHeight: 1.05 }}>
            Шинэ найзаа
          </div>
          <div style={{ fontSize: 84, fontWeight: 900, color: '#2536ce', lineHeight: 1.05 }}>
            сайхан хооллоё.
          </div>
          <div style={{ marginTop: 24, fontSize: 34, color: '#3a3a47' }}>
            Муур · Нохой · Туулай — Улаанбаатарт нэг өдрийн дотор хүргэнэ.
          </div>
        </div>

        {/* Footer chip */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              background: '#ffc833',
              border: '4px solid #15151b',
              borderRadius: 999,
              padding: '14px 30px',
              fontSize: 30,
              fontWeight: 800,
              color: '#15151b',
            }}
          >
            Нэг өдрийн дотор үнэгүй хүргэлт 🐾
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
