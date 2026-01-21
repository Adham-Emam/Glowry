'use server'
import { createClient } from './conf/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(values: any) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // Call the database function we just created
  const { error } = await supabase.rpc('update_user_profile_and_address', {
    p_user_id: user.id,
    p_full_name: values.full_name,
    p_phone: values.phone,
    p_country: values.country,
    p_city: values.city,
    p_state: values.state,
    p_street: values.street,
    p_building: values.building,
    p_apartment: values.apartment,
    p_postal_code: values.postal_code,
    p_delivery_notes: values.delivery_notes,
  })

  if (error) return { error: error.message }

  revalidatePath('/profile')
  return { success: true }
}
