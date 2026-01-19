'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/supabase/conf/client'
import { User } from '@supabase/auth-js'

const supabase = createClient()

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      },
    )

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  return { user, loading, isAuthenticated: !!user }
}
