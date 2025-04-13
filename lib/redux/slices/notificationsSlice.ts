import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../store"

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  timestamp: number
}

interface NotificationsState {
  items: Notification[]
  unreadCount: number
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
}

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, "id" | "read" | "timestamp">>) => {
      const newNotification: Notification = {
        id: `notification-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        read: false,
        timestamp: Date.now(),
        ...action.payload,
      }
      state.items.unshift(newNotification)
      state.unreadCount += 1
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find((item) => item.id === action.payload)
      if (notification && !notification.read) {
        notification.read = true
        state.unreadCount -= 1
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach((item) => {
        item.read = true
      })
      state.unreadCount = 0
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex((item) => item.id === action.payload)
      if (index !== -1) {
        if (!state.items[index].read) {
          state.unreadCount -= 1
        }
        state.items.splice(index, 1)
      }
    },
    clearAllNotifications: (state) => {
      state.items = []
      state.unreadCount = 0
    },
  },
})

export const { addNotification, markAsRead, markAllAsRead, removeNotification, clearAllNotifications } =
  notificationsSlice.actions

// Selectors
export const selectNotifications = (state: RootState) => state.notifications.items
export const selectUnreadCount = (state: RootState) => state.notifications.unreadCount

export default notificationsSlice.reducer
