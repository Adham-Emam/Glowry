'use server'

import { createClient } from '@/supabase/conf/server'
import { cache } from 'react'
import { revalidatePath } from 'next/cache'
import type { Product } from '@/types/products'

const PAGE_SIZE = 12

export const getProducts = async (
  query = '',
  page = 1,
  offers?: boolean,
  wishlist?: boolean,
  categorySlug?: string | null, // Added param
) => {
  const supabase = await createClient()

  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const currentUserId = user?.id

  // 1. Build the base selection string
  // Use !inner on product_wishlist only if we are in wishlist mode
  const selection = `
    *, 
    product_images(*), 
    brand:brand_id(id, name, slug), 
    category:category_id!inner(id, name, slug),
    product_wishlist${wishlist ? '!inner' : ''}(user_id)
  `

  let supabaseQuery = supabase
    .from('products')
    .select(selection, { count: 'exact' })
    .eq('is_active', true)

  // 2. Category Filter (Filter by slug in the joined table)
  if (categorySlug) {
    supabaseQuery = supabaseQuery.eq('category.slug', categorySlug)
  }

  // 3. Wishlist Filter
  if (wishlist) {
    if (!currentUserId) return { products: [], totalPages: 0 }
    supabaseQuery = supabaseQuery.eq('product_wishlist.user_id', currentUserId)
  } else if (currentUserId) {
    // If not in wishlist mode, still filter the join so we only see OUR heart icons
    supabaseQuery = supabaseQuery.eq('product_wishlist.user_id', currentUserId)
  }

  // 4. Offers Filter
  if (offers) {
    supabaseQuery = supabaseQuery.not('discount_price', 'is', null)
  }

  // 5. Search Query
  if (query) {
    supabaseQuery = supabaseQuery.or(
      `name.ilike.%${query}%,description.ilike.%${query}%`,
    )
  }

  const { data, count, error } = await supabaseQuery
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error

  // 6. Map Metadata (Public URLs and boolean flag)
  const productsWithImages = data?.map((product: any) => ({
    ...product,
    product_images: product.product_images.map((img: any) => ({
      ...img,
      display_url: supabase.storage
        .from('product-images')
        .getPublicUrl(img.image_url).data.publicUrl,
    })),
    is_wishlisted:
      product.product_wishlist && product.product_wishlist.length > 0,
  }))

  return {
    products: productsWithImages || [],
    totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
  }
}

export const getProductDetail = cache(async (slug: string, userId?: string) => {
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from('products')
    .select(
      `*, 
       product_images(*), 
       brand:brand_id(id, name, slug), 
       category:category_id(id, name, slug),
       product_wishlist(id)`,
    )
    .eq('slug', slug)
    .eq(
      'product_wishlist.user_id',
      userId ?? '00000000-0000-0000-0000-000000000000',
    )
    .single()

  if (error || !product) return null

  const product_images = product.product_images.map((img: any) => ({
    ...img,
    display_url: supabase.storage
      .from('product-images')
      .getPublicUrl(img.image_url).data.publicUrl,
  }))

  return {
    ...product,
    product_images,
    is_wishlisted:
      product.product_wishlist && product.product_wishlist.length > 0,
  } as Product
})

export const toggleWishlist = async (product_id: number, slug: string) => {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error)
    return {
      error: 'You must be logged in',
    }

  const { data: existingItem, error: fetchError } = await supabase
    .from('product_wishlist')
    .select('id')
    .eq('product_id', product_id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (fetchError)
    return { error: 'An unexpected error occurred, please try again.' }

  if (existingItem) {
    const { error: deleteError } = await supabase
      .from('product_wishlist')
      .delete()
      .eq('id', existingItem.id)

    if (deleteError) return { error: 'Failed to remove from wishlist' }
  } else {
    const { error: insertError } = await supabase
      .from('product_wishlist')
      .insert({ product_id, user_id: user.id })

    if (insertError) return { error: 'Failed to add to wishlist' }
  }
  revalidatePath(`/products/${slug}`)
  return { success: true, status: existingItem ? 'removed' : 'added' }
}

export const getCategories = cache(async () => {
  const supabase = await createClient()
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name', { ascending: true })
  if (error) return { error: 'An unexpected error occurred, please try again.' }
  return { data: categories }
})
