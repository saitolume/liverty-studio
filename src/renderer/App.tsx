import React, { useCallback, useEffect, useRef } from 'react'
import { hot } from 'react-hot-loader/root'
import { Stage, Layer } from 'react-konva'
import Konva from 'konva'
import styled from 'styled-components'
import MenuControls from './components/MenuControls'
import MenuMixer from './components/MenuMixers'
import MenuSources from './components/MenuSouces'
import SourceImage from './components/SourceImage'
import StatusBar from './components/StatusBar'
import TabBar from './components/TabBar'
import VrmViewer from './components/VrmViewer'
import { useBroadcast } from './hooks/useBroadcast'
import { useMicrophone } from './hooks/useMicrophone'
import { useSource } from './hooks/useSource'

const stageWidth = (innerWidth / 3) * 2
const stageHeight = (((innerWidth / 3) * 2) / 16) * 9

interface CanvasElement extends HTMLCanvasElement {
  captureStream: (frameRate: number) => MediaStream
}

const App: React.FC = () => {
  const { broadcastTime, setStream } = useBroadcast()
  const microphone = useMicrophone()
  const {
    images,
    currentSourceId,
    sources,
    selectCurrentSource,
    deselectCurrentSource,
    updateSource,
    removeSource
  } = useSource()
  const stageRef = useRef<Konva.Stage>(null)
  const vrmRef = useRef<HTMLDivElement>(null)
  const stageCanvas = useRef<CanvasElement | null>()
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
    stageCanvas.current = stageRef.current?.content.querySelector<CanvasElement>('canvas')
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
          <Preview>
            <Stage
              ref={(stageRef as unknown) as React.RefObject<Stage>}
              width={stageWidth}
              height={stageHeight}>
              <Layer>
                {images.map(image => (
                  <SourceImage
                    key={image.id}
                    source={image}
                    selectCurrentSource={selectCurrentSource}
                    updateSource={updateSource}
                    isSelected={image.id === currentSourceId}
                    draggable
                  />
                ))}
              </Layer>
            </Stage>
          </Preview>
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
  overflow: hidden;
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

const Preview = styled.div`
  background-color: #000;
`

const Menus = styled.div`
  display: flex;
  flex: 1 1;
  width: 100%;
`

export default hot(App)
