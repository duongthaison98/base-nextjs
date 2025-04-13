"use client"

import { useState, useEffect } from "react"
import { isTokenExpired } from "@/lib/api/axios"
import { useAuth } from "@/lib/auth/auth-context"

interface TokenStatus {
  isValid: boolean
  isLoading: boolean
  checkToken: () => Promise<boolean>
}

export function useTokenStatus(): TokenStatus {
  const [isValid, setIsValid] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { refreshSession } = useAuth()

  const checkToken = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("auth-token")

      if (!token) {
        setIsValid(false)
        return false
      }

      // Check if token is expired
      if (isTokenExpired(token)) {
        // Try to refresh the session
        const refreshed = await refreshSession()
        setIsValid(refreshed)
        return refreshed
      }

      setIsValid(true)
      return true
    } catch (error) {
      console.error("Token check failed:", error)
      setIsValid(false)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkToken()
  }, [])

  return { isValid, isLoading, checkToken }
}
