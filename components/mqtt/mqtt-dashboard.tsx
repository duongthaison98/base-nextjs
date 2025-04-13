"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useMqtt } from "@/lib/mqtt/use-mqtt"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Wifi, WifiOff, Send, Plus, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function MqttDashboard() {
  const [publishTopic, setPublishTopic] = useState("sensors/data")
  const [publishPayload, setPublishPayload] = useState("")
  const [publishQos, setPublishQos] = useState<number>(0)
  const [publishRetain, setPublishRetain] = useState<boolean>(false)
  const [subscribeTopics, setSubscribeTopics] = useState<string[]>(["sensors/#"])
  const [newTopic, setNewTopic] = useState("")

  const { connected, messages, publish, subscribe, unsubscribe, connect, disconnect, clearMessages } = useMqtt({
    autoConnect: true,
    topics: subscribeTopics,
  })

  useEffect(() => {
    // Re-subscribe to topics when they change
    if (connected) {
      subscribeTopics.forEach((topic) => {
        subscribe(topic)
      })
    }
  }, [connected, subscribe, subscribeTopics])

  const handlePublish = () => {
    if (publishTopic && publishPayload && connected) {
      try {
        // Try to parse as JSON if it looks like JSON
        const payload = publishPayload.trim().startsWith("{") ? JSON.parse(publishPayload) : publishPayload

        publish(publishTopic, payload, {
          qos: publishQos,
          retain: publishRetain,
        })

        setPublishPayload("")
      } catch (error) {
        console.error("Error parsing payload as JSON:", error)
        // Publish as string if JSON parsing fails
        publish(publishTopic, publishPayload, {
          qos: publishQos,
          retain: publishRetain,
        })
        setPublishPayload("")
      }
    }
  }

  const handleAddTopic = () => {
    if (newTopic && !subscribeTopics.includes(newTopic)) {
      setSubscribeTopics([...subscribeTopics, newTopic])
      if (connected) {
        subscribe(newTopic)
      }
      setNewTopic("")
    }
  }

  const handleRemoveTopic = (topic: string) => {
    setSubscribeTopics(subscribeTopics.filter((t) => t !== topic))
    if (connected) {
      unsubscribe(topic)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlePublish()
    }
  }

  const handleTopicKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTopic()
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>MQTT Dashboard</CardTitle>
          <Badge variant={connected ? "default" : "destructive"} className="flex items-center gap-1">
            {connected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {connected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
        <CardDescription>Monitor and publish MQTT messages</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="subscribe">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="subscribe">Subscribe</TabsTrigger>
            <TabsTrigger value="publish">Publish</TabsTrigger>
          </TabsList>
          <TabsContent value="subscribe" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Topic to subscribe (e.g., sensors/#)"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyPress={handleTopicKeyPress}
              />
              <Button onClick={handleAddTopic} disabled={!connected || !newTopic}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {subscribeTopics.map((topic) => (
                <Badge key={topic} variant="secondary" className="flex items-center gap-1">
                  {topic}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 p-0"
                    onClick={() => handleRemoveTopic(topic)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={clearMessages}>
                Clear Messages
              </Button>
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

            <ScrollArea className="h-[300px] border rounded-md p-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <p className="text-center text-muted-foreground">No messages received yet.</p>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className="border-b pb-2 last:border-0">
                      <div className="flex justify-between">
                        <span className="font-semibold">{msg.topic}</span>
                        <span className="text-xs text-muted-foreground">
                          QoS: {msg.qos} {msg.retain ? "| Retained" : ""}
                        </span>
                      </div>
                      <pre className="text-sm bg-muted p-2 rounded-md mt-1 overflow-x-auto">
                        {typeof msg.payload === "object" ? JSON.stringify(msg.payload, null, 2) : String(msg.payload)}
                      </pre>
                      <div className="text-xs text-muted-foreground mt-1">{new Date().toLocaleTimeString()}</div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="publish" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <label className="text-sm font-medium">Topic</label>
                  <Input
                    placeholder="Topic to publish (e.g., sensors/data)"
                    value={publishTopic}
                    onChange={(e) => setPublishTopic(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">QoS</label>
                  <Select
                    value={publishQos.toString()}
                    onValueChange={(value) => setPublishQos(Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="QoS" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0 - At most once</SelectItem>
                      <SelectItem value="1">1 - At least once</SelectItem>
                      <SelectItem value="2">2 - Exactly once</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Payload</label>
                <div className="mt-1">
                  <textarea
                    className="w-full min-h-[100px] p-2 rounded-md border"
                    placeholder="Message payload (text or JSON)"
                    value={publishPayload}
                    onChange={(e) => setPublishPayload(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="retain"
                  checked={publishRetain}
                  onChange={(e) => setPublishRetain(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="retain" className="text-sm font-medium">
                  Retain message
                </label>
              </div>

              <Button
                className="w-full"
                onClick={handlePublish}
                disabled={!connected || !publishTopic || !publishPayload}
              >
                <Send className="h-4 w-4 mr-2" />
                Publish Message
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
