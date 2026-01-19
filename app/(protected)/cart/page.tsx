import { Metadata } from 'next'
import CartComponent from './components/CartComponent'

export const metadata: Metadata = {
  title: 'Glowry | Cart',
}

export default function CartPage() {
  return <CartComponent />
}
