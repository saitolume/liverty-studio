import React, { useEffect, useRef } from 'react'
import { hot } from 'react-hot-loader/root'
import { Stage, Layer } from 'react-konva'
import Konva from 'konva'
import styled from 'styled-components'
import MenuControls from './components/MenuControls'
import MenuMixer from './components/MenuMixer'
import MenuSources from './components/MenuSouces'
import SourceImage from './components/SourceImage'
import StatusBar from './components/StatusBar'
import TabBar from './components/TabBar'
import VrmViewer from './components/VrmViewer'
import { useBroadcast } from './hooks/useBroadcast'
import { useSource } from './hooks/useSource'

const stageWidth = (innerWidth / 3) * 2
const stageHeight = (((innerWidth / 3) * 2) / 16) * 9

interface CanvasElement extends HTMLCanvasElement {
  captureStream: (frameRate: number) => MediaStream
}

const App: React.FC = () => {
  const { setStream } = useBroadcast()
  const { images, sources, updateSource } = useSource()
  const stageRef = useRef<Konva.Stage>(null)
  const vrmRef = useRef<HTMLDivElement>(null)

  const drawVrm = () => {
    const stageCanvas = stageRef.current?.content.querySelector('canvas')
    const vrmCanvas = vrmRef.current?.querySelector('canvas')

    if (!stageCanvas || !vrmCanvas) return
    const context = stageCanvas.getContext('2d')

    if (!context) return
    const { width, height } = vrmCanvas
    context.clearRect(stageWidth - width, stageHeight - height, width, height)
    context.drawImage(vrmCanvas, stageWidth - width, stageHeight - height, width, height)
  }

  useEffect(() => {
    const stageCanvas = (stageRef.current?.content.querySelector('canvas') as unknown) as
      | CanvasElement
      | null
      | undefined

    if (!stageCanvas) {
      console.error('Cannot find stage canvas')
      return
    }

    const mediaStream = stageCanvas.captureStream(30)
    setStream(mediaStream)
  }, [setStream])

  return (
    <>
      <TabBar />
      <Container>
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
                    updateSource={updateSource}
                    isSelected
                    draggable
                  />
                ))}
              </Layer>
            </Stage>
          </Preview>
          <VrmViewer ref={vrmRef} drawVrm={drawVrm} />
        </Main>
        <Menus>
          <MenuSources sources={sources} />
          <MenuMixer />
          <MenuControls />
        </Menus>
        <StatusBar />
      </Container>
    </>
  )
}

const Container = styled.div`
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
  width: (innerWidth / 3) * 2;
  height: (((innerWidth / 3) * 2) / 16) * 9;
`

const Menus = styled.div`
  display: flex;
  flex: 1 1;
  width: 100%;
`

export default hot(App)
