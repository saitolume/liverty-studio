import React, { useState, useMemo } from 'react'
import { Layer, Stage } from 'react-konva'
import { remote } from 'electron'
import styled from 'styled-components'
import Modal from './Modal'
import SourceImage from './SourceImage'
import SourceText from './SourceText'
import { createSourceImage, Source } from '../domains/source'
import { useSource } from '../hooks/useSource'
import { getImageSize } from '../utils/getImageSize'

type Props = {
  close: () => void
  type: Source['type']
}

const SourceAddModal: React.FC<Props> = ({ close, type }) => {
  const { dialog } = remote
  const { addSourceImage } = useSource()
  const [name, setName] = useState('')
  const [filepath, setFilepath] = useState('')
  const [sourcePreview, setSourcePreview] = useState<Source | null>(null)

  const previewWidth = 400
  const previewHeight = (400 / 16) * 9

  const setPreview = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    const { filePaths } = await dialog.showOpenDialog({})
    if (!filePaths) return
    const [filepath] = filePaths
    const { width, height } = await getImageSize(filepath)
    const sourceImage = createSourceImage({ filepath, width, height })
    setFilepath(filepath)
    setSourcePreview(sourceImage)
  }

  const onSubmit = async (event?: React.KeyboardEvent<HTMLInputElement>) => {
    if (event && event.keyCode !== 13) return
    switch (sourcePreview?.type) {
      case 'image':
        addSourceImage(sourcePreview)
        break
    }
    close()
  }

  const SourcePreview = useMemo(() => {
    switch (type) {
      case 'image':
        return SourceImage
      case 'text':
        return SourceText
    }
  }, [type])

  return (
    <Modal close={close}>
      <Container>
        <ModalHeader>
          <Title>Add a new source</Title>
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
                <div style={{ display: 'flex' }}>
                  <Input
                    id="image-file"
                    type="text"
                    name="image"
                    value={filepath}
                    placeholder="Image File"
                    disabled
                  />
                  <BrowseButton onClick={setPreview}>Browse</BrowseButton>
                </div>
              </>
            )}
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              placeholder="Name"
              onChange={event => setName(event.target.value)}
              onKeyDown={onSubmit}
            />
          </SourceForm>
          <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
            <SubmitButton onClick={() => onSubmit()}>Add</SubmitButton>
            <CancelButton onClick={() => close()}>Cancel</CancelButton>
          </div>
        </ModalBody>
      </Container>
    </Modal>
  )
}

const Container = styled.div`
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

const Label = styled.label`
  color: ${({ theme }) => theme.white};
  display: block;
  font-size: 12px;
  line-height: 16px;
  margin-bottom: 8px;
`

const Input = styled.input`
  background-color: ${({ theme }) => theme.grayDark};
  border: 1px solid ${({ theme }) => theme.grayLight};
  border-radius: 4px;
  caret-color: ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.white};
  font-size: 16px;
  line-height: 16px;
  outline: 0;
  padding: 12px;
  margin-bottom: 24px;
  width: calc(100% - 24px);
  transition: border 0.15s;
  &:focus {
    border: 1px solid ${({ theme }) => theme.white};
  }
`

const Button = styled.button`
  background-color: ${({ theme }) => theme.grayDark};
  border: 1px solid ${({ theme }) => theme.grayLight};
  border-radius: 4px;
  color: ${({ theme }) => theme.white};
  cursor: pointer;
  margin-bottom: 24px;
  outline: 0;
  transition: background-color 0.15s;
  &:hover {
    filter: brightness(1.1);
  }
  &:active {
    border: 1px solid ${({ theme }) => theme.white};
  }
`

const BrowseButton = styled(Button)`
  margin-left: 8px;
`

const CancelButton = styled(Button)``

const SubmitButton = styled(Button)`
  background-color: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.primary};
`

export default SourceAddModal
