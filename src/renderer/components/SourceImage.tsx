import React, { useRef } from 'react'
import { Image as ImageComponent } from 'react-konva'
import useImage from 'use-image'
import { Image } from 'konva/types/shapes/Image'
import { KonvaEventObject } from 'konva/types/Node'
import SourceBoundingBox from './SourceBoundingBox'
import { Source } from '../domains/source'

type Props = {
  isSelected?: boolean
  draggable?: boolean
  source: Source
  updateSource?: (source: Source) => void
}

const SourceImage: React.FC<Props> = ({
  draggable = false,
  isSelected = false,
  source,
  updateSource
}) => {
  const ref = useRef<Image>(null)
  const [image] = useImage(source.type === 'image' ? `file://${source.filepath}` : '')

  const onDragEnd = (event: KonvaEventObject<DragEvent>) => {
    const { x, y } = event.currentTarget.getClientRect()
    updateSource && updateSource({ ...source, x, y })
  }

  const onTransformEnd = (event: KonvaEventObject<Event>) => {
    const { x, y, width, height, scaleX, scaleY } = event.currentTarget.attrs
    updateSource &&
      updateSource({
        ...source,
        x,
        y,
        width: width * scaleX,
        height: height * scaleY
      })
  }

  return (
    <SourceBoundingBox sourceRef={ref} isSelected={isSelected}>
      <ImageComponent
        ref={ref}
        image={image}
        x={source.x}
        y={source.y}
        width={source.width}
        height={source.height}
        onDragEnd={onDragEnd}
        onTransformEnd={onTransformEnd}
        draggable={draggable}
      />
    </SourceBoundingBox>
  )
}

export default SourceImage
