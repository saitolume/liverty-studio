import React, { useRef } from 'react'
import { render } from 'react-dom'
import { useStrictMode, Stage as StageComponent, Layer } from 'react-konva'
import { Provider } from 'react-redux'
import { Canvas } from 'react-three-fiber'
import { Stage } from 'konva/types/Stage'
import styled from 'styled-components'
import MenuBase from './components/MenuBase'
import MenuSources from './components/MenuSouces'
import SourceImage from './components/SourceImage'
import StatusBar from './components/StatusBar'
import VrmModel from './components/VrmModel'
import { useSources } from './hooks/useSources'
import { store } from './store'

const App: React.FC = () => {
  const { images, sources, updateSource } = useSources()
  const stageRef = useRef<Stage>(null)
  const vrmRef = useRef<HTMLDivElement>(null)

  useStrictMode(true)

  const renderVrm = () => {
    const stageCanvas = stageRef.current?.content.querySelector('canvas')
    const vrmCanvas = vrmRef.current?.querySelector('canvas')

    if (!stageCanvas || !vrmCanvas) return
    const context = stageCanvas.getContext('2d')

    if (!context) return
    const { width, height } = vrmCanvas
    context.clearRect(innerWidth - width, (innerHeight * 0.6) / 2, width, height)
    context.drawImage(vrmCanvas, innerWidth - width, (innerHeight * 0.6) / 2, width, height)
  }

  return (
    <Wrapper>
      <Main>
        <StageComponent
          ref={(stageRef as unknown) as React.RefObject<StageComponent>}
          width={innerWidth}
          height={innerHeight * 0.6}>
          <Layer width={innerWidth} height={innerHeight * 0.6}>
            {images.map(image => (
              <SourceImage
                key={image.id}
                source={image}
                updateSource={updateSource}
                isSelected={true}
              />
            ))}
          </Layer>
        </StageComponent>
        <VrmCanvas ref={vrmRef}>
          <Canvas>
            <ambientLight intensity={0.5} />
            <spotLight
              intensity={0.6}
              position={[30, 30, 50]}
              angle={0.2}
              penumbra={1}
              castShadow
            />
            <VrmModel
              url="https://cdn.glitch.com/e9accf7e-65be-4792-8903-f44e1fc88d68%2Fthree-vrm-girl.vrm?v=1568881824654"
              renderTo2dCanvas={renderVrm}
            />
          </Canvas>
        </VrmCanvas>
      </Main>
      <Menus>
        <MenuSources sources={sources} />
        <MenuBase title="Mixers"></MenuBase>
        <MenuBase title="Controls"></MenuBase>
      </Menus>
      <StatusBar />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  overflow: hidden;
  width: 100vw;
`

const VrmCanvas = styled.div`
  width: 200px;
  visibility: hidden;
`

const Main = styled.div`
  background-color: #000;
  display: flex;
  width: 100%;
  height: 60vh;
`

const Menus = styled.div`
  display: flex;
  width: 100%;
  height: calc(40vh - 32px);
`

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
)
