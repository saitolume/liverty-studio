import React, { useCallback, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import Button from './Button'
import { theme } from '../../constants/theme'

const { gray } = theme

type Props = {}

const Mixer: React.FC<Props> = () => {
  const ratioBarRef = useRef<SVGLineElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [ratio, setRatio] = useState(1.0)

  const width = wrapperRef.current?.clientWidth || 0
  const ratioBarWidth = width * 0.75

  const scrollRatioBar = useCallback(
    (event: React.MouseEvent<SVGRectElement, MouseEvent>) => {
      if (!isScrolling || !ratioBarRef.current) return
      const { left } = ratioBarRef.current.getBoundingClientRect()
      const position = event.clientX - left - 15
      if (position < 0 || position > ratioBarWidth - 30) return
      const ratio = Math.ceil((position / ratioBarWidth / 0.85) * 100) / 100
      setRatio(ratio)
    },
    [isScrolling, ratioBarWidth]
  )

  const enableScrolling = () => {
    setIsScrolling(true)
  }

  const disableScrolling = () => {
    setIsScrolling(false)
  }

  return (
    <Wrapper ref={wrapperRef}>
      <FlexBox>
        <div>Microphone</div>
        <div>0.0 dB</div>
      </FlexBox>
      <SoundPressureVisualizer viewBox={`0 0 ${width} 5`}>
        <line x1="0" y1="2.5" x2={width} y2="2.5" stroke="#fff" strokeWidth="5" />
      </SoundPressureVisualizer>
      <RatioBar viewBox={`0 0 ${width} 16`}>
        <line
          ref={ratioBarRef}
          x1="0"
          y1="8"
          x2={ratioBarWidth}
          y2="8"
          stroke={gray}
          strokeWidth="5"
        />
        <line
          x1="0"
          y1="8"
          x2={ratioBarWidth * ratio * 0.85}
          y2="8"
          stroke="#528eff"
          strokeWidth="5"
        />
        <Handle
          x={ratioBarWidth * ratio * 0.85}
          y="0"
          width="30"
          height="16"
          rx="4"
          ry="4"
          fill="#fff"
          onMouseDown={enableScrolling}
          onMouseUp={disableScrolling}
          onMouseLeave={disableScrolling}
          onMouseMove={scrollRatioBar}
        />
      </RatioBar>
      <VolumeButton onClick={() => setIsMuted(!isMuted)} circle>
        <VolumeIcon icon={isMuted ? faVolumeMute : faVolumeUp} />
      </VolumeButton>
      <CogButton circle>
        <CogIcon icon={faCog} />
      </CogButton>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 72px;
`

const FlexBox = styled.div`
  display: flex;
  justify-content: space-between;
  line-height: 16px;
  margin-bottom: 8px;
  width: 100%;
  height: 16px;
`

const SoundPressureVisualizer = styled.svg`
  margin-bottom: 8px;
`

const RatioBar = styled.svg`
  display: inline;
`

const Handle = styled.rect`
  cursor: pointer;
`

const ControlButton = styled(Button)`
  background-color: transparent;
  box-shadow: none;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  font-size: 24px;
  padding: 0;
  position: absolute;
  width: 28px;
  height: 28px;
`

const VolumeButton = styled(ControlButton)`
  bottom: 10px;
  right: 30px;
`

const VolumeIcon = styled(FontAwesomeIcon)`
  margin: auto auto auto 0;
`

const CogButton = styled(ControlButton)`
  bottom: 10px;
  right: 0px;
`

const CogIcon = styled(FontAwesomeIcon)`
  margin: auto 0 auto auto;
`

export default Mixer