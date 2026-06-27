export type BadgeVariant = 'sale' | 'new' | 'accent'

export type Badge = {
  label: string
  variant: BadgeVariant
}

export type Product = {
  id: string
  name: string
  category: string
  price: number
  oldPrice?: number
  rating: number
  icon: string
  pet: 'cat' | 'dog' | 'rabbit' | 'fish' | 'bird'
  type: 'food' | 'toy' | 'accessory' | 'grooming' | 'clothing'
  badge?: Badge
  soldOut?: boolean
  desc: string
  stock: number
}

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Royal Canin муурны хоол 2кг',
    category: 'Муур · Хуурай хоол',
    price: 48000,
    oldPrice: 62000,
    rating: 4.8,
    icon: 'Cat',
    pet: 'cat',
    type: 'food',
    badge: { label: 'Хямдрал', variant: 'sale' },
    desc: 'Насанд хүрсэн муурт зориулсан өндөр чанартай хуурай хоол. Дархлааг дэмжих амин дэм, тэнцвэртэй шим тэжээл. Дэлхийн нэртэй брэнд.',
    stock: 34,
  },
  {
    id: 'p2',
    name: 'Нохойн зөөлөн бөмбөг',
    category: 'Нохой · Тоглоом',
    price: 12500,
    rating: 4.6,
    icon: 'Dog',
    pet: 'dog',
    type: 'toy',
    badge: { label: 'Шинэ', variant: 'new' },
    desc: 'Байгалийн каучукаар хийсэн аюулгүй, хэсэгчилсэн зөөлөн бөмбөг. Нохойн шүдний эрүүл мэндэд тустай.',
    stock: 128,
  },
  {
    id: 'p3',
    name: 'Муурны маажих байшин',
    category: 'Муур · Тавилга',
    price: 135000,
    oldPrice: 160000,
    rating: 4.7,
    icon: 'Cat',
    pet: 'cat',
    type: 'accessory',
    badge: { label: 'Хямдрал', variant: 'sale' },
    desc: 'Сизалын ширхэгтэй маажих баганатай, тухтай хэвтэлтэй муурны байшин. Муурны оролтыг хөнгөвчлөх, хумсны эрүүл мэндийг дэмжинэ.',
    stock: 9,
  },
  {
    id: 'p4',
    name: 'Нохойн оосор + хүзүүвч',
    category: 'Нохой · Дагалдах',
    price: 34000,
    rating: 4.5,
    icon: 'Dog',
    pet: 'dog',
    type: 'accessory',
    desc: 'Бат бэх нейлон материалаар хийсэн тохируулгатай хүзүүвч. 2 метр урт оосортой бүрэн иж бүрдэл.',
    stock: 52,
  },
  {
    id: 'p5',
    name: 'Муурны элс 10л',
    category: 'Муур · Эрүүл ахуй',
    price: 22000,
    rating: 4.8,
    icon: 'Cat',
    pet: 'cat',
    type: 'grooming',
    badge: { label: 'Шинэ', variant: 'new' },
    desc: 'Үнэр шингэдэг байгалийн бентонит элс. Бөөнд хоорогддог, тоос багатай, хялбар цэвэрлэгдэх.',
    stock: 6,
  },
  {
    id: 'p6',
    name: 'Туулайн өвс 1кг',
    category: 'Туулай · Хоол',
    price: 9500,
    rating: 4.3,
    icon: 'Rabbit',
    pet: 'rabbit',
    type: 'food',
    desc: 'Тимоти өвсний хуурай дарга. Туулайн гэдэс бүлэгний хөдөлгөөнийг дэмжиж, эрүүл мэндийг сайжруулна.',
    soldOut: true,
    stock: 0,
  },
  {
    id: 'p7',
    name: 'Нохойн дулаан хүрэм',
    category: 'Нохой · Хувцас',
    price: 45000,
    rating: 4.6,
    icon: 'Dog',
    pet: 'dog',
    type: 'clothing',
    badge: { label: 'Шинэ', variant: 'new' },
    desc: 'Өвлийн улиралд зориулсан дотор давхартай дулаан хүрэм. S/M/L/XL хэмжээтэй, 3 өнгөтэй.',
    stock: 21,
  },
  {
    id: 'p8',
    name: 'Муурны шампунь 250мл',
    category: 'Муур · Арчилгаа',
    price: 18500,
    rating: 4.4,
    icon: 'Cat',
    pet: 'cat',
    type: 'grooming',
    desc: 'Байгалийн бүрэлдэхүүн бүхий эмэг хоргүй шампунь. Үс гялгар, арьс чийгшилттэй болно. Дотоодын үйлдвэрлэл.',
    stock: 74,
  },
  {
    id: 'p9',
    name: 'Нохойн ясан тоглоом',
    category: 'Нохой · Тоглоом',
    price: 15000,
    rating: 4.5,
    icon: 'Dog',
    pet: 'dog',
    type: 'toy',
    desc: 'Хатуу каучукаар хийсэн ясны хэлбэртэй тоглоом. Нохойн шүдний өвчин эмгэгийг бууруулж, өвлийн цагийг тэлнэ.',
    stock: 46,
  },
  {
    id: 'p10',
    name: 'Зөөлөн муурны ор',
    category: 'Муур · Тавилга',
    price: 78000,
    oldPrice: 95000,
    rating: 4.9,
    icon: 'Cat',
    pet: 'cat',
    type: 'accessory',
    badge: { label: 'Бестселлер', variant: 'accent' },
    desc: 'Өөдтэй нимгэн хөвөнтэй, дугуй хэлбэртэй муурны ор. Угаах боломжтой бүрхүүлтэй. 50, 60, 70см диаметртэй.',
    stock: 12,
  },
  {
    id: 'p11',
    name: 'Шишүүхэйн тэжээл 800г',
    category: 'Туулай · Хоол',
    price: 14000,
    rating: 4.2,
    icon: 'Rabbit',
    pet: 'rabbit',
    type: 'food',
    desc: 'Шишүүхэй, гоффер болон жижиг мэрэгчдэд зориулсан иж бүрэн тэжээл. Витамин, эрдэс бодисоор баялаг.',
    stock: 88,
  },
  {
    id: 'p12',
    name: 'Нохойн хумс хайчлуур',
    category: 'Нохой · Арчилгаа',
    price: 11000,
    rating: 4.4,
    icon: 'Dog',
    pet: 'dog',
    type: 'grooming',
    desc: 'Аюулгүй хавчаар бүхий мэргэжлийн хумс хайчлуур. Хурц ган хутга, эвтэйхэн бариул. Муур нохой хоёулд тохиромжтой.',
    stock: 3,
  },
]

