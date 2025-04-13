"use client"

import { useState, useEffect, useCallback } from "react"
import { getMqttService, type MqttMessage } from "./mqtt-service"

interface UseMqttOptions {
  autoConnect?: boolean
  topics?: string[]
  qos?: number
}

interface UseMqttResult {
  connected: boolean
  messages: MqttMessage[]
  publish: (topic: string, payload: any, options?: { qos?: number; retain?: boolean }) => void
  subscribe: (topic: string, qos?: number) => void
  unsubscribe: (topic: string) => void
  connect: () => void
  disconnect: () => void
  clearMessages: () => void
}

export function useMqtt(options: UseMqttOptions = {}): UseMqttResult {
  const { autoConnect = true, topics = [], qos = 0 } = options
  const [connected, setConnected] = useState<boolean>(false)
  const [messages, setMessages] = useState<MqttMessage[]>([])
  const mqttService = getMqttService()

  const handleMessage = useCallback((message: MqttMessage) => {
    setMessages((prevMessages) => [...prevMessages, message])
  }, [])

  const handleConnectionChange = useCallback((isConnected: boolean) => {
    setConnected(isConnected)
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  useEffect(() => {
    mqttService.addMessageListener(handleMessage)
    mqttService.addConnectionListener(handleConnectionChange)

    if (autoConnect) {
      mqttService.connect()
    }

    // Subscribe to topics when connected
    if (connected) {
      topics.forEach((topic) => {
        mqttService.subscribe(topic, qos)
      })
    }

    return () => {
      mqttService.removeMessageListener(handleMessage)
      mqttService.removeConnectionListener(handleConnectionChange)

      // Unsubscribe from topics
      if (connected) {
        topics.forEach((topic) => {
          mqttService.unsubscribe(topic)
        })
      }
    }
  }, [autoConnect, connected, handleConnectionChange, handleMessage, qos, topics])

  const publish = useCallback((topic: string, payload: any, options: { qos?: number; retain?: boolean } = {}) => {
    mqttService.publish(topic, payload, options)
  }, [])

  const subscribe = useCallback((topic: string, qos = 0) => {
    mqttService.subscribe(topic, qos)
  }, [])

  const unsubscribe = useCallback((topic: string) => {
    mqttService.unsubscribe(topic)
  }, [])

  const connect = useCallback(() => {
    mqttService.connect()
  }, [])

  const disconnect = useCallback(() => {
    mqttService.disconnect()
  }, [])

  return {
    connected,
    messages,
    publish,
    subscribe,
    unsubscribe,
    connect,
    disconnect,
    clearMessages,
  }
}
