import { createServer, Server } from 'http'
import WebSocket from 'ws'

export const createWebSocketServer = async (): Promise<{
  server: Server
  wss: WebSocket.Server
}> => {
  const server = createServer()
  const wss = new WebSocket.Server({ server })

  return { server, wss }
}