export type PetCategory = {
  id: string
  label: string
  icon: string
  bg: string
  fg: string
}

export const PET_CATEGORIES: PetCategory[] = [
  { id: 'all',    label: 'Бүгд',         icon: 'PawPrint', bg: '#15151b',    fg: '#fbf6ea' },
  { id: 'cat',    label: 'Муур',         icon: 'Cat',      bg: '#2536ce',    fg: '#fbf6ea' },
  { id: 'dog',    label: 'Нохой',        icon: 'Dog',      bg: '#ffc833',    fg: '#15151b' },
  { id: 'rabbit', label: 'Жижиг амьтан', icon: 'Rabbit',   bg: '#ef9f63',    fg: '#15151b' },
  { id: 'fish',   label: 'Загас',        icon: 'Fish',     bg: '#9aa6ef',    fg: '#15151b' },
  { id: 'bird',   label: 'Шувуу',        icon: 'Bird',     bg: '#2f9457',    fg: '#fbf6ea' },
]

export type ProductType = { id: string; label: string }

export const PRODUCT_TYPES: ProductType[] = [
  { id: 'all',       label: 'Бүх төрөл' },
  { id: 'food',      label: 'Хоол' },
  { id: 'toy',       label: 'Тоглоом' },
  { id: 'accessory', label: 'Дагалдах' },
  { id: 'grooming',  label: 'Арчилгаа' },
  { id: 'clothing',  label: 'Хувцас' },
]

export const REVIEWS = [
  { name: 'Оюунаа Г.', rating: 5, date: '2026.06.20', text: 'Маш чанартай, муур маань үнэхээр дуртай байна. Нэг өдрийн дотор хүргэж өгсөн, баярлалаа!' },
  { name: 'Бат-Эрдэнэ Д.', rating: 4, date: '2026.06.15', text: 'Үнэ боломжийн, сав баглаа боодол сайхан. Дахин захиална.' },
  { name: 'Сараа Б.', rating: 5, date: '2026.06.10', text: 'Банкны шилжүүлгээр хялбар төлсөн. Үйлчилгээ найрсаг, амьтанд ээлтэй дэлгүүр.' },
]

export const FAQS = [
  { q: 'Хүргэлт хэр хугацаанд хийгддэг вэ?', a: 'Улаанбаатар хотод 24 цагийн дотор, орон нутагт 2–4 хоногт хүргэнэ. ₮100,000-аас дээш захиалгад хүргэлт үнэгүй.' },
  { q: 'Төлбөрийг хэрхэн хийх вэ?', a: 'Одоогоор банкны шилжүүлгийг дэмжиж байна. Захиалга баталгаажсаны дараа банкны данс руу шилжүүлэн, гүйлгээний утасны зургийг илгээнэ үү. QPay холболт тун удахгүй нэмэгдэнэ.' },
  { q: 'Барааг буцаах боломжтой юу?', a: 'Задлаагүй барааг 14 хоногийн дотор буцаах эсвэл солих боломжтой. Хоол, эрүүл ахуйн зарим бараанд хязгаарлалт үйлчилнэ.' },
  { q: 'Гишүүнчлэл ямар давуу талтай вэ?', a: 'Худалдан авалт бүрт оноо цуглуулж, дараагийн захиалгадаа хямдрал эдэлнэ. Гишүүдэд онцгой урамшуулал зарладаг.' },
  { q: 'Захиалгаа хэрхэн хянах вэ?', a: 'Профайл → Миний захиалга хэсгээс захиалгынхаа явцыг хянах боломжтой. Мөн утсаар 7700-1234 дугаарт залгаж тодруулах боломжтой.' },
]

export const BANKS = [
  { name: 'Хаан банк',   account: '5000112233', bg: '#0a7d3c' },
  { name: 'Голомт',      account: '1234567890', bg: '#e2231a' },
  { name: 'Хас банк',    account: '3456789012', bg: '#00a0af' },
  { name: 'Төрийн банк', account: '7890123456', bg: '#1a4f9c' },
  { name: 'TDB',         account: '2345678901', bg: '#003a70' },
]

export function fmt(n: number): string {
  return '₮' + Number(n).toLocaleString('mn-MN').replace(/,/g, ' ')
}
