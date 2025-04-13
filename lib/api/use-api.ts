"use client"

import { useState, useCallback } from "react"
import apiClient, { type ApiError, type ApiResponse } from "./axios"
import type { AxiosRequestConfig, AxiosResponse } from "axios"

interface UseApiState<T> {
  data: T | null
  isLoading: boolean
  error: ApiError | null
}

interface UseApiResponse<T> extends UseApiState<T> {
  execute: (config?: AxiosRequestConfig) => Promise<AxiosResponse<ApiResponse<T>>>
  reset: () => void
}

export function useApi<T = any>(
  url: string,
  method: "get" | "post" | "put" | "delete" | "patch" = "get",
  initialData: T | null = null,
): UseApiResponse<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    isLoading: false,
    error: null,
  })

  const execute = useCallback(
    async (config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const response = await apiClient.request<ApiResponse<T>>({
          url,
          method,
          ...config,
        })

        setState({
          data: response.data.data,
          isLoading: false,
          error: null,
        })

        return response
      } catch (error: any) {
        const apiError: ApiError = {
          message: error.response?.data?.message || "An unexpected error occurred",
          status: error.response?.status || 500,
          errors: error.response?.data?.errors,
        }

        setState({
          data: null,
          isLoading: false,
          error: apiError,
        })

        throw error
      }
    },
    [url, method],
  )

  const reset = useCallback(() => {
    setState({
      data: initialData,
      isLoading: false,
      error: null,
    })
  }, [initialData])

  return {
    ...state,
    execute,
    reset,
  }
}
