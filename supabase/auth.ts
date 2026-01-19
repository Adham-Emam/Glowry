'use client'

import { createClient } from './conf/client'

const supabase = createClient()

export async function login(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })
}

export async function register(email: string, password: string) {
  const res = await supabase.auth.signUp({ email, password })

  if (res.error) return res

  return supabase.auth.signInWithPassword({ email, password })
}

export async function logout() {
  return supabase.auth.signOut()
}
