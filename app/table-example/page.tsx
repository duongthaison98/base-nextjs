"use client"

import type React from "react"

import { useQuery } from "@tanstack/react-query"
import apiClient from "@/lib/api/axios"
import type { User } from "@/lib/api/services/user-service"
import { ProtectedRoute } from "@/components/auth/protected-route"

import { DataTable } from "@/components/data-table/data-table"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { columns } from "@/components/data-table/columns"

export default function TableExamplePage(): React.ReactElement {
  const { data, isLoading, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await apiClient.get<User[]>("/api/users/me")
      return response.data
    },
    // If the API isn't available, use this fallback
    placeholderData: [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        role: "admin",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "user",
      },
    ],
  })

  return (
    <ProtectedRoute>
      <DashboardShell>
        <DashboardHeader
          heading="Data Table Example"
          description="Example of TanStack Table with TanStack Query for data fetching."
        />
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <p className="text-sm text-muted-foreground">Loading data...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-24">
              <p className="text-sm text-red-500">Error loading data</p>
            </div>
          ) : (
            <DataTable columns={columns} data={data || []} />
          )}
        </div>
      </DashboardShell>
    </ProtectedRoute>
  )
}
