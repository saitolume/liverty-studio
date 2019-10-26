import React from 'react'
import BoundingBoxBase from './BoundingBoxBase'
import { Source } from '../domains/source'

type Props = {
  source: Source
}

const BoundingBoxText: React.FC<Props> = ({ source }) => (
  <BoundingBoxBase source={source}>
    <text
      x={source.x + 4}
      y={source.y + 4}
      width={source.width - source.x - 8}
      height={source.height - source.y - 8}>
      {source.content}
    </text>
  </BoundingBoxBase>
)

export default BoundingBoxText
