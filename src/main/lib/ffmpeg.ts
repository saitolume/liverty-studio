import { ChildProcessWithoutNullStreams, spawn } from 'child_process'

export const createFfmpegProcess = (rtmpUrl: string): ChildProcessWithoutNullStreams => {
  const ffmpeg = spawn('ffmpeg', [
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
    rtmpUrl,
  ])
  return ffmpeg
}
