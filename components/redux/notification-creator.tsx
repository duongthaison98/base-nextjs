"use client"

import type React from "react"

import { useState } from "react"
import { useAppDispatch } from "@/lib/redux/hooks"
import { addNotification } from "@/lib/redux/slices/notificationsSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Bell } from "lucide-react"

export function NotificationCreator() {
  const dispatch = useAppDispatch()
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [type, setType] = useState<"info" | "success" | "warning" | "error">("info")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title && message) {
      dispatch(
        addNotification({
          title,
          message,
          type,
        }),
      )
      setTitle("")
      setMessage("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Notification</CardTitle>
        <CardDescription>Add a new notification to the system</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Notification title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Notification message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select notification type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            <Bell className="h-4 w-4 mr-2" />
            Create Notification
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
