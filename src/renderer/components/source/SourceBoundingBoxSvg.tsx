import React from 'react'
import styled from 'styled-components'
import { Source } from '../../domains/source'

type Props = {
  source: Source
}

const SourceBoundingBoxSvg: React.FC<Props> = ({ source }) => {
  const { x, y, width, height } = source

  return (
    <Svg x={x} y={y} width={width} height={height}>
      <polygon />
    </Svg>
  )
}

const Svg = styled.svg``

export default SourceBoundingBoxSvg
