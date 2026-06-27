# Өөрчлөлтийн түүх — Нөхөр Store

Энэхүү баримт нь төслийг **production-ready** болгох явцад хийгдсэн бүх ажлыг тэмдэглэв.

Технологи: **Next.js 15.5 (App Router) · React 19 · TypeScript · Tailwind CSS 3 · Zustand**

---

## ✅ Энэ хувилбарт хийгдсэн ажлууд

### 1. Production build бүрэн ажиллана
- `npm run build` — **алдаа, анхааруулгагүйгээр** амжилттай гүйцэтгэгдэнэ (22 маршрут).
- TypeScript, ESLint болон төрлийн шалгалт бүгд цэвэр.
- `next.config.ts` цэгцэлсэн (`poweredByHeader: false`, `compress: true`), хуучирсан `experimental.typedRoutes` тохиргоог арилгасан.

### 2. Аюулгүй байдал
- **Next.js-ийг 15.3.3 → 15.5.x** руу шинэчилж, мэдэгдсэн эмзэг байдлыг (CVE-2025-66478) арилгасан.
- `postcss`-ийг патч хийсэн хувилбар (≥8.5.10) руу `overrides`-аар тогтоож, Next-ийн дотоод хамаарлыг хүртэл засварласан.
- **`npm audit` → 0 эмзэг байдал** (critical/moderate бүгд цэвэр).

### 3. SEO ба Metadata
- Root `layout.tsx`-д `metadataBase`, гарчгийн template (`%s · Нөхөр`), Open Graph, Twitter Card, robots, keywords, `viewport` (themeColor) нэмсэн.
- **Хуудас бүрд тусгай metadata** (гарчиг, тайлбар, canonical):
  - `/about`, `/loyalty` — server component дотор шууд.
  - `/products`, `/sale`, `/faq`, `/wishlist`, `/checkout`, `/account`, `/contact` — `layout.tsx`-аар.
  - `/products/[id]` — бараа тус бүрийн нэр, үнэ, тайлбараар **динамик `generateMetadata`**.
- Хувийн хуудсуудыг (`/checkout`, `/account`, `/wishlist`, `/order/*`) `robots: noindex`-ээр хамгаалсан.
- **`sitemap.xml`** (бүх бараа + үндсэн хуудас) болон **`robots.txt`** автоматаар үүсгэгдэнэ.

### 4. Favicon, icon, Open Graph зураг
- `app/icon.svg` — брэндийн өнгөтэй сарвууны favicon.
- `app/apple-icon.svg` — iOS-д зориулсан icon.
- `app/opengraph-image.tsx` + `app/twitter-image.tsx` — `next/og`-оор **динамик 1200×630 OG зураг** (брэнд, гарчиг, уриа).
- `app/manifest.ts` — PWA web manifest (нэр, өнгө, icon).

### 5. Loading ба Error төлөвүүд
- `app/loading.tsx` — брэндийн skeleton (hero + барааны тор).
- `app/products/[id]/loading.tsx` — барааны дэлгэрэнгүй хуудасны тусгай skeleton.
- `app/error.tsx` — алдааны хязгаар, "Дахин оролдох" / "Нүүр хуудас" товчтой.
- `app/global-error.tsx` — root layout-ийн алдааг барих fallback.

### 6. Холбоо барих (Contact) — шинэ боломж
- `app/contact/page.tsx` — холбоо барих мэдээлэл (утас, хаяг, цаг, сошиал) + **баталгаажуулалттай форм**.
- Талбар тус бүрийн алдааны мессеж, амжилт/алдааны мэдэгдэл, ачааллах төлөв.
- `app/api/contact/route.ts` — серверийн талын баталгаажуулалт; Resend-ээр имэйл, эсвэл console-д лог.
- Footer-ийн "Холбоо барих" холбоосыг `/faq` → `/contact` болгож зассан.

### 7. Форм баталгаажуулалт ба мэдэгдлүүд
- **Checkout** — нэр (≥2 тэмдэгт), **утас (яг 8 орон)**, хаяг (≥6 тэмдэгт) баталгаажуулалт; тодорхой алдааны мессеж.
- **Newsletter (footer)** — имэйл хэлбэрийн шалгалт + амжилт/алдааны мэдэгдэл.
- **Contact** — клиент болон сервер талын давхар баталгаажуулалт.

### 8. Responsive ба mobile UX
- **Админ самбар** — мобайл дээр sidebar нь зөвхөн icon-той нарийн самбар болж хураагдана (`w-[64px] sm:w-[220px]`), tooltip/aria-label-тай.
- Админ хүснэгтүүд `overflow-x-auto`-той, үйлчлүүлэгчийн картууд responsive grid.
- Бусад бүх хуудас (нүүр, бараа, сагс, төлбөр, профайл) аль хэдийн mobile-first grid-тэй болохыг шалгасан.

