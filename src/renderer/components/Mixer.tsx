import React, { useCallback, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import Button from './Button'
import { Microphone } from '../hooks/useMicrophone'
import { theme } from '../../constants/theme'

type Props = {
  audio: Microphone | null
}

const Mixer: React.FC<Props> = ({ audio }) => {
  const ratioBarRef = useRef<SVGLineElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [volumeLevel, setVolumeLevel] = useState(1.0)

  const width = wrapperRef.current?.clientWidth || 0
  const ratioBarWidth = width * 0.75
  const isMuted = !!audio?.isMuted

  const scrollRatioBar = useCallback(
    (event: React.MouseEvent<SVGRectElement, MouseEvent>) => {
      if (!isScrolling || !ratioBarRef.current) return
      const { left } = ratioBarRef.current.getBoundingClientRect()
      const position = event.clientX - left - 15
      if (position < 0 || position > ratioBarWidth - 30) return
      const volumeLevel = Math.floor((position / ratioBarWidth / 0.84) * 100) / 100
      setVolumeLevel(volumeLevel)
    },
    [isScrolling, ratioBarWidth]
  )

  const toggleMute = () => {
    if (isMuted) {
      audio?.unmute()
    } else {
      audio?.mute()
    }
  }

  const enableScrolling = () => {
    setIsScrolling(true)
  }

  const disableScrolling = () => {
    setIsScrolling(false)
  }

  return (
    <Wrapper ref={wrapperRef}>
      <FlexBox>
        <div>{audio?.deviceName}</div>
        <div>0.0 dB</div>
      </FlexBox>
      <SoundPressureVisualizer viewBox={`0 0 ${width} 5`}>
        <line x1="0" y1="2.5" x2={width} y2="2.5" stroke="#fff" strokeWidth="5" />
      </SoundPressureVisualizer>
      <VolumeControlBar viewBox={`0 0 ${width} 16`}>
        <line
          ref={ratioBarRef}
          x1="0"
          y1="8"
          x2={ratioBarWidth}
          y2="8"
          stroke={theme.gray}
          strokeWidth="5"
        />
        <line
          x1="0"
          y1="8"
          x2={ratioBarWidth * volumeLevel * 0.84}
          y2="8"
          stroke="#528eff"
          strokeWidth="5"
        />
        <Handle
          x={ratioBarWidth * volumeLevel * 0.84}
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
      </VolumeControlBar>
      <MuteButton onClick={toggleMute} circle>
        <VolumeIcon icon={isMuted ? faVolumeMute : faVolumeUp} />
      </MuteButton>
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

const VolumeControlBar = styled.svg`
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

const MuteButton = styled(ControlButton)`
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
