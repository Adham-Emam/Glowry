export interface CartItems {
  productId: number
  quantity: number
  price: number
  name: string
  image: string
}

export interface CartState {
  items: CartItems[]
}
