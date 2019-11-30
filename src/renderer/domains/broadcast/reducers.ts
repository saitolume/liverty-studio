import { BroadcastAction } from './actions'

export type BroadcastState = {
  isStreaming: boolean
  stream: MediaStream | null
  streamKey: string
}

const initialState: BroadcastState = {
  isStreaming: false,
  stream: null,
  streamKey: ''
}

export const broadcastReducer = (state = initialState, action: BroadcastAction): BroadcastState => {
  switch (action.type) {
    case 'START_STREAMING':
      return {
        ...state,
        isStreaming: true
      }
    case 'FINISH_STREAMING':
      return {
        ...state,
        isStreaming: false
      }
    case 'SET_STREAM':
      return {
        ...state,
        stream: action.payload.stream
      }
    default:
      return state
  }
}
