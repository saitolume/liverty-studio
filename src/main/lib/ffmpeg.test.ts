import { createFfmpegProcess } from './ffmpeg'

describe('createFfmpegProcess', () => {
  const rtmpUrl = ''

  it('should return a new process of ffmpeg', () => {
    const ffmpeg = createFfmpegProcess(rtmpUrl)
    expect(ffmpeg).toBeTruthy()
  })
})
