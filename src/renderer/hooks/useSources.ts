import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import uuid from 'uuid/v4'
import { RootState } from '../domains'
import {
  Source,
  SourceState,
  addSource,
  removeSource as _removeSource,
  updateSource as _updateSouce
} from '../domains/source'

const getFilename = (filepath: string) => {
  const result = filepath.match(/[^/]+$/)
  if (!result) return filepath
  return result[0]
}

export const useSources = () => {
  const dispatch = useDispatch()
  const { sources } = useSelector<RootState, SourceState>(({ source }) => source)
  const [currentSource, setCurrentSource] = useState<Source | null>(null)

  const addImage = useCallback(
    ({ filepath, width, height }: Pick<Source, 'filepath' | 'width' | 'height'>) => {
      if (!filepath) return
      const image: Source = {
        id: uuid(),
        type: 'image',
        name: getFilename(filepath),
        filepath,
        width,
        height,
        x: 4,
        y: 4
      }
      dispatch(addSource(image))
    },
    [dispatch]
  )

  const addText = useCallback(
    ({ content = '', name }: Pick<Source, 'content' | 'name'>) => {
      const text: Source = {
        id: uuid(),
        type: 'text',
        name,
        content,
        width: 0,
        height: 0,
        x: 0,
        y: 0
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

  return { currentSource, sources, addImage, addText, removeSource, setCurrentSource, updateSource }
}
