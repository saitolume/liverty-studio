import { BroadcastState, broadcastReducer } from './broadcast/reducers'
import { combineReducers } from 'redux'
import { sourceReducer, SourceState } from './source'

export type RootState = {
  broadcast: BroadcastState
  source: SourceState
}

export const rootReducer = combineReducers<RootState>({
  broadcast: broadcastReducer,
  source: sourceReducer,
})
