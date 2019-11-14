import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import uuid from 'uuid/v4'
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
  const { sources } = useSelector<RootState, SourceState>(({ source }) => source)

  const images = useMemo(() => sources.filter(source => source.type === 'image'), [sources])

  const addSourceImage = useCallback(
    ({ filepath, width, height }: { filepath: string; width: number; height: number }) => {
      const sourceImage = createSourceImage({ filepath, x: 4, y: 4, width, height })
      dispatch(addSource(sourceImage))
    },
    [dispatch]
  )

  const addSourceText = useCallback(
    ({ content, width, height }: { content: string; width: number; height: number }) => {
      const text: Source = {
        id: uuid(),
        type: 'text',
        name: content,
        content,
        width,
        height,
        x: 4,
        y: 4
      }
      dispatch(addSource(text))
    },
    [dispatch]
  )

  const removeSource = useCallback(
    (itemId: Source['id']) => {
      dispatch(_removeSource(itemId))
    },
    [dispatch]
  )

  const updateSource = useCallback(
    (item: Source) => {
      dispatch(_updateSouce(item))
    },
    [dispatch]
  )

  return {
    addSourceImage,
    addSourceText,
    images,
    removeSource,
    sources,
    updateSource
  }
}
