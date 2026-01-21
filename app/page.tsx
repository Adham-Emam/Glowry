import ProductsComponent from '@/components/Landing/ProductsComponent'
import { Suspense } from 'react'

export default function Home() {
  return (
    <Suspense fallback={null}>
      <ProductsComponent />
    </Suspense>
  )
}
