import { combineReducers } from 'redux'
import { sourceReducer, SourceState } from './source'

export type RootState = {
  source: SourceState
}

export const rootReducer = combineReducers<RootState>({
  source: sourceReducer
})
