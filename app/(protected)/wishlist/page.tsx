import { Metadata } from 'next'
import ProductsComponent from '@/components/Landing/ProductsComponent'

export const metadata: Metadata = {
  title: 'Glowry | Wishlist',
}

export default function WishlistPage() {
  return <ProductsComponent wishlist />
}
