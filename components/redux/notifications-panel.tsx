"use client"

import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import {
  selectNotifications,
  selectUnreadCount,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
} from "@/lib/redux/slices/notificationsSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, Trash, CheckCheck } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function NotificationsPanel() {
  const notifications = useAppSelector(selectNotifications)
  const unreadCount = useAppSelector(selectUnreadCount)
  const dispatch = useAppDispatch()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Check className="h-4 w-4 text-green-500" />
      case "warning":
        return <Bell className="h-4 w-4 text-yellow-500" />
      case "error":
        return <Bell className="h-4 w-4 text-red-500" />
      default:
        return <Bell className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Notifications</CardTitle>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        <CardDescription>Your recent notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No notifications</div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    notification.read ? "bg-background" : "bg-muted border-primary/20"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                      <div>
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => dispatch(markAsRead(notification.id))}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => dispatch(removeNotification(notification.id))}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => dispatch(markAllAsRead())}>
          <CheckCheck className="h-4 w-4 mr-2" />
          Mark all as read
        </Button>
        <Button variant="outline" size="sm" onClick={() => dispatch(clearAllNotifications())}>
          <Trash className="h-4 w-4 mr-2" />
          Clear all
        </Button>
      </CardFooter>
    </Card>
  )
}
