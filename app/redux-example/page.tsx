"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Counter } from "@/components/redux/counter"
import { NotificationsPanel } from "@/components/redux/notifications-panel"
import { NotificationCreator } from "@/components/redux/notification-creator"

export default function ReduxExamplePage() {
  return (
    <ProtectedRoute>
      <DashboardShell>
        <DashboardHeader heading="Redux Example" description="Examples of Redux state management" />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Counter />
            <NotificationCreator />
          </div>
          <NotificationsPanel />
        </div>
      </DashboardShell>
    </ProtectedRoute>
  )
}
