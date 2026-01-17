'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/supabase/hooks/useAuth'
import Loading from './ui/Loading'

export default function ProtectedRoute({ children }: any) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) return <Loading />

  return children
}
