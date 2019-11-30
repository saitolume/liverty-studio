import { createFfmpegProcess } from './ffmpeg'

describe('createFfmpegProcess', () => {
  const rtmpUrl = ''

  it.skip('should return a new process of ffmpeg', () => {
    const ffmpeg = createFfmpegProcess(rtmpUrl)
    expect(ffmpeg).toBeTruthy()
  })
})
