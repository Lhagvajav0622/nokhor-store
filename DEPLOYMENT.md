# Нийтлэх заавар — Нөхөр Store (Datacom)

Энэ заавар нь сайтыг **Datacom**-ийн Линукс сервер (VPS / Cloud) дээр production-д
гаргахад зориулагдсан. Хоёр сонголт байна:

- **A хувилбар — PM2 + Nginx** (хамгийн энгийн, зөвлөж байна)
- **B хувилбар — Docker**

Домэйнаа дараа шийдэх тул бүх URL нь `NEXT_PUBLIC_SITE_URL` орчны хувьсагчаар
тохируулагддаг — домэйн бэлэн болмогц ганц газар солиход хангалттай.

---

## 0. Шаардлага
- Datacom дээр **Ubuntu 22.04+** VPS (1 vCPU / 1–2GB RAM хангалттай)
- **Node.js 20+** (22 зөвлөнө), `npm`
- Root буюу `sudo` эрх
- (Сонголт) Домэйн — Datacom-ийн DNS самбараас A бичлэг серверийн IP рүү заана

```bash
# Node 22 суулгах (nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 22 && nvm use 22
node -v   # v22.x
```

---

## A хувилбар — PM2 + Nginx (зөвлөмж)

### 1. Кодоо серверт байршуулах
```bash
# ZIP-ээ серверт хуулаад задлах, эсвэл git clone хийх
cd /var/www
# (ZIP задалсан бол) cd /var/www/nokhor-store
```

### 2. Орчны хувьсагч
```bash
cp .env.production.example .env.production
nano .env.production       # RESEND_API_KEY, ORDER_EMAIL, NEXT_PUBLIC_SITE_URL бөглөх
```

### 3. Суулгаж, build хийх
```bash
npm ci
npm run build
```

### 4. PM2-оор ажиллуулах
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save                    # дахин ачаалахад автоматаар асах
pm2 startup                 # гарсан командыг хуулж ажиллуулна
```
Сайт `http://127.0.0.1:3000` дээр ажиллана.

### 5. Nginx reverse proxy
```bash
sudo apt install -y nginx
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/nokhor
sudo nano /etc/nginx/sites-available/nokhor      # server_name-ийг домэйноор солих
sudo ln -s /etc/nginx/sites-available/nokhor /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 6. SSL (HTTPS) — Let's Encrypt
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d nokhor.mn -d www.nokhor.mn
```
Certbot нь гэрчилгээ суулгаж, HTTP→HTTPS чиглүүлэлтийг автоматаар нэмнэ.
`next.config.ts` доторх HSTS толгой энэ үеэс идэвхжинэ.

### 7. Шинэчлэх (дараа кодоо засвал)
```bash
git pull            # эсвэл шинэ ZIP задлах
npm ci
npm run build
pm2 reload nokhor-store
```

---

## B хувилбар — Docker

```bash
# 1. Орчны хувьсагч
cp .env.production.example .env.production && nano .env.production

# 2. Build + ажиллуулах
docker compose up -d --build

# 3. Лог харах
docker compose logs -f
```
Контейнер `:3000` порт дээр ажиллана — өмнө нь Nginx-ийг (A хувилбарын 5–6 алхам)
reverse proxy болгон тавьж HTTPS-ийг нэмнэ.

> Docker нь `output: "standalone"` бүтцийг ашигладаг тул дүрс маш жижиг
> (~150MB), node_modules-гүй.

---

## Домэйн холбох (дараа хийхэд)
1. Datacom-ийн DNS самбараас **A бичлэг** үүсгэж серверийн IP рүү заана
   (`@` болон `www`).
2. `.env.production` доторх `NEXT_PUBLIC_SITE_URL`-ийг жинхэнэ домэйнаар солино.
3. Nginx `server_name` болон certbot командын домэйныг шинэчилнэ.
4. `npm run build` дахин хийж `pm2 reload` (эсвэл `docker compose up -d --build`).

---

## Имэйл (захиалга / холбоо барих)
- [resend.com](https://resend.com) дээр бүртгүүлж API key авна (3,000 имэйл/сар үнэгүй).
- Жинхэнэ домэйнаа Resend дээр баталгаажуулсны дараа `from` хаягийг
  `app/api/order/route.ts`, `app/api/contact/route.ts` дотор өөрийн домэйн руу
  солих (одоо `onboarding@resend.dev` ашиглаж байгаа).
- API key байхгүй ч сайт ажиллана — захиалга/хүсэлт серверийн лог руу бичигдэнэ.

---

## Шалгах хяналтын жагсаалт
- [ ] `npm run build` алдаагүй (✓ 22 маршрут)
- [ ] `.env.production` бөглөгдсөн
- [ ] PM2 / Docker асаалттай, `:3000` хариу өгч байна
- [ ] Nginx reverse proxy + SSL ажиллаж байна
- [ ] Домэйн DNS заасан, `NEXT_PUBLIC_SITE_URL` тохирсон
- [ ] `https://домэйн/robots.txt`, `/sitemap.xml`, `/opengraph-image` ачаалагдана
- [ ] Захиалга/холбоо барих форм имэйл илгээж байна (Resend key-тэй бол)

© 2026 Нөхөр ХХК · Улаанбаатар
