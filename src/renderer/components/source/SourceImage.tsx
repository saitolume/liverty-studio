import React, { useCallback, useRef } from 'react'
import { Image as ImageComponent } from 'react-konva'
import useImage from 'use-image'
import { Image } from 'konva/types/shapes/Image'
import { KonvaEventObject } from 'konva/types/Node'
import SourceBoundingBoxKonva from './SourceBoundingBoxKonva'
import { Source } from '../../domains/source'

type Props = {
  isSelected?: boolean
  draggable?: boolean
  selectCurrentSource?: (sourceId: Source['id']) => void
  source: Source
  updateSource?: (source: Source) => void
}

const SourceImage: React.FC<Props> = ({
  draggable = false,
  isSelected = false,
  selectCurrentSource,
  source,
  updateSource,
}) => {
  const ref = useRef<Image>(null)
  const [image] = useImage(source.type === 'image' ? `file://${source.filepath}` : '')

  const onDragEnd = (event: KonvaEventObject<DragEvent>) => {
    if (!updateSource) return
    const { x, y } = event.currentTarget.getClientRect()
    updateSource({ ...source, x, y })
  }

  const onTransformEnd = (event: KonvaEventObject<Event>) => {
    if (!updateSource) return
    const { x, y, width, height, scaleX, scaleY } = event.currentTarget.attrs
    updateSource({
      ...source,
      x,
      y,
      width: width * scaleX,
      height: height * scaleY,
    })
  }

  const select = useCallback(() => {
    if (!selectCurrentSource || isSelected) return
    selectCurrentSource(source.id)
  }, [isSelected, selectCurrentSource, source.id])

  return (
    <SourceBoundingBoxKonva sourceRef={ref} isSelected={isSelected}>
      <ImageComponent
        ref={ref}
        image={image}
        x={source.x}
        y={source.y}
        width={source.width}
        height={source.height}
        onClick={select}
        onDragEnd={onDragEnd}
        onTransformEnd={onTransformEnd}
        draggable={draggable}
      />
    </SourceBoundingBoxKonva>
  )
}

export default SourceImage
