"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WebSocketChat } from "@/components/websocket/websocket-chat"
import { MqttDashboard } from "@/components/mqtt/mqtt-dashboard"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function RealtimePage() {
  return (
    <ProtectedRoute>
      <DashboardShell>
        <DashboardHeader heading="Realtime Communication" description="Examples of WebSocket and MQTT communication" />

        <Tabs defaultValue="websocket" className="space-y-4">
          <TabsList>
            <TabsTrigger value="websocket">WebSocket</TabsTrigger>
            <TabsTrigger value="mqtt">MQTT</TabsTrigger>
          </TabsList>

          <TabsContent value="websocket" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
              <WebSocketChat />
            </div>
          </TabsContent>

          <TabsContent value="mqtt" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
              <MqttDashboard />
            </div>
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </ProtectedRoute>
  )
}
