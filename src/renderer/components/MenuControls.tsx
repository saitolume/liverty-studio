import React, { useState } from 'react'
import MenuBase from './MenuBase'
import { useBroadcast } from '../hooks/useBroadcast'

const MenuControls: React.FC = () => {
  const [streamKey, setStreamKey] = useState('')
  const { isStreaming, startStreaming, finishStreaming } = useBroadcast()

  const onClickStartButton = () => {
    startStreaming(streamKey)
  }

  const onClickFinishButton = () => {
    finishStreaming()
  }

  return (
    <MenuBase title="Controls">
      <input type="text" value={streamKey} onChange={event => setStreamKey(event.target.value)} />
      {isStreaming ? (
        <button onClick={onClickFinishButton}>Stop</button>
      ) : (
        <button onClick={onClickStartButton}>Start</button>
      )}
    </MenuBase>
  )
}

export default MenuControls
