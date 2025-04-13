"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { LoadingPage } from "@/components/ui/loading-page"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps): React.ReactElement {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?from=${encodeURIComponent(window.location.pathname)}`)
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <LoadingPage />
  }

  if (!isAuthenticated) {
    return <LoadingPage />
  }

  return <>{children}</>
}
