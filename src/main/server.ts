import express from 'express'
import childProcess from 'child_process'
import WebSocket from 'ws'
import { createServer } from 'http'
import { services } from '../config/services.json'

const app = express()
const server = createServer(app).listen(3000)
const wss = new WebSocket.Server({ server })

wss.on('connection', ws => {
  const rtmpUrl = `${services[0].url}/54qy-qg6z-mvvx-8x4p`
  const ffmpeg = childProcess.spawn('ffmpeg', [
    '-f',
    'lavfi',
    '-i',
    'anullsrc',

    // Codec
    '-vcodec',
    'h264',

    // FFmpeg will read input video from STDIN
    '-i',
    '-',

    // Size
    '-s',
    '854x480',

    // Preset
    '-preset',
    'medium',

    // Frame rate
    '-r',
    '30',

    // FLV is the container format used in conjunction with RTMP
    '-f',
    'flv',
    rtmpUrl
  ])

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
