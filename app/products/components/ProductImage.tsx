'use client'

import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import type { Product } from '@/types/products'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

export default function ProductImage({ product }: { product: Product }) {
  return (
    <Carousel
      className="w-full"
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
    >
      <CarouselContent>
        {product.product_images.map((img, index) => (
          <CarouselItem key={index}>
            <div className="aspect-square relative rounded-xl border overflow-hidden">
              <Image
                src={img.display_url}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
