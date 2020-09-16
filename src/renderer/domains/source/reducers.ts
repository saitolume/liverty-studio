import { SourceAction } from './actions'
import { Source } from './models'

export type SourceState = {
  currentSourceId: Source['id']
  sources: Source[]
}

const initialState: SourceState = {
  currentSourceId: '',
  sources: [],
}

export const sourceReducer = (state = initialState, action: SourceAction): SourceState => {
  switch (action.type) {
    case 'ADD_SOURCE':
      return {
        ...state,
        sources: [...state.sources, action.payload.source],
      }
    case 'REMOVE_SOURCE':
      return {
        ...state,
        sources: state.sources.filter(({ id }) => action.payload.sourceId !== id),
      }
    case 'UPDATE_SOURCE':
      return {
        ...state,
        sources: state.sources.map((source) =>
          action.payload.source.id === source.id ? action.payload.source : source
        ),
      }
    case 'SELECT_CURRENT_SOURCE':
      return {
        ...state,
        currentSourceId: action.payload.sourceId,
      }
    case 'DESELECT_CURRENT_SOURCE':
      return {
        ...state,
        currentSourceId: '',
      }
    default:
      return state
  }
}
