import { createServer } from 'http'
import WebSocket from 'ws'

export const createWebSocketServer = async () => {
  const server = createServer()
  const wss = new WebSocket.Server({ server })

  return { server, wss }
}
