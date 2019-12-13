import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../domains'
import {
  Source,
  SourceState,
  addSource,
  createSourceImage,
  removeSource as _removeSource,
  updateSource as _updateSouce,
  selectCurrentSource as _selectCurrentSource,
  deselectCurrentSource as _deselectCurrentSource
} from '../domains/source'

export const useSource = () => {
  const dispatch = useDispatch()
  const sources = useSelector<RootState, SourceState['sources']>(({ source }) => source.sources)
  const currentSourceId = useSelector<RootState, SourceState['currentSourceId']>(
    ({ source }) => source.currentSourceId
  )

  const images = useMemo(() => sources.filter(source => source.type === 'image'), [sources])

  const addSourceImage = ({
    filepath,
    name,
    width,
    height
  }: {
    filepath: string
    name?: string
    width: number
    height: number
  }) => {
    const sourceImage = createSourceImage({ filepath, name, x: 4, y: 4, width, height })
    dispatch(addSource(sourceImage))
  }

  const removeSource = (sourceId: Source['id']) => {
    dispatch(_removeSource(sourceId))
  }

  const updateSource = (source: Source) => {
    dispatch(_updateSouce(source))
  }

  const selectCurrentSource = (sourceId: Source['id']) => {
    dispatch(_selectCurrentSource(sourceId))
  }

  const deselectCurrentSource = () => {
    dispatch(_deselectCurrentSource())
  }

  return {
    addSourceImage,
    currentSourceId,
    deselectCurrentSource,
    images,
    removeSource,
    sources,
    selectCurrentSource,
    updateSource
  }
}
