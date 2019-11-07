import React, { useRef } from 'react'
import { render } from 'react-dom'
import { Canvas } from 'react-three-fiber'
import { Stage as StageComponent, Layer } from 'react-konva'
import { Provider } from 'react-redux'
import { Stage } from 'konva/types/Stage'
import styled from 'styled-components'
import BoundingBoxImage from './components/BoundingBoxImage'
import MenuBase from './components/MenuBase'
import MenuSources from './components/MenuSouces'
import StatusBar from './components/StatusBar'
import VrmModel from './components/VrmModel'
import { useSources } from './hooks/useSources'
import { store } from './store'

const App: React.FC = () => {
  const { sources, updateSource } = useSources()
  const stageRef = useRef<Stage>(null)
  const ref = useRef<HTMLDivElement>(null)
  const images = sources.filter(item => item.type === 'image')

  const renderVrm = () => {
    if (!stageRef.current) return
    const canvas = stageRef.current.content.querySelector('canvas')
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context || !ref.current) return
    context.clearRect(0, 0, canvas.width, canvas.height)
    const vrmCanvas = ref.current.querySelector('canvas')
    if (!vrmCanvas) return
    context.drawImage(vrmCanvas, 0, 0, vrmCanvas.width, vrmCanvas.height)
  }

  return (
    <Wrapper>
      <Main>
        <StageComponent
          ref={(stageRef as unknown) as React.RefObject<StageComponent>}
          width={innerWidth - 300}
          height={innerHeight * 0.6}>
          <Layer width={innerWidth - 300} height={innerHeight * 0.6}>
            {images.map(image => (
              <BoundingBoxImage
                key={image.id}
                source={image}
                updateSource={updateSource}
                isSelected={true}
              />
            ))}
          </Layer>
        </StageComponent>
        <div ref={ref} style={{ width: '300px', visibility: 'hidden' }}>
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
        </div>
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
  width: 100vw;
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
