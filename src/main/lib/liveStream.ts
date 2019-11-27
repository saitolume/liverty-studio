/* eslint-disable @typescript-eslint/camelcase */

import { authenticete } from './oauth2'
import { google, youtube_v3 } from 'googleapis'

type LiveStreamingFormat = '1080p_hfr' | '1080p' | '720p_hfr' | '720p' | '480p' | '360p' | '240p'

const scopes = [
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.force-ssl',
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtubepartner-channel-audit'
]

let youtube: youtube_v3.Youtube | null = null

const createLiveStream = async ({
  title,
  format
}: {
  title?: string
  format?: LiveStreamingFormat
}) => {
  if (!youtube) {
    console.error('Auth required')
    return
  }

  const { data } = await youtube.liveStreams.insert({
    part: 'snippet, cdn',
    requestBody: {
      snippet: {
        title: title || 'Bradcast from Liverty Studio'
      },
      cdn: {
        format: format || '480p',
        frameRate: '30fps',
        ingestionType: 'rtmp',
        resolution: format || '480p'
      }
    }
  })
  return data
}

const getBroadcast = async () => {
  if (!youtube) {
    console.error('Auth required')
    return
  }

  const { data } = await youtube.liveBroadcasts.list({
    part: 'id',
    broadcastStatus: 'upcoming',
    maxResults: 1
  })
  return data.items ? data.items[0] : null
}

const bindStream = async ({ broadcastId, streamId }: { broadcastId: string; streamId: string }) => {
  if (!youtube) {
    console.error('Auth required')
    return
  }

  const { data, status } = await youtube.liveBroadcasts.bind({
    part: 'id',
    id: broadcastId,
    streamId
  })

  console.log(`status: ${status}`)
  console.log(data)
}

export const broadcast = async () => {
  try {
    const auth = await authenticete(scopes)
    youtube = google.youtube({ version: 'v3', auth })

    const stream = await createLiveStream({ title: 'test', format: '720p' })
    const broadcast = await getBroadcast()

    if (!stream?.id || !broadcast?.id) {
      console.log('Cannot find broadcast id or stream id')
      return
    }

    await bindStream({ broadcastId: broadcast.id, streamId: stream.id })
  } catch (err) {
    console.error(err)
  }
}
