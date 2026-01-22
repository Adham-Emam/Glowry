'use client'

import { useSelector, useDispatch } from 'react-redux'
import { createOrder } from '@/supabase/orders'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { RootState } from '@/redux/store'
import { changeQuantity, removeFromCart, clearCart} from '@/redux/slices/cartSlice'
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function CartComponent() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { items } = useSelector((state: RootState) => state.cart)

  // Calculations
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  )
  const shipping = subtotal > 1000 ? 0 : 50
  const total = (subtotal + shipping)

  const handleCheckout = async () => {
    if (items.length === 0) return toast.error('Your cart is empty')

    const loadingToast = toast.loading('Processing order...')

    const result = await createOrder(items, total)

    if (result.success) {
      toast.success('Order placed successfully!', { id: loadingToast })
      dispatch(clearCart()) // Clear Redux state
      router.push('/orders') // Redirect to order history
    } else {
      toast.error(result.error || 'Checkout failed', { id: loadingToast })
    }
  }


  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-6 bg-muted rounded-full">
            <ShoppingBag
              size={48}
              className="text-muted-foreground opacity-50"
            />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link href="/">
          <Button size="lg" className="rounded-full px-8">
            Start Shopping
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <span className="text-muted-foreground">({items.length} items)</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* 1. Items List */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <div className="h-32 w-32 shrink-0 mx-auto sm:mx-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="h-full w-full object-cover rounded-xl border"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Unit Price: {item.price.toFixed(2)} LE
                    </p>
                  </div>
                  <p className="text-lg font-bold">
                    {(item.price * item.quantity).toFixed(2)} LE
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Quantity Controls */}
                  <div className="flex items-center border rounded-full p-1 bg-muted/50">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() =>
                        dispatch(
                          changeQuantity({
                            productId: item.productId,
                            delta: -1,
                          }),
                        )
                      }
                    >
                      <Minus size={14} />
                    </Button>
                    <span className="w-10 text-center font-bold">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() =>
                        dispatch(
                          changeQuantity({
                            productId: item.productId,
                            delta: 1,
                          }),
                        )
                      }
                    >
                      <Plus size={14} />
                    </Button>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10 gap-2 h-10"
                    onClick={() => dispatch(removeFromCart(item.productId))}
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Remove</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-8 rounded-3xl border bg-card shadow-sm">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)} LE</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `${shipping} LE`}</span>
              </div>

              {shipping > 0 && (
                <p className="text-[12px] text-primary bg-primary/5 p-2 rounded-lg">
                  Tip: Add {(1000 - subtotal).toFixed(2)} LE more for FREE
                  shipping!
                </p>
              )}

              <hr className="my-4 border-dashed" />

              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total</span>
                <span className="text-primary">{total.toFixed(2)} LE</span>
              </div>
            </div>

            <Button onClick={handleCheckout} className="w-full h-14 rounded-full text-lg font-bold mt-8 shadow-lg shadow-primary/20 transition-transform active:scale-95">
              Place Order
            </Button>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground uppercase tracking-widest">
              <ShieldCheck size={14} />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
