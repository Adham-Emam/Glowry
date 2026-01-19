'use client'

import { useAuth } from '@/supabase/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
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
  const router = useRouter()

  const handleWishlist = async () => {
    if (!isAuthenticated || !user) {
      router.push('/login')
      return
    }

    const res = await toggleWishlist(product.id, product.slug)

    if (res.error) toast.error(res.error)
    else
      toast.success(
        res.status === 'added' ? 'Added to wishlist' : 'Removed from wishlist',
      )
    console.log(res)
  }

  return (
    <>
      <div className="flex items-center justify-between border border-border px-4 py-2 rounded-full">
        <Button variant="default" size="icon" className="rounded-full">
          <Minus />
        </Button>
        <span className="font-extrabold text-lg">0</span>
        <Button variant="default" size="icon" className="rounded-full">
          <Plus />
        </Button>
      </div>

      <div className="flex gap-4">
        <Button
          size="lg"
          className="flex-1 rounded-full h-14 text-lg"
          disabled={isOutOfStock}
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
