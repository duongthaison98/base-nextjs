import { io, type Socket } from "socket.io-client"

export interface WebSocketMessage {
  type: string
  payload: any
}

export class WebSocketService {
  private socket: Socket | null = null
  private messageListeners: ((message: WebSocketMessage) => void)[] = []
  private connectionListeners: ((connected: boolean) => void)[] = []
  private url: string

  constructor(url: string) {
    this.url = url
  }

  connect(): void {
    if (this.socket) {
      return
    }

    this.socket = io(this.url, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
    })

    this.socket.on("connect", () => {
      console.log("WebSocket connected")
      this.notifyConnectionListeners(true)
    })

    this.socket.on("disconnect", () => {
      console.log("WebSocket disconnected")
      this.notifyConnectionListeners(false)
    })

    this.socket.on("message", (data: WebSocketMessage) => {
      this.notifyMessageListeners(data)
    })

    this.socket.on("error", (error) => {
      console.error("WebSocket error:", error)
    })
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  send(message: WebSocketMessage): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit("message", message)
    } else {
      console.error("Cannot send message: WebSocket not connected")
    }
  }

  subscribe(channel: string): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit("subscribe", { channel })
    } else {
      console.error("Cannot subscribe: WebSocket not connected")
    }
  }

  unsubscribe(channel: string): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit("unsubscribe", { channel })
    }
  }

  addMessageListener(listener: (message: WebSocketMessage) => void): void {
    this.messageListeners.push(listener)
  }

  removeMessageListener(listener: (message: WebSocketMessage) => void): void {
    this.messageListeners = this.messageListeners.filter((l) => l !== listener)
  }

  addConnectionListener(listener: (connected: boolean) => void): void {
    this.connectionListeners.push(listener)
  }

  removeConnectionListener(listener: (connected: boolean) => void): void {
    this.connectionListeners = this.connectionListeners.filter((l) => l !== listener)
  }

  private notifyMessageListeners(message: WebSocketMessage): void {
    this.messageListeners.forEach((listener) => {
      try {
        listener(message)
      } catch (error) {
        console.error("Error in message listener:", error)
      }
    })
  }

  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach((listener) => {
      try {
        listener(connected)
      } catch (error) {
        console.error("Error in connection listener:", error)
      }
    })
  }

  isConnected(): boolean {
    return this.socket?.connected || false
  }
}

// Create a singleton instance
let websocketService: WebSocketService | null = null

export const getWebSocketService = (): WebSocketService => {
  if (!websocketService) {
    const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:3001"
    websocketService = new WebSocketService(wsUrl)
  }
  return websocketService
}
