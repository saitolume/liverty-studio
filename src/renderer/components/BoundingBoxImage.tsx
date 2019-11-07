import React, { useEffect, useRef } from 'react'
import { Image as ImageComponent, Transformer as TransformerComponent } from 'react-konva'
import useImage from 'use-image'
import { Source } from '../domains/source'
import { KonvaEventObject } from 'konva/types/Node'
import { Image } from 'konva/types/shapes/Image'
import { Transformer } from 'konva/types/shapes/Transformer'

type Props = {
  source: Source
  updateSource: (source: Source) => void
  isSelected: boolean
}

const BoundingBoxImage: React.FC<Props> = ({ isSelected, source, updateSource }) => {
  const { x, y, width, height } = source
  const imageRef = useRef<Image>(null)
  const transformerRef = useRef<Transformer>(null)
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

  useEffect(() => {
    if (!isSelected || !transformerRef.current) return
    transformerRef.current.setNode(imageRef.current)
    const layer = transformerRef.current.getLayer()
    if (!layer) return
    layer.batchDraw()
  }, [isSelected])

  return (
    <>
      <ImageComponent
        ref={imageRef}
        image={image}
        x={x}
        y={y}
        width={width}
        height={height}
        onDragEnd={onDragEnd}
        onTransformEnd={onTransformEnd}
        draggable
      />
      {isSelected && (
        <TransformerComponent
          ref={transformerRef}
          anchorSize={8}
          anchorStroke="#fff"
          borderDash={[2, 2]}
          borderStroke="#fff"
          rotateEnabled={false}
        />
      )}
    </>
  )
}

export default BoundingBoxImage
