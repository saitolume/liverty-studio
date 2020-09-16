import React, { forwardRef, useState } from 'react'
import { Canvas } from 'react-three-fiber'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faTimes } from '@fortawesome/free-solid-svg-icons'
import { remote } from 'electron'
import styled from 'styled-components'
import Button from '../shared/Button'
import VrmModel from './VrmModel'
import { useVrm } from '../../hooks/useVrm'

type Props = {
  clearVrm: () => void
  drawVrm: () => void
}

const VrmViewer = forwardRef<HTMLDivElement, Props>(({ clearVrm, drawVrm }, ref) => {
  const { vrm, loadVrm, resetVrm } = useVrm()
  const [isVrmDisplayed, setIsVrmDisplayed] = useState(true)

  const browseVrm = async () => {
    const window = remote.getCurrentWindow()
    const {
      canceled,
      filePaths: [filePath],
    } = await remote.dialog.showOpenDialog(window, {
      filters: [{ name: 'All Files', extensions: ['vrm'] }],
    })
    if (canceled) return
    loadVrm(`file://${filePath}`)
  }

  const removeVrm = () => {
    clearVrm()
    resetVrm()
  }

  const updateVrm = () => {
    clearVrm()
    if (isVrmDisplayed) drawVrm()
  }

  return (
    <Wrapper>
      <CanvasWrapper ref={ref}>
        <Canvas>
          <spotLight position={[0, 0, 50]} />
          <VrmModel vrm={vrm} updateVrm={updateVrm} />
        </Canvas>
      </CanvasWrapper>
      <BrowseButton onClick={browseVrm}>Browse VRM Model</BrowseButton>
      {vrm && (
        <>
          <DisplayToggleButton onClick={() => setIsVrmDisplayed(!isVrmDisplayed)} circle>
            <EyeIcon icon={isVrmDisplayed ? faEye : faEyeSlash} />
          </DisplayToggleButton>
          <ResetVrmButton onClick={removeVrm} circle>
            <EyeIcon icon={faTimes} />
          </ResetVrmButton>
        </>
      )}
    </Wrapper>
  )
})

const Wrapper = styled.div`
  display: flex;
  border-radius: 8px;
  flex-direction: column;
  padding: 12px;
  position: relative;
  width: 300px;
  height: calc(100% - 24px);
`

const CanvasWrapper = styled.div`
  background-color: #000;
  width: 100%;
  height: 100%;
  margin-bottom: 12px;
`

const ControlButton = styled(Button)`
  background-color: transparent;
  box-shadow: none;
  color: #ffffff50;
  display: flex;
  font-size: 24px;
  padding: 0;
  position: absolute;
  width: 40px;
  height: 40px;
`
const ResetVrmButton = styled(ControlButton)`
  top: 12px;
  right: 12px;
`

const DisplayToggleButton = styled(ControlButton)`
  top: 12px;
  left: 12px;
`

const EyeIcon = styled(FontAwesomeIcon)`
  margin: auto;
`

const BrowseButton = styled(Button)`
  margin-top: auto;
`

export default VrmViewer
