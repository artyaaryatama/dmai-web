'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AuthStateListener() {
  const router = useRouter()
  const hasRefreshedRef = useRef(false)

  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      // Only refresh once when user actually signs in, not on every auth state change
      // This prevents repeated refreshes during navigation and hydration
      if (event === 'SIGNED_IN' && !hasRefreshedRef.current) {
        hasRefreshedRef.current = true
        router.refresh()
      }
      
      // Reset flag if user signs out
      if (event === 'SIGNED_OUT') {
        hasRefreshedRef.current = false
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  return null
}
