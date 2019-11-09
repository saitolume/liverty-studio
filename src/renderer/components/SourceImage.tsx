import React, { useRef } from 'react'
import { Image as ImageComponent } from 'react-konva'
import useImage from 'use-image'
import { Image } from 'konva/types/shapes/Image'
import { KonvaEventObject } from 'konva/types/Node'
import SourceBoundingBox from './SourceBoundingBox'
import { Source } from '../domains/source'

type Props = {
  isSelected: boolean
  source: Source
  updateSource: (source: Source) => void
}

const SourceImage: React.FC<Props> = ({ isSelected, source, updateSource }) => {
  const imageRef = useRef<Image>(null)
  const [image] = useImage(`file://${source.filepath}`)

  const onDragEnd = (event: KonvaEventObject<DragEvent>) => {
    const { x, y } = event.currentTarget.getClientRect()
    updateSource({ ...source, x, y })
  }

  const onTransformEnd = (event: KonvaEventObject<Event>) => {
    const { x, y, width, height, scaleX, scaleY } = event.currentTarget.attrs
    updateSource({
      ...source,
      x,
      y,
      width: width * scaleX,
      height: height * scaleY
    })
  }

  return (
    <SourceBoundingBox sourceRef={imageRef} isSelected={isSelected}>
      <ImageComponent
        ref={imageRef}
        image={image}
        x={source.x}
        y={source.y}
        width={source.width}
        height={source.height}
        onDragEnd={onDragEnd}
        onTransformEnd={onTransformEnd}
        draggable
      />
    </SourceBoundingBox>
  )
}

export default SourceImage
