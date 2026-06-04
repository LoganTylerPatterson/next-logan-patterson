'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export function useArcadeNavigate() {
  const [isExiting, setIsExiting] = useState(false)
  const router = useRouter()

  const navigateBack = useCallback(() => {
    setIsExiting(true)
    sessionStorage.setItem('arcadeBackFromGame', '1')
    setTimeout(() => {
      router.push('/arcade')
    }, 600)
  }, [router])

  return { isExiting, navigateBack }
}
