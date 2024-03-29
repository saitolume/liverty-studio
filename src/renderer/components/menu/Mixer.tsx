import React, { useCallback, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import Button from '../shared/Button'
import { Microphone } from '../../hooks/useMicrophone'
import { theme } from '../../../constants/theme'

type Props = {
  audio: Microphone | null
}

const Mixer: React.FC<Props> = ({ audio }) => {
  const [handlePosition, setHandlePosition] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [volumeLevel, setVolumeLevel] = useState(1.0)
  const [width, setWidth] = useState(0)

  const isMuted = !!audio?.isMuted
  const volumeControllBarWidth = width * 0.75

  const moveHandle = useCallback(
    (event: React.MouseEvent<SVGRectElement | SVGLineElement, MouseEvent>) => {
      if (event.target instanceof SVGRectElement && !isScrolling) return
      const position = event.clientX - handlePosition - 15
      const volumeLevel = Math.floor((position / volumeControllBarWidth / 0.9) * 100) / 100
      if (volumeLevel < 0 || 1 < volumeLevel) return
      setVolumeLevel(volumeLevel)
    },
    [isScrolling, handlePosition, volumeControllBarWidth]
  )

  const measureHandlePositionRef = useCallback((node: SVGLineElement) => {
    const { left } = node.getBoundingClientRect()
    setHandlePosition(left)
  }, [])

  const measureWidthRef = useCallback((node: HTMLDivElement) => {
    const { width } = node.getBoundingClientRect()
    setWidth(width)
  }, [])

  const toggleMute = () => {
    isMuted ? audio?.unmute() : audio?.mute()
  }

  const enableScrolling = () => {
    setIsScrolling(true)
  }

  const disableScrolling = () => {
    setIsScrolling(false)
  }

  return (
    <Wrapper ref={measureWidthRef}>
      <FlexBox>
        <div>{audio?.deviceName}</div>
        <div>0.0 dB</div>
      </FlexBox>
      <SoundPressureVisualizer viewBox={`0 0 ${width} 5`}>
        <line x1="0" y1="2.5" x2={width} y2="2.5" stroke="#fff" strokeWidth="5" />
      </SoundPressureVisualizer>
      <VolumeControlBar viewBox={`0 0 ${width} 16`}>
        <ClickableLine
          ref={measureHandlePositionRef}
          x1="0"
          y1="8"
          x2={volumeControllBarWidth}
          y2="8"
          stroke={theme.gray}
          strokeWidth="5"
          onClick={moveHandle}
        />
        <ClickableLine
          x1="0"
          y1="8"
          x2={volumeControllBarWidth * volumeLevel * 0.9}
          y2="8"
          stroke="#528eff"
          strokeWidth="5"
          onClick={moveHandle}
        />
        <Handle
          x={volumeControllBarWidth * volumeLevel * 0.9}
          y="0"
          width="30"
          height="16"
          rx="4"
          ry="4"
          fill="#fff"
          onMouseDown={enableScrolling}
          onMouseUp={disableScrolling}
          onMouseLeave={disableScrolling}
          onMouseMove={moveHandle}
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

const ClickableLine = styled.line`
  cursor: pointer;
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
