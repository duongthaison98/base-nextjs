"use client"

import type React from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { UserForm } from "@/components/forms/user-form"

export default function FormExamplePage(): React.ReactElement {
  return (
    <ProtectedRoute>
      <DashboardShell>
        <DashboardHeader
          heading="Form Example"
          description="Example of a form with validation using react-hook-form and zod."
        />
        <div className="grid gap-4">
          <UserForm />
        </div>
      </DashboardShell>
    </ProtectedRoute>
  )
}
