import React, { useRef } from 'react'
import { Text as TextCompopnent } from 'react-konva'
import { Text } from 'konva/types/shapes/Text'
import { KonvaEventObject } from 'konva/types/Node'
import SourceBoundingBox from './SourceBoundingBox'
import { Source } from '../domains/source'

type Props = {
  isSelected?: boolean
  draggable?: boolean
  source: Source
  updateSource?: (source: Source) => void
}

const SourceText: React.FC<Props> = ({
  draggable = false,
  isSelected = false,
  source,
  updateSource = () => {}
}) => {
  const ref = useRef<Text>(null)

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
    <SourceBoundingBox sourceRef={ref} isSelected={isSelected}>
      <TextCompopnent
        ref={ref}
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

export default SourceText
