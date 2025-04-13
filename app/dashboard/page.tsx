"use client"

import type React from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentSales } from "@/components/dashboard/recent-sales"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage(): React.ReactElement {
  return (
    <ProtectedRoute>
      <DashboardShell>
        <DashboardHeader
          heading="Dashboard"
          description="Overview of your application statistics and recent activity."
        />
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <DashboardStats />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[200px] bg-muted/20 rounded-md flex items-center justify-center">
                    Chart placeholder
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>You made 265 sales this month.</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Detailed analytics data will appear here.</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] bg-muted/20 rounded-md flex items-center justify-center">
                  Analytics content placeholder
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>Generated reports will appear here.</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] bg-muted/20 rounded-md flex items-center justify-center">
                  Reports content placeholder
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </ProtectedRoute>
  )
}
