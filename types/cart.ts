export interface CartItems {
  productId: string
  quantity: number
}

export interface CartState {
  items: CartItems[]
}
