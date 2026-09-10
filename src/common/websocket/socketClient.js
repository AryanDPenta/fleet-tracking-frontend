import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const WS_URL = import.meta.env.VITE_WS_BASE_URL || '/ws'

let client = null
let connectPromise = null

// Single shared STOMP connection for the whole app. Both the admin live map
// and a driver's alert feed subscribe to topics on this same connection.
function getClient() {
  if (client) return client

  client = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 4000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000
  })

  return client
}

export function connectSocket() {
  const c = getClient()
  if (c.active) return Promise.resolve(c)

  if (!connectPromise) {
    connectPromise = new Promise((resolve, reject) => {
      c.onConnect = () => resolve(c)
      c.onStompError = (frame) => reject(new Error(frame.headers?.message || 'STOMP error'))
      c.activate()
    })
  }
  return connectPromise
}

// Returns an unsubscribe function. Caller is responsible for calling it on unmount.
export async function subscribeTopic(destination, onMessage) {
  const c = await connectSocket()
  const sub = c.subscribe(destination, (message) => {
    try {
      onMessage(JSON.parse(message.body))
    } catch {
      onMessage(message.body)
    }
  })
  return () => sub.unsubscribe()
}
