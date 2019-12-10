import React, { useState } from 'react'
import styled from 'styled-components'
import Button from './Button'
import Input from './Input'
import MenuBase from './MenuBase'
import { useBroadcast } from '../hooks/useBroadcast'

const MenuControls: React.FC = () => {
  const [streamKey, setStreamKey] = useState('')
  const { isStreaming, startStreaming, finishStreaming } = useBroadcast()

  const toggleStreaming = () => {
    if (isStreaming) {
      finishStreaming()
    } else {
      startStreaming(streamKey)
    }
  }

  return (
    <Wrapper name="Controls">
      <ControlButton onClick={toggleStreaming}>
        {isStreaming ? 'Stop' : 'Start'} Streaming
      </ControlButton>
      <ControlButton>YouTube</ControlButton>
      <StreamKeyInput
        type="text"
        placeholder="Stream Key"
        value={streamKey}
        onChange={event => setStreamKey(event.target.value)}
      />
    </Wrapper>
  )
}

const Wrapper = styled(MenuBase)`
  padding: 12px 12px 0;
  width: calc(100% - 32px);
  height: calc(100% - 40px);
`

const ControlButton = styled(Button)`
  margin-bottom: 12px;
`

const StreamKeyInput = styled(Input)`
  text-align: center;
`

export default MenuControls
