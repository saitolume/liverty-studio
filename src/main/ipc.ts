import { ipcMain } from 'electron'
import { Server } from 'http'
import { imageSize } from 'image-size'
import destroyer from 'server-destroy'
import { promisify } from 'util'
import { createFfmpegProcess } from './lib/ffmpeg'
import { createWebSocketServer } from './lib/webSocket'
import { services } from '../config/services.json'
import {
  GET_IMAGE_SIZE,
  SEND_STREAM_KEY,
  START_SERVER,
  TERMINATE_SERVER
} from '../constants/channels'

const sizeOf = promisify(imageSize)

let server: Server | null = null
let stremKey = ''

// Calc image size from image path
ipcMain.handle(GET_IMAGE_SIZE, async (_, imagePath) => {
  try {
    const size = await sizeOf(imagePath)
    return size
  } catch (err) {
    console.error(err)
  }
})

// Recive a stremKey
ipcMain.handle(SEND_STREAM_KEY, (_, _stremKey) => {
  stremKey = _stremKey
})

// Start streaming
ipcMain.handle(START_SERVER, async () => {
  const { server: _server, wss } = await createWebSocketServer()
  server = _server
  server.listen(3000)

  wss.on('connection', ws => {
    const rtmpUrl = `${services[0].url}/${stremKey}`
    const ffmpeg = createFfmpegProcess(rtmpUrl)

    ffmpeg.on('close', (code, signal) => {
      console.log(`FFmpeg child process closed, code ${code}, signal ${signal}`)
      ws.terminate()
    })

    ffmpeg.stdin.on('error', event => {
      console.log('FFmpeg STDIN Error', event)
    })

    ffmpeg.stderr.on('data', data => {
      console.log('FFmpeg STDERR:', data.toString())
    })

    ws.on('message', message => {
      console.log('DATA', message)
      ffmpeg.stdin.write(message)
    })

    ws.on('close', () => {
      ffmpeg.kill('SIGINT')
    })
  })
})

// Finish streaming
ipcMain.handle(TERMINATE_SERVER, async () => {
  if (!server) return
  destroyer(server)
})
