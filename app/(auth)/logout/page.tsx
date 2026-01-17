'use client'
import { logout } from '@/supabase/auth'
import Loading from '@/components/ui/Loading'
import { useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function Logout() {
  useEffect(() => {
    logout()
  }, [])

  return (
    <ProtectedRoute>
      <Loading />
    </ProtectedRoute>
  )
}
