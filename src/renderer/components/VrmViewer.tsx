import React, { forwardRef } from 'react'
import { Canvas } from 'react-three-fiber'
import { remote } from 'electron'
import styled from 'styled-components'
import VrmModel from './VrmModel'
import Button from './Button'
import { useVrm } from '../hooks/useVrm'

type Props = {
  drawVrm: () => void
}

const VrmViewer = forwardRef<HTMLDivElement, Props>(({ drawVrm }, ref) => {
  const { vrm, loadVrm } = useVrm()

  const browseVrm = async () => {
    const { canceled, filePaths } = await remote.dialog.showOpenDialog({})
    if (canceled) return
    const [filePath] = filePaths
    loadVrm(`file://${filePath}`)
  }

  return (
    <Wrapper ref={ref}>
      <CanvasWrapper>
        <Canvas>
          <spotLight position={[0, 0, 50]} />
          <VrmModel vrm={vrm} drawVrm={drawVrm} />
        </Canvas>
      </CanvasWrapper>
      <BrowseButton onClick={browseVrm}>Browse VRM Model</BrowseButton>
    </Wrapper>
  )
})

const Wrapper = styled.div`
  display: flex;
  border-radius: 8px;
  flex-direction: column;
  padding: 12px;
  position: relative;
  width: calc(100vw / 3 - 24px);
  height: calc(100% - 24px);
`

const CanvasWrapper = styled.div`
  background-color: #000;
  width: 100%;
  height: 100%;
  margin-bottom: 12px;
`

const BrowseButton = styled(Button)`
  margin-top: auto;
`

export default VrmViewer
