'use client'

import { useState } from 'react'
import { useAuth } from '@/supabase/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/redux/slices/cartSlice'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { toggleWishlist } from '@/supabase/products'
import type { Product } from '@/types/products'
import { toast } from 'sonner'

export default function ActionButtons({
  product,
  isOutOfStock,
}: {
  product: Product
  isOutOfStock: boolean
}) {
  const { user, isAuthenticated } = useAuth()
  const dispatch = useDispatch()
  const router = useRouter()

  const [localQuantity, setLocalQuantity] = useState(1)

  const handleLocalIncrement = () => {
    setLocalQuantity((prev) => prev + 1)
  }

  const handleLocalDecrement = () => {
    if (localQuantity > 1) {
      setLocalQuantity((prev) => prev - 1)
    }
  }

  const handleAddToCart = () => {
    if (!isAuthenticated || !user) {
      router.push('/login')
      return
    }

    dispatch(
      addToCart({
        productId: product.id,
        quantity: localQuantity,
        price: product.discount_price ?? product.price,
        name: product.name,
        image: product.product_images?.[0]?.display_url || '',
      }),
    )
    toast.success(`${localQuantity} ${product.name} added to cart`)
    setLocalQuantity(1)
  }

  const handleWishlist = async () => {
    if (!isAuthenticated || !user) {
      router.push('/login')
      return
    }
    const res = await toggleWishlist(product.id, product.slug)
    if (res.error) toast.error(res.error)
    else {
      router.refresh()
      toast.success(
        res.status === 'added' ? 'Added to wishlist' : 'Removed from wishlist',
      )
    }
  }

  return (
    <>
      <div className="flex items-center justify-between border border-border px-4 py-2 rounded-full w-full">
        <Button
          variant="ghost" // Changed to ghost for a cleaner look inside the border
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={handleLocalDecrement}
          disabled={localQuantity <= 1}
        >
          <Minus size={16} />
        </Button>

        <span className="font-extrabold text-lg">{localQuantity}</span>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={handleLocalIncrement}
          disabled={isOutOfStock}
        >
          <Plus size={16} />
        </Button>
      </div>

      <div className="flex gap-4">
        <Button
          size="lg"
          className="flex-1 rounded-full h-14 text-lg"
          disabled={isOutOfStock}
          onClick={handleAddToCart} // 3. Now the action only happens here
        >
          <ShoppingCart className="mr-2" /> Add to Cart
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="rounded-full h-14 w-14 p-0"
          onClick={handleWishlist}
        >
          {product.is_wishlisted ? (
            <FaHeart className="text-primary" />
          ) : (
            <FaRegHeart />
          )}
        </Button>
      </div>
    </>
  )
}
