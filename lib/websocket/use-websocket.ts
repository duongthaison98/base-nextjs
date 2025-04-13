"use client"

import { useState, useEffect, useCallback } from "react"
import { getWebSocketService, type WebSocketMessage } from "./websocket-service"

interface UseWebSocketOptions {
  autoConnect?: boolean
  channels?: string[]
}

interface UseWebSocketResult {
  connected: boolean
  messages: WebSocketMessage[]
  send: (message: WebSocketMessage) => void
  connect: () => void
  disconnect: () => void
  subscribe: (channel: string) => void
  unsubscribe: (channel: string) => void
  clearMessages: () => void
}

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketResult {
  const { autoConnect = true, channels = [] } = options
  const [connected, setConnected] = useState<boolean>(false)
  const [messages, setMessages] = useState<WebSocketMessage[]>([])
  const webSocketService = getWebSocketService()

  const handleMessage = useCallback((message: WebSocketMessage) => {
    setMessages((prevMessages) => [...prevMessages, message])
  }, [])

  const handleConnectionChange = useCallback((isConnected: boolean) => {
    setConnected(isConnected)
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  useEffect(() => {
    webSocketService.addMessageListener(handleMessage)
    webSocketService.addConnectionListener(handleConnectionChange)

    if (autoConnect) {
      webSocketService.connect()
    }

    // Subscribe to channels
    if (connected) {
      channels.forEach((channel) => {
        webSocketService.subscribe(channel)
      })
    }

    return () => {
      webSocketService.removeMessageListener(handleMessage)
      webSocketService.removeConnectionListener(handleConnectionChange)

      // Unsubscribe from channels
      if (connected) {
        channels.forEach((channel) => {
          webSocketService.unsubscribe(channel)
        })
      }
    }
  }, [autoConnect, channels, connected, handleConnectionChange, handleMessage])

  const send = useCallback((message: WebSocketMessage) => {
    webSocketService.send(message)
  }, [])

  const connect = useCallback(() => {
    webSocketService.connect()
  }, [])

  const disconnect = useCallback(() => {
    webSocketService.disconnect()
  }, [])

  const subscribe = useCallback((channel: string) => {
    webSocketService.subscribe(channel)
  }, [])

  const unsubscribe = useCallback((channel: string) => {
    webSocketService.unsubscribe(channel)
  }, [])

  return {
    connected,
    messages,
    send,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    clearMessages,
  }
}
