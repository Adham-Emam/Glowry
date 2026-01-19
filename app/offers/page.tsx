import { Metadata } from 'next'
import ProductsComponent from '@/components/Landing/ProductsComponent'

export const metadata: Metadata = {
  title: 'Glowry | Offers',
}

export default function OffersPage() {
  return (
    <>
      <ProductsComponent offers />
    </>
  )
}
