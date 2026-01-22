'use server'

import { createClient } from './conf/server'
import { revalidatePath } from 'next/cache'

export async function createOrder(cartItems: any[], totalPrice: number) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) return { error: 'You must be logged in to checkout.' }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      total_price: totalPrice,
      status: 'pending',
    })
    .select()
    .single()

  if (orderError) return { error: `Order Failed: ${orderError.message}` }

  const itemsToInsert = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    price_at_purchase: item.price,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsToInsert)

  if (itemsError) {
    return { error: `Items Failed: ${itemsError.message}` }
  }

  revalidatePath('/orders')
  return { success: true, orderId: order.id }
}

export async function getOrders() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      *,
      order_items (
        id,
        quantity,
        price_at_purchase,
        products (
          name,
          product_images (image_url)
        )
      )
    `,
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return { data: null, error: error.message }

  const ordersWithImages = data?.map((order) => ({
    ...order,
    order_items: order.order_items.map((item: any) => ({
      ...item,
      products: {
        ...item.products,
        product_images: item.products?.product_images.map((img: any) => ({
          ...img,
          display_url: supabase.storage
            .from('product-images')
            .getPublicUrl(img.image_url).data.publicUrl,
        })),
      },
    })),
  }))

  return { data: ordersWithImages, error: null }
}
