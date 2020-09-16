import { createWebSocketServer } from './webSocket'
import { Server } from 'http'
import WebSocket from 'ws'

describe('createWebSocketServer', () => {
  let server: Server | null = null
  let wss: WebSocket.Server | null = null

  beforeAll(async (done) => {
    const { server: _server, wss: _wss } = await createWebSocketServer()
    server = _server
    wss = _wss
    done()
  })

  it('should return instance of http.Server', async () => {
    expect(server).toBeInstanceOf(Server)
  })

  it('should return instance of WebSocket.Server', async () => {
    expect(wss).toBeInstanceOf(WebSocket.Server)
  })
})
