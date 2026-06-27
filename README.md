# Нөхөр Store — Улаанбаатарын амьтны дэлгүүр

Монголын амьтны тэжээл, дагалдах хэрэгсэл зардаг онлайн дэлгүүр.

**Stack:** Next.js 15 · App Router · Tailwind CSS · TypeScript · Zustand

> Хийгдсэн бүх ажлын дэлгэрэнгүйг [CHANGELOG.md](./CHANGELOG.md)-ээс үзнэ үү.
> Серверт нийтлэх (Datacom) заавар: [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## Хөгжүүлэлт

```bash
npm install
npm run dev
```

Хөтчийг `http://localhost:3000` хаягт нееж харна уу.

## Бүтэц

```
app/                   # Next.js App Router хуудаснууд
  page.tsx             # Нүүр хуудас
  products/            # Барааны жагсаалт + дэлгэрэнгүй
  checkout/            # Захиалах хуудас
  account/             # Профайл
  order/[id]/          # Захиалгын мэдээлэл
  wishlist/            # Дуртай бараа
  faq/                 # Түгээмэл асуулт
  about/               # Бидний тухай
  sale/                # Хямдрал
  loyalty/             # Урамшуулал
  contact/             # Холбоо барих (баталгаажуулалттай форм)
  admin/               # Удирдлагын самбар (/admin)
  api/order/           # Захиалгын имэйл илгээх API
  api/contact/         # Холбоо барих имэйл илгээх API
components/            # Дахин ашиглагдах бүрэлдэхүүн хэсгүүд
data/products.ts       # Барааны мэдээлэл (энд бараа нэм/засаарай)
lib/store.ts           # Cart + wishlist state (Zustand)
```

## Бараа нэмэх / засах

`data/products.ts` файлыг нээж `PRODUCTS` array-д бараа нэм эсвэл засаарай.

```ts
{
  id: 'p13',
  name: 'Шинэ бараа',
  category: 'Нохой · Хоол',
  price: 25000,
  rating: 4.5,
  icon: 'Dog',       // Cat | Dog | Rabbit | Fish | Bird
  pet: 'dog',
  type: 'food',
  desc: 'Барааны тайлбар',
  stock: 50,
}
```

## Имэйл тохиргоо (захиалгын мэдэгдэл)

1. [resend.com](https://resend.com) дээр бүртгүүлнэ (3,000 имэйл/сар үнэгүй)
2. API key аваад `.env.local` файлд хадгална:

```env
RESEND_API_KEY=re_xxxxxxxxxxxx
ORDER_EMAIL=lhagvajavproo@gmail.com
```

> API key байхгүй бол захиалга console-д логддог — имэйл явахгүй.

## QPay нэмэх (ирээдүйд)

`app/checkout/page.tsx` файлд "QPay coming soon" хэсгийг олж QPay SDK-тайгаа холбоно уу.

## Deploy — Vercel

```bash
# 1. GitHub push
git push -u origin main

# 2. vercel.com → New Project → GitHub repo → Import
# 3. Environment variables:
#    RESEND_API_KEY = таны Resend API key
#    ORDER_EMAIL    = lhagvajavproo@gmail.com
```

### Custom domain

Vercel Dashboard → Project → Settings → Domains → Add domain → DNS тохиргоог хийнэ.

## Удирдлагын самбар

`/admin` хаягт очно уу — захиалга, бараа, хэрэглэгч, аналитик.

---

© 2026 Нөхөр ХХК · Улаанбаатар
