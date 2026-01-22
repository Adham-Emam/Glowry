import { Metadata } from 'next'
import { createClient } from '@/supabase/conf/server'
import { getProductDetail } from '@/supabase/products'
import { notFound } from 'next/navigation'
import ProductImage from '../components/ProductImage'
import ActionButtons from '../components/ActionButtons'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductDetail(slug)

  if (!product) return { title: 'Product Not Found' }

  return {
    title: `Glowry | ${product.name}`,
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const product = await getProductDetail(slug, user?.id)

  if (!product) {
    notFound()
  }
  const hasDiscount =
    product.discount_price && product.discount_price < product.price
  const isOutOfStock = product.stock_quantity <= 0

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Image Gallery */}
        <ProductImage product={product} />

        {/* Right: Product Info */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="outline" className="rounded-full">
              {product.brand?.name}
            </Badge>
            <Badge variant="secondary" className="rounded-full">
              {product.category?.name}
            </Badge>
          </div>

          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

          <div className="flex items-baseline gap-4 mb-6">
            {hasDiscount ? (
              <>
                <span className="text-3xl font-bold text-muted-foreground">
                  {product.discount_price}LE
                </span>
                <span className="text-xl text-destructive line-through">
                  {product.price}LE
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold">{product.price}LE</span>
            )}
          </div>

          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-auto space-y-6">
            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <span className="text-destructive flex items-center gap-1 font-medium">
                  <XCircle size={18} /> Out of Stock
                </span>
              ) : (
                product.stock_quantity <= 10 && (
                  <span className="text-destructive flex items-center gap-1 font-medium">
                    <CheckCircle2 size={18} /> {product.stock_quantity} units in
                    left
                  </span>
                )
              )}
            </div>

            <ActionButtons product={product} isOutOfStock={isOutOfStock} />
          </div>
        </div>
      </div>
    </div>
  )
}
