'use client'

import Link from 'next/link'
import type { Product } from '@/types/products'

export default function ProductCard({ product }: { product: Product }) {
  const primaryImage =
    product.product_images?.find((img) => img.is_primary)?.display_url ||
    product.product_images?.[0]?.display_url ||
    'https://dummyimage.com/600x400/000/fff'

  return (
    <Link
      href={`/products/${product.slug}`}
      className="relative group block rounded-2xl border border-border bg-card shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden pb-10"
    >
      <div className="h-56 w-full overflow-hidden">
        <img
          src={primaryImage}
          alt={product.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-2">{product.name}</h3>

        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        <div className="absolute bottom-4 left-0 w-full px-4 mt-4 flex items-center justify-between">
          <span className="text-lg font-bold">
            {product.discount_price ?? product.price}LE
          </span>
          {product.discount_price && (
            <span className="text-sm text-destructive line-through">
              {product.price}LE
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
