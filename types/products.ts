export interface Brand {
  id: number
  name: string
  slug: string
  created_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  created_at: string
}

export interface ProductImage {
  id: number
  product_id: number
  display_url: string
  image_url: string
  is_primary: boolean
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  discount_price: number
  stock_quantity: number
  category_id: number
  category: Category
  is_wishlisted: boolean
  brand_id: number
  brand: Brand
  is_active: boolean
  created_at: string
  product_images: ProductImage[]
}

export interface Category {
  id: number
  name: string
  slug: string
  created_at: string
}
