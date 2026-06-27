'use client'

import { useRouter } from 'next/navigation'
import { X, ShoppingCart, ShoppingBag, Minus, Plus, Trash } from '@phosphor-icons/react'
import { useStore, cartTotal, cartCount } from '@/lib/store'
import { PRODUCTS, fmt } from '@/data/products'
import ProductIcon from './ProductIcon'

export default function CartDrawer() {
  const router = useRouter()
  const { cart, cartOpen, closeCart, setQty, removeFromCart } = useStore()

  const subtotal = cartTotal(cart, PRODUCTS)
  const FREE_SHIP = 100000
  const shipping = subtotal >= FREE_SHIP || subtotal === 0 ? 0 : 5900
  const total = subtotal + shipping
  const count = cartCount(cart)

  if (!cartOpen) return null

  function goCheckout() {
    closeCart()
    router.push('/checkout')
  }

  return (
    <div
      className="fixed inset-0 z-50 animate-fadein"
      aria-modal="true"
      role="dialog"
      aria-label="Сагс"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink-900/45"
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside className="absolute top-0 right-0 h-full w-[min(420px,92vw)] bg-paper-50 border-l-[3px] border-ink-900 flex flex-col shadow-soft-lg animate-slidein">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b-[2.5px] border-ink-900">
          <h2 className="font-display font-extrabold text-[22px] text-ink-900 flex items-center gap-2">
            <ShoppingCart weight="fill" size={24} />
            Сагс
          </h2>
          <button
            onClick={closeCart}
            aria-label="Хаах"
            className="nx-icbtn w-10 h-10 border-[2.5px] border-ink-900 rounded-pill bg-paper-0 cursor-pointer flex items-center justify-center text-ink-900 shadow-hard-sm"
          >
            <X weight="bold" size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {cart.length === 0 ? (
            <div className="text-center py-16 flex flex-col gap-2 items-center text-ink-500">
              <ShoppingBag size={56} className="text-ink-300" />
              <p className="font-bold text-ink-900 m-0">Сагс хоосон байна</p>
              <span className="text-[14px]">Дуртай хоолоо нэмээрэй 🐾</span>
            </div>
          ) : (
            cart.map((ci) => {
              const p = PRODUCTS.find((pr) => pr.id === ci.id)
              if (!p) return null
              return (
                <div
                  key={ci.id}
                  className="flex gap-3 bg-paper-0 border-[2.5px] border-ink-900 rounded-md p-3 shadow-hard-sm"
                >
                  {/* Icon */}
                  <div className="grain relative w-14 h-14 shrink-0 border-[2.5px] border-ink-900 rounded-sm bg-paper-100 flex items-center justify-center overflow-hidden">
                    <ProductIcon name={p.icon} size={28} className="text-ink-300" />
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[14px] leading-snug text-ink-900 mb-0.5">{p.name}</p>
                    <p className="font-mono text-[13px] text-ink-500">{fmt(p.price)}</p>
                    <div className="mt-2 flex items-center gap-2.5">
                      {/* Qty */}
                      <div className="inline-flex items-center border-[2.5px] border-ink-900 rounded-pill bg-paper-50 overflow-hidden">
                        <button
                          onClick={() => setQty(ci.id, ci.qty - 1)}
                          aria-label="Хасах"
                          className="w-[34px] h-[34px] border-0 bg-none cursor-pointer text-[16px] flex items-center justify-center text-ink-900 hover:bg-paper-100 transition-colors"
                        >
                          <Minus weight="bold" size={14} />
                        </button>
                        <span className="min-w-[28px] text-center font-mono font-bold text-[14px] text-ink-900">
                          {ci.qty}
                        </span>
                        <button
                          onClick={() => setQty(ci.id, ci.qty + 1)}
                          aria-label="Нэмэх"
                          className="w-[34px] h-[34px] border-0 bg-none cursor-pointer text-[16px] flex items-center justify-center text-ink-900 hover:bg-paper-100 transition-colors"
                        >
                          <Plus weight="bold" size={14} />
                        </button>
                      </div>
                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(ci.id)}
                        aria-label="Устгах"
                        className="w-[38px] h-[38px] border-[2.5px] border-ink-900 rounded-pill bg-paper-0 cursor-pointer flex items-center justify-center text-brand-red hover:bg-brand-red-light transition-colors"
                      >
                        <Trash weight="bold" size={17} />
                      </button>
                    </div>
                  </div>
                  {/* Line total */}
                  <span className="font-mono font-bold text-[14px] text-ink-900 shrink-0 mt-0.5">
                    {fmt(p.price * ci.qty)}
                  </span>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        {count > 0 && (
          <div className="border-t-[2.5px] border-ink-900 p-5 flex flex-col gap-2 bg-paper-0">
            <div className="flex justify-between text-[14px]">
              <span>Дэд дүн</span>
              <b className="font-mono">{fmt(subtotal)}</b>
            </div>
            <div className="flex justify-between text-[14px]">
              <span>Хүргэлт</span>
              <b className="font-mono">{shipping === 0 ? 'Үнэгүй' : fmt(shipping)}</b>
            </div>
            <div className="flex justify-between border-t border-dashed border-paper-200 pt-2 mt-1">
              <span className="font-extrabold">Нийт</span>
              <b className="font-mono text-[18px] text-ink-900">{fmt(total)}</b>
            </div>
            {subtotal < FREE_SHIP && subtotal > 0 && (
              <p className="text-[12px] text-cobalt-600 font-mono text-center">
                {fmt(FREE_SHIP - subtotal)} нэмэлт захиалбал хүргэлт үнэгүй!
              </p>
            )}
            <button
              onClick={goCheckout}
              className="nx-press w-full h-[54px] mt-1.5 flex items-center justify-center gap-2 font-bold text-[17px] border-[2.5px] border-ink-900 rounded-pill bg-cobalt-600 text-paper-0 cursor-pointer shadow-hard"
            >
              Захиалга баталгаажуулах →
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}
