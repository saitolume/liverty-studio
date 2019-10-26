import React from 'react'
import BoundingBoxBase from './BoundingBoxBase'
import { Source } from '../domains/source'

type Props = {
  source: Source
}

const BoundingBoxImage: React.FC<Props> = ({ source }) => (
  <BoundingBoxBase source={source}>
    <image
      href={`file://${source.filepath}`}
      x={source.x + 4}
      y={source.y + 4}
      width={source.width - source.x - 8}
      height={source.height - source.y - 8}
    />
  </BoundingBoxBase>
)

export default BoundingBoxImage
