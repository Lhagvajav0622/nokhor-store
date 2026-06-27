import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Нөхөр — Улаанбаатарын амьтны дэлгүүр',
    short_name: 'Нөхөр',
    description:
      'Муур, нохой, туулай — бүгдэд хайртай хоол, тоглоом, дагалдах хэрэгсэл. Улаанбаатарт нэг өдрийн дотор хүргэнэ.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5edd9',
    theme_color: '#2536ce',
    lang: 'mn',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  }
}
