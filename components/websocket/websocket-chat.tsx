"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useWebSocket } from "@/lib/websocket/use-websocket"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Wifi, WifiOff } from "lucide-react"

interface ChatMessage {
  id: string
  sender: string
  content: string
  timestamp: number
}

export function WebSocketChat() {
  const [message, setMessage] = useState("")
  const [username, setUsername] = useState(`User-${Math.floor(Math.random() * 1000)}`)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const { connected, messages, send, connect, disconnect } = useWebSocket({
    autoConnect: true,
    channels: ["chat"],
  })

  useEffect(() => {
    // Process incoming messages
    messages.forEach((wsMessage) => {
      if (wsMessage.type === "chat") {
        const chatMessage = wsMessage.payload as ChatMessage
        setChatMessages((prev) => [...prev, chatMessage])
      }
    })
  }, [messages])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [chatMessages])

  const handleSendMessage = () => {
    if (message.trim() && connected) {
      const chatMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        sender: username,
        content: message,
        timestamp: Date.now(),
      }

      send({
        type: "chat",
        payload: chatMessage,
      })

      // Add to local messages immediately (optimistic UI)
      setChatMessages((prev) => [...prev, chatMessage])
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>WebSocket Chat</CardTitle>
          <Badge variant={connected ? "default" : "destructive"} className="flex items-center gap-1">
            {connected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {connected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
        <CardDescription>Real-time chat using WebSockets</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] border p-4 rounded-md">
          <div className="space-y-4">
            {chatMessages.length === 0 ? (
              <p className="text-center text-muted-foreground">No messages yet. Start the conversation!</p>
            ) : (
              chatMessages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === username ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      msg.sender === username ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="font-semibold">{msg.sender}</p>
                    <p>{msg.content}</p>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex w-full gap-2">
          <Input
            placeholder="Your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="max-w-[150px]"
          />
          {connected ? (
            <Button variant="outline" onClick={disconnect}>
              Disconnect
            </Button>
          ) : (
            <Button variant="outline" onClick={connect}>
              Connect
            </Button>
          )}
        </div>
        <div className="flex w-full gap-2">
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!connected}
          />
          <Button onClick={handleSendMessage} disabled={!connected || !message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
