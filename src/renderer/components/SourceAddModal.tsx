import React, { useCallback, useMemo, useState } from 'react'
import { Layer, Stage } from 'react-konva'
import { remote } from 'electron'
import styled, { css } from 'styled-components'
import Button from './Button'
import Modal from './Modal'
import Input from './Input'
import SourceImage from './SourceImage'
import { createSourceImage, Source } from '../domains/source'
import { useEventListener } from '../hooks/useEventListener'
import { useSource } from '../hooks/useSource'
import { getImageSize } from '../ipc'
import { keyCodes } from '../../constants/keyCodes'

const previewWidth = 400
const previewHeight = (400 / 16) * 9

type Props = {
  close: () => void
  type: Source['type']
}

const SourceAddModal: React.FC<Props> = ({ close, type }) => {
  const { addSourceImage } = useSource()
  const [name, setName] = useState('')
  const [filepath, setFilepath] = useState('')
  const [sourcePreview, setSourcePreview] = useState<Source | null>(null)
  const isDisabled = !sourcePreview || !name

  const setPreview = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault()
    const window = remote.getCurrentWindow()
    const {
      canceled,
      filePaths: [filepath]
    } = await remote.dialog.showOpenDialog(window, {
      filters: [{ name: 'All Files', extensions: ['png', 'jpg', 'jpeg', 'gif'] }]
    })
    if (canceled) return
    const { width, height } = await getImageSize(filepath)
    const sourceImage = createSourceImage({ filepath, width, height })
    if (!name) setName(sourceImage.name)
    setFilepath(sourceImage.filepath)
    setSourcePreview(sourceImage)
  }

  const addSource = useCallback(
    async (event?: React.KeyboardEvent<HTMLInputElement> | KeyboardEvent) => {
      if ((event && event.keyCode !== keyCodes.return) || isDisabled) return
      switch (sourcePreview?.type) {
        case 'image':
          addSourceImage({ ...sourcePreview, name })
          break
      }
      close()
    },
    [addSourceImage, close, isDisabled, name, sourcePreview]
  )

  const SourcePreview = useMemo(() => {
    switch (type) {
      case 'image':
        return SourceImage
    }
  }, [type])

  useEventListener('keydown', addSource)

  return (
    <Modal close={close}>
      <Container>
        <ModalHeader>
          <Title>Add a new {type}</Title>
        </ModalHeader>
        <ModalBody>
          <PreviewBox>
            <Stage width={previewWidth} height={previewHeight}>
              <Layer>{sourcePreview && <SourcePreview source={sourcePreview} />}</Layer>
            </Stage>
          </PreviewBox>
          <SourceForm>
            {type === 'image' && (
              <>
                <Label htmlFor="image-file">Image File</Label>
                <FlexBox>
                  <SourceInfoInput
                    id="image-file"
                    type="text"
                    name="image"
                    value={filepath}
                    placeholder="Image File"
                    disabled
                  />
                  <BrowseButton onClick={setPreview}>Browse</BrowseButton>
                </FlexBox>
              </>
            )}
            <Label htmlFor="name">Name</Label>
            <SourceInfoInput
              id="name"
              type="text"
              value={name}
              placeholder="Name"
              onChange={event => setName(event.target.value)}
              onKeyDown={addSource}
            />
          </SourceForm>
          <ActionButtonList>
            <AddButton onClick={() => addSource()} disabled={isDisabled}>
              Add
            </AddButton>
            <CancelButton onClick={() => close()}>Cancel</CancelButton>
          </ActionButtonList>
        </ModalBody>
      </Container>
    </Modal>
  )
}

const Container = styled.div`
  background-color: ${({ theme }) => theme.grayDark};
  width: 400px;
`

const ModalHeader = styled.div`
  display: flex;
  width: 100%;
`

const Title = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  padding-bottom: 16px;
  width: 100%;
`

const ModalBody = styled.div`
  width: 100%;
`

const PreviewBox = styled.div`
  background-color: #000;
  margin-bottom: 24px;
  width: 100%;
`

const SourceForm = styled.div`
  width: 100%;
`

const FlexBox = styled.div`
  display: flex;
`

const Label = styled.label`
  color: #fff;
  display: block;
  font-size: 12px;
  line-height: 16px;
  margin-bottom: 8px;
`

const SourceInfoInput = styled(Input)`
  margin-bottom: 24px;
  padding: 12px;
  width: calc(100% - 24px);
  height: 100%;
`

const BrowseButton = styled(Button)`
  line-height: 34px;
  margin-left: 8px;
  width: 64px;
  height: 34px;
`

const ActionButtonList = styled.div`
  display: flex;
  flex-direction: row-reverse;
`

const CancelButton = styled(Button)`
  margin-right: 8px;
`

const AddButton = styled(Button)<{ disabled: boolean }>`
  background-color: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.primary};
  ${({ disabled }) =>
    disabled &&
    css`
      background-color: ${({ theme }) => theme.primaryDark};
      border: 1px solid ${({ theme }) => theme.primaryDark};
      cursor: not-allowed;
      &:hover {
        filter: none;
      }
    `}
`

export default SourceAddModal
