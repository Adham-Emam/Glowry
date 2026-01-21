import { Metadata } from 'next'
import { Suspense } from 'react'
import ProductsComponent from '@/components/Landing/ProductsComponent'
export const metadata: Metadata = {
  title: 'Glowry | Offers',
}

export default function OffersPage() {
  return (
    <>
      <Suspense fallback={null}>
        <ProductsComponent offers />
      </Suspense>
    </>
  )
}
