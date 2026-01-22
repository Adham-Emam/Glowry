export interface OrderItem {
  id: number
  quantity: number
  price_at_purchase: number
  products: {
    name: string
    product_images: {
      image_url: string
      display_url: string
    }[]
  }
}
export interface Order {
  id: number
  user_id: string
  total_price: number
  status: string
  created_at: string
  order_items: OrderItem[]
}
