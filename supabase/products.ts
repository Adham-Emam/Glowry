import supabase from '@/supabase/client'

const PAGE_SIZE = 12

export const getProducts = async (query = '', page = 1) => {
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let supabaseQuery = supabase
    .from('products')
    .select(
      `*, 
       product_images(*), 
       brand:brand_id(id, name, slug), 
       category:category_id(id, name, slug)`,
      { count: 'exact' },
    )
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (query) {
    supabaseQuery = supabaseQuery.or(
      `name.ilike.%${query}%,description.ilike.%${query}%`,
    )
  }

  const { data, count, error } = await supabaseQuery
  if (error) throw error

  const productsWithImages = data?.map((product) => ({
    ...product,
    product_images: product.product_images.map((img: any) => ({
      ...img,
      display_url: supabase.storage
        .from('product-images')
        .getPublicUrl(img.image_url).data.publicUrl,
    })),
  }))

  return {
    products: productsWithImages || [],
    totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
  }
}
