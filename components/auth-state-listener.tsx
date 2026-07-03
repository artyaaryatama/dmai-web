'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AuthStateListener() {
  const router = useRouter()
  const refreshTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        // Debounce refresh to prevent multiple rapid refreshes that cause layout flashing
        // But still allow refresh when auth state actually changes (e.g. multi-tab/multi-account scenario)
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current)
        }
        
        refreshTimeoutRef.current = setTimeout(() => {
          router.refresh()
        }, 100)
      }
    })

    return () => {
      subscription.unsubscribe()
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
    }
  }, [router])

  return null
}
