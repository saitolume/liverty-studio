import { Source } from './models'

export type SourceAction =
  | { type: 'ADD_SOURCE'; payload: { source: Source } }
  | { type: 'REMOVE_SOURCE'; payload: { sourceId: Source['id'] } }
  | { type: 'UPDATE_SOURCE'; payload: { source: Source } }

export const addSource = (source: Source): SourceAction => ({
  type: 'ADD_SOURCE',
  payload: {
    source
  }
})

export const removeSource = (sourceId: Source['id']): SourceAction => ({
  type: 'REMOVE_SOURCE',
  payload: {
    sourceId
  }
})

export const updateSource = (source: Source): SourceAction => ({
  type: 'UPDATE_SOURCE',
  payload: {
    source
  }
})
