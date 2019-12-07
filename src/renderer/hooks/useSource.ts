import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../domains'
import {
  Source,
  SourceState,
  addSource,
  createSourceImage,
  removeSource as _removeSource,
  updateSource as _updateSouce
} from '../domains/source'

export const useSource = () => {
  const dispatch = useDispatch()
  const sources = useSelector<RootState, SourceState['sources']>(({ source }) => source.sources)

  const images = useMemo(() => sources.filter(source => source.type === 'image'), [sources])

  const addSourceImage = useCallback(
    ({
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
    },
    [dispatch]
  )

  const removeSource = useCallback(
    (sourceId: Source['id']) => {
      dispatch(_removeSource(sourceId))
    },
    [dispatch]
  )

  const updateSource = useCallback(
    (source: Source) => {
      dispatch(_updateSouce(source))
    },
    [dispatch]
  )

  return {
    addSourceImage,
    images,
    removeSource,
    sources,
    updateSource
  }
}
