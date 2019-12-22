import React, { useCallback, useEffect, useRef } from 'react'
import { hot } from 'react-hot-loader/root'
import Konva from 'konva'
import styled from 'styled-components'
import MenuControls from './components/menu/MenuControls'
import MenuMixer from './components/menu/MenuMixers'
import MenuSources from './components/menu/MenuSouces'
import Preview from './components/Preview'
import StatusBar from './components/StatusBar'
import TabBar from './components/TabBar'
import VrmViewer from './components/vrm/VrmViewer'
import { useBroadcast } from './hooks/useBroadcast'
import { useMicrophone } from './hooks/useMicrophone'
import { useSource } from './hooks/useSource'

const stageWidth = (innerWidth / 3) * 2
const stageHeight = (((innerWidth / 3) * 2) / 16) * 9

const App: React.FC = () => {
  const { broadcastTime, setStream } = useBroadcast()
  const microphone = useMicrophone()
  const {
    currentSourceId,
    sources,
    selectCurrentSource,
    deselectCurrentSource,
    updateSource,
    removeSource
  } = useSource()
  const stageRef = useRef<Konva.Stage>(null)
  const vrmRef = useRef<HTMLDivElement>(null)
  const stageCanvas = useRef<HTMLCanvasElement | null>()
  const vrmCanvas = useRef<HTMLCanvasElement | null>()

  const clearVrm = () => {
    if (!vrmCanvas.current) return
    const { clientWidth, clientHeight } = vrmCanvas.current
    stageCanvas.current
      ?.getContext('2d')
      ?.clearRect(stageWidth - clientWidth, stageHeight - clientHeight, clientWidth, clientHeight)
  }

  const drawVrm = () => {
    if (!vrmCanvas.current) return
    const { clientWidth, clientHeight } = vrmCanvas.current
    stageCanvas.current
      ?.getContext('2d')
      ?.drawImage(
        vrmCanvas.current,
        stageWidth - clientWidth,
        stageHeight - clientHeight,
        clientWidth,
        clientHeight
      )
  }

  const deselect = useCallback(
    (event: MouseEvent) => {
      const rect = stageRef.current?.content.getBoundingClientRect()
      if (!rect) return
      const { x, y, width, height } = rect
      const { clientX, clientY } = event
      const isX = clientX < x || width < clientX
      const isY = clientY < y || height < clientY
      if (isX || isY) deselectCurrentSource()
    },
    [deselectCurrentSource]
  )

  // Handle clicking outside stage
  useEffect(() => {
    document.addEventListener('click', deselect)
    return () => {
      document.removeEventListener('click', deselect)
    }
  }, [deselect])

  // Get canvas refs
  useEffect(() => {
    stageCanvas.current = stageRef.current?.content.querySelector('canvas')
    vrmCanvas.current = vrmRef.current?.querySelector('canvas')
  }, [])

  // Capture media stream
  useEffect(() => {
    if (!stageCanvas.current || !microphone.audioTrack) return
    const mediaStream = stageCanvas.current.captureStream(30)
    if (microphone.audioTrack.enabled) mediaStream.addTrack(microphone.audioTrack)
    setStream(mediaStream)
  }, [microphone.audioTrack, setStream])

  return (
    <>
      <TabBar />
      <Wrapper>
        <Main>
          <Preview
            ref={stageRef}
            width={stageWidth}
            height={stageHeight}
            sources={sources}
            currentSourceId={currentSourceId}
            selectCurrentSource={selectCurrentSource}
            updateSource={updateSource}
          />
          <VrmViewer ref={vrmRef} clearVrm={clearVrm} drawVrm={drawVrm} />
        </Main>
        <Menus>
          <MenuSources
            currentSourceId={currentSourceId}
            sources={sources}
            removeSource={removeSource}
            selectCurrentSource={selectCurrentSource}
          />
          <MenuMixer microphone={microphone} />
          <MenuControls />
        </Menus>
        <StatusBar broadcastTime={broadcastTime} />
      </Wrapper>
    </>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 12px 0 12px;
  width: calc(100vw - 24px);
  height: calc(100vh - 36px);
`

const Main = styled.div`
  background-color: ${({ theme }) => theme.gray};
  display: flex;
  margin-bottom: 12px;
  width: 100%;
`

const Menus = styled.div`
  display: flex;
  flex: 1 1;
  width: 100%;
`

export default hot(App)