### 9. Гүйцэтгэл ба зураг
- UI нь raster зураг бус **вектор icon (Phosphor) + SVG**-д суурилсан тул хурдан ачаалагдана.
- OG зургийг build үед статикаар үүсгэснээр сервер ачаалал багатай.
- `compress`, `poweredByHeader: false` тохиргоо.

### 10. Production нийтлэлд бэлдсэн (Datacom)
- `next.config.ts` — **`output: "standalone"`** (зөөврийн серверийн bundle) + **аюулгүй байдлын HTTP толгойнууд** (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy). `X-Powered-By` устгасан.
- **Docker:** `Dockerfile` (multi-stage, ~150MB), `.dockerignore`, `docker-compose.yml`.
- **VPS (PM2):** `ecosystem.config.js`, `deploy/nginx.conf.example` (reverse proxy + кэш).
- **Node хувилбар тогтоосон:** `engines: node >=20` + `.nvmrc` (22).
- **`.env.production.example`** болон шинэчилсэн `.gitignore` (бодит key-г commit хийхээс хамгаална).
- **`DEPLOYMENT.md`** — Datacom Линукс серверт нийтлэх бүрэн заавар (PM2+Nginx эсвэл Docker, SSL, DNS, домэйн холболт).
- Домэйнгүй ч ажиллахаар бүх URL-ийг `NEXT_PUBLIC_SITE_URL`-ээр тохируулсан — домэйн бэлэн болмогц ганц газар солино.
- Шалгасан: production server `200` хариу, бүх аюулгүйн толгой идэвхтэй, standalone `server.js` үүснэ.

### 11. Firebase Firestore — захиалга хадгалах
- **`firebase-admin`** нэмж, `lib/firebaseAdmin.ts`-аар Firestore-ийг lazy эхлүүлэв
  (тохируулаагүй бол graceful no-op — сайт хэвийн ажиллана).
- `app/api/order/route.ts` — захиалга өгөхөд `orders` коллекцид хадгална (+ имэйл).
- `app/api/admin/orders` ба `app/api/admin/login` — нууц үгээр хамгаалагдсан API.
- **Admin самбар нууц үгийн хамгаалалттай** боллоо (`ADMIN_PASSWORD` тохируулбал);
  захиалгын табд **жинхэнэ захиалгуудыг** Firestore-оос татаж харуулна, байхгүй бол
  demo өгөгдөл. Session-д нэвтрэлт хадгалагдана.
- **`FIREBASE.md`** — Firebase console тохиргооны бүрэн заавар + аюулгүйн дүрэм.
- `uuid`-ийн эмзэг хамаарлыг `overrides`-аар засаж → **дахин 0 эмзэг байдал**.

---

## 📁 Шинээр нэмэгдсэн файлууд
```
app/icon.svg
app/apple-icon.svg
app/opengraph-image.tsx
app/twitter-image.tsx
app/manifest.ts
app/robots.ts
app/sitemap.ts
app/loading.tsx
app/error.tsx
app/global-error.tsx
app/contact/page.tsx
app/contact/layout.tsx
app/api/contact/route.ts
app/products/layout.tsx
app/products/[id]/layout.tsx
app/products/[id]/loading.tsx
app/checkout/layout.tsx
app/account/layout.tsx
app/wishlist/layout.tsx
app/faq/layout.tsx
app/sale/layout.tsx
app/order/[id]/layout.tsx
CHANGELOG.md
```

## 🔧 Засварласан файлууд
```
app/layout.tsx          — өргөтгөсөн metadata + viewport
app/about/page.tsx      — metadata
app/loyalty/page.tsx    — metadata
app/checkout/page.tsx   — сайжруулсан баталгаажуулалт
app/admin/page.tsx      — responsive sidebar
components/Footer.tsx   — contact холбоос + newsletter баталгаажуулалт
next.config.ts          — цэгцэлсэн тохиргоо
.env.example            — NEXT_PUBLIC_SITE_URL нэмсэн
package.json            — Next.js шинэчлэлт
```

---

## 🚀 Ажиллуулах
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # production server
```

## ⚙️ Орчны хувьсагч (заавал биш)
`.env.example`-ийг `.env.local` болгож хуулна:
```env
RESEND_API_KEY=re_xxxxxxxxxxxx      # имэйл мэдэгдэл (байхгүй бол console-д логдоно)
ORDER_EMAIL=name@example.com         # захиалга/хүсэлт хүлээн авах хаяг
NEXT_PUBLIC_SITE_URL=https://nokhor.mn
```

## ✏️ Бараа засах
`data/products.ts` доторх `PRODUCTS` массивыг засна. Бусад бүх хуудас автоматаар шинэчлэгдэнэ.

---

© 2026 Нөхөр ХХК · Улаанбаатар
