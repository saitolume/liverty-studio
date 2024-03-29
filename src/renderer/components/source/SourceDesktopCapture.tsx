import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Source } from '../../domains/source'

type Props = {
  desktopCapture: Source
}

const SourceDesktopCapture: React.FC<Props> = () => {
  useEffect(() => {
    // Draw to canvas
  }, [])

  return (
    <Wrapper>
      <svg></svg>
      <canvas></canvas>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
`

export default SourceDesktopCapture
