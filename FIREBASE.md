# Firebase Firestore тохиргоо — захиалга хадгалах

Энэ сайт нь захиалгыг **Firestore**-д хадгалж, `/admin` хуудсанд харуулдаг.
Firebase тохируулаагүй ч сайт хэвийн ажиллана — захиалга зөвхөн имэйл/console-д
бичигдэнэ. Доорх алхмуудыг хийснээр захиалга өгөгдлийн санд хадгалагдана.

## 1. Firebase төсөл үүсгэх
1. https://console.firebase.google.com → **Add project** → нэр өгнө (жишээ `nokhor-store`).
2. Google Analytics-ийг хүсвэл идэвхжүүлж болно (заавал биш).

## 2. Firestore идэвхжүүлэх
1. Зүүн цэс → **Build → Firestore Database** → **Create database**.
2. Байршил: `eur3` эсвэл ойрхон бүс сонгоно.
3. **Production mode**-оор эхлүүлнэ (дүрмийг бүгдийг хаасан байг — доор тайлбарласан).

## 3. Service account түлхүүр авах
1. ⚙️ → **Project settings → Service accounts**.
2. **Generate new private key** → JSON файл татагдана.
3. Энэ JSON-ийг **нэг мөр болгож** `FIREBASE_SERVICE_ACCOUNT` орчны хувьсагчид тавина.
   - `private_key` доторх жинхэнэ мөр таслалуудыг `\n` болгож үлдээнэ
   (татаж авсан JSON-д аль хэдийн `\n` хэлбэртэй байдаг).

`.env.local` (хөгжүүлэлт) эсвэл `.env.production` (сервер) дотор:
```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"nokhor-store",...}
ADMIN_PASSWORD=таны-нууц-үг
```

> 💡 JSON-д хашилт `"` олон байгаа тул бүхэлд нь нэг мөрөнд, өөрчлөлтгүй хуулна.

## 4. Admin нууц үг
- `ADMIN_PASSWORD` тохируулбал `/admin` хуудас нэвтрэх нууц үг асууна.
- Хоосон орхивол `/admin` нээлттэй demo горимоор ажиллана.
- **Зөвлөмж:** захиалгын мэдээлэл хувийн тул production дээр заавал нууц үг тавина уу.

## 5. Аюулгүй байдлын дүрэм (Firestore Rules)
Сервер нь **Admin SDK**-ээр хандах тул дүрмийг тойрдог. Тиймээс клиент талын
хандалтыг бүрэн хаах нь хамгийн аюулгүй. Firestore → Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;   // зөвхөн сервер (Admin SDK) хандана
    }
  }
}
```

## Хэрхэн ажилладаг
- Хэрэглэгч `/checkout` дээр захиалга өгөхөд → `app/api/order/route.ts` нь
  `orders` коллекцид баримт нэмнэ (+ имэйл явуулна).
- `/admin → Захиалга` таб нь `app/api/admin/orders` API-аар жинхэнэ захиалгуудыг
  татаж харуулна (нууц үгээр хамгаалагдсан).
- Захиалгуудыг Firebase console → Firestore → `orders`-оос ч шууд харж болно.

## Дараагийн алхам (сонголт)
- Барааг (`data/products.ts`) Firestore руу шилжүүлбэл код дахин deploy хийлгүйгээр
  бараа засах боломжтой болно. Хүсвэл нэмж хийж өгье.

---
© 2026 Нөхөр ХХК
