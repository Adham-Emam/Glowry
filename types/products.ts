export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  discount_price: number
  stock_quantity: number
  category_id: number
  brand_id: number
  is_active: boolean
  created_at: string
  product_images: any[]
}
