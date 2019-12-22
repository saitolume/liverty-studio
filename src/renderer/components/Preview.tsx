import React, { forwardRef } from 'react'
import { Stage, Layer } from 'react-konva'
import Konva from 'konva'
import styled from 'styled-components'
import SourceImage from '../components/source/SourceImage'
import { Source } from '../domains/source'

type Props = {
  currentSourceId: Source['id']
  sources: Source[]
  selectCurrentSource: (sourceId: string) => void
  updateSource: (source: Source) => void
  width: number
  height: number
}

const Preview = forwardRef<Konva.Stage, Props>(
  ({ currentSourceId, sources, selectCurrentSource, updateSource, width, height }, ref) => (
    <Wrapper>
      <Stage ref={(ref as unknown) as React.RefObject<Stage>} width={width} height={height}>
        <Layer>
          {sources.map(image => (
            <SourceImage
              key={image.id}
              source={image}
              selectCurrentSource={selectCurrentSource}
              updateSource={updateSource}
              isSelected={image.id === currentSourceId}
              draggable
            />
          ))}
        </Layer>
      </Stage>
    </Wrapper>
  )
)

const Wrapper = styled.div`
  background-color: #000;
`

export default Preview
