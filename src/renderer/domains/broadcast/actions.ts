export type BroadcastAction =
  | { type: 'START_STREAMING' }
  | { type: 'FINISH_STREAMING' }
  | { type: 'SET_STREAM'; payload: { stream: MediaStream } }

export const startStreaming = (): BroadcastAction => ({
  type: 'START_STREAMING'
})

export const finishStreaming = (): BroadcastAction => ({
  type: 'FINISH_STREAMING'
})

export const setStream = (stream: MediaStream): BroadcastAction => ({
  type: 'SET_STREAM',
  payload: {
    stream
  }
})
