import mqtt, { type MqttClient, type IClientOptions } from "mqtt"

export interface MqttMessage {
  topic: string
  payload: any
  qos: number
  retain: boolean
}

export class MqttService {
  private client: MqttClient | null = null
  private messageListeners: ((message: MqttMessage) => void)[] = []
  private connectionListeners: ((connected: boolean) => void)[] = []
  private url: string
  private options: IClientOptions

  constructor(url: string, options: IClientOptions = {}) {
    this.url = url
    this.options = {
      ...options,
      clientId: options.clientId || `mqtt-client-${Math.random().toString(16).substring(2, 10)}`,
    }
  }

  connect(): void {
    if (this.client) {
      return
    }

    try {
      this.client = mqtt.connect(this.url, this.options)

      this.client.on("connect", () => {
        console.log("MQTT connected")
        this.notifyConnectionListeners(true)
      })

      this.client.on("disconnect", () => {
        console.log("MQTT disconnected")
        this.notifyConnectionListeners(false)
      })

      this.client.on("error", (error) => {
        console.error("MQTT error:", error)
      })

      this.client.on("message", (topic, payload, packet) => {
        const message: MqttMessage = {
          topic,
          payload: this.parsePayload(payload),
          qos: packet.qos,
          retain: packet.retain,
        }
        this.notifyMessageListeners(message)
      })
    } catch (error) {
      console.error("Error connecting to MQTT:", error)
    }
  }

  disconnect(): void {
    if (this.client) {
      this.client.end()
      this.client = null
    }
  }

  subscribe(topic: string, qos = 0): void {
    if (this.client && this.client.connected) {
      this.client.subscribe(topic, { qos }, (error) => {
        if (error) {
          console.error(`Error subscribing to ${topic}:`, error)
        } else {
          console.log(`Subscribed to ${topic}`)
        }
      })
    } else {
      console.error("Cannot subscribe: MQTT not connected")
    }
  }

  unsubscribe(topic: string): void {
    if (this.client && this.client.connected) {
      this.client.unsubscribe(topic)
    }
  }

  publish(topic: string, payload: any, options: { qos?: number; retain?: boolean } = {}): void {
    if (this.client && this.client.connected) {
      const { qos = 0, retain = false } = options
      const stringPayload = typeof payload === "object" ? JSON.stringify(payload) : String(payload)

      this.client.publish(topic, stringPayload, { qos, retain }, (error) => {
        if (error) {
          console.error(`Error publishing to ${topic}:`, error)
        }
      })
    } else {
      console.error("Cannot publish: MQTT not connected")
    }
  }

  addMessageListener(listener: (message: MqttMessage) => void): void {
    this.messageListeners.push(listener)
  }

  removeMessageListener(listener: (message: MqttMessage) => void): void {
    this.messageListeners = this.messageListeners.filter((l) => l !== listener)
  }

  addConnectionListener(listener: (connected: boolean) => void): void {
    this.connectionListeners.push(listener)
  }

  removeConnectionListener(listener: (connected: boolean) => void): void {
    this.connectionListeners = this.connectionListeners.filter((l) => l !== listener)
  }

  private notifyMessageListeners(message: MqttMessage): void {
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
    return this.client?.connected || false
  }

  private parsePayload(payload: Buffer): any {
    const stringPayload = payload.toString()
    try {
      return JSON.parse(stringPayload)
    } catch (e) {
      return stringPayload
    }
  }
}

// Create a singleton instance
let mqttService: MqttService | null = null

export const getMqttService = (): MqttService => {
  if (!mqttService) {
    const mqttUrl = process.env.NEXT_PUBLIC_MQTT_URL || "mqtt://localhost:1883"
    const mqttOptions = {
      username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
      password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
      reconnectPeriod: 1000,
    }
    mqttService = new MqttService(mqttUrl, mqttOptions)
  }
  return mqttService
}
