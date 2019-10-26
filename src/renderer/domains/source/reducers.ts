import { SourceAction } from './actions'
import { Source } from './models'

export type SourceState = {
  sources: Source[]
}

const initialState: SourceState = {
  sources: []
}

export const sourceReducer = (state = initialState, action: SourceAction): SourceState => {
  switch (action.type) {
    case 'ADD_SOURCE':
      return {
        ...state,
        sources: [...state.sources, action.payload.source]
      }
    case 'REMOVE_SOURCE':
      return {
        ...state,
        sources: state.sources.filter(({ id }) => action.payload.sourceId !== id)
      }
    case 'UPDATE_SOURCE':
      return {
        ...state,
        sources: state.sources.map(source =>
          action.payload.source.id === source.id ? action.payload.source : source
        )
      }
    default:
      return state
  }
}
