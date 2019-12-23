import React, { useEffect, useRef } from 'react'
import { Transformer as TransformerComponent } from 'react-konva'
import { Image } from 'konva/types/shapes/Image'
import { Transformer } from 'konva/types/shapes/Transformer'

type Props = {
  isSelected: boolean
  sourceRef: React.RefObject<Image>
}

const SourceBoundingBoxKonva: React.FC<Props> = ({ children, isSelected, sourceRef }) => {
  const transformerRef = useRef<Transformer>(null)

  useEffect(() => {
    if (!isSelected || !transformerRef.current || !sourceRef.current) return
    transformerRef.current.setNode(sourceRef.current)
    const layer = transformerRef.current.getLayer()
    if (!layer) return
    layer.batchDraw()
  }, [isSelected, sourceRef])

  return (
    <>
      {children}
      {isSelected && (
        <TransformerComponent
          ref={transformerRef}
          anchorSize={8}
          anchorStroke="#fff"
          borderEnabled={isSelected}
          borderDash={[2, 2]}
          borderStroke="#fff"
          rotateEnabled={false}
        />
      )}
    </>
  )
}

export default SourceBoundingBoxKonva
