import { createServer } from 'http'
import WebSocket from 'ws'

export const createWebSocketServer = async () => {
  const server = createServer().listen(3000)
  const wss = new WebSocket.Server({ server })

  return { server, wss }
}
