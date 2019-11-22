import React, { useState, useMemo, useCallback } from 'react'
import { Layer, Stage } from 'react-konva'
import { remote } from 'electron'
import styled, { css } from 'styled-components'
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
  const isSubmitDisabled = !sourcePreview || !name

  const previewWidth = 400
  const previewHeight = (400 / 16) * 9

  const setPreview = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    const { filePaths } = await dialog.showOpenDialog({})
    if (!filePaths) return
    const [filepath] = filePaths
    const { width, height } = await getImageSize(filepath)
    const sourceImage = createSourceImage({ filepath, width, height })
    if (!name) setName(sourceImage.name)
    setFilepath(sourceImage.filepath)
    setSourcePreview(sourceImage)
  }

  const submit = useCallback(
    async (event?: React.KeyboardEvent<HTMLInputElement>) => {
      if (event && event.keyCode !== 13) return
      switch (sourcePreview?.type) {
        case 'image':
          addSourceImage({ ...sourcePreview, name })
          break
      }
      close()
    },
    [addSourceImage, close, name, sourcePreview, type]
  )

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
                  <Input
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
            <Input
              id="name"
              type="text"
              value={name}
              placeholder="Name"
              onChange={event => setName(event.target.value)}
              onKeyDown={submit}
            />
          </SourceForm>
          <ActionButtonList>
            <SubmitButton onClick={() => submit()} disabled={isSubmitDisabled}>
              Add
            </SubmitButton>
            <CancelButton onClick={() => close()}>Cancel</CancelButton>
          </ActionButtonList>
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

const FlexBox = styled.div`
  display: flex;
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
  height: 32px;
  min-width: 56px;
  margin-bottom: 24px;
  outline: 0;
  transition: background-color 0.15s, filter 0.15s;
  &:hover {
    filter: brightness(1.1);
  }
  &:active {
    border: 1px solid ${({ theme }) => theme.white};
  }
`

const BrowseButton = styled(Button)`
  height: 44px;
  margin-left: 8px;
`

const ActionButtonList = styled.div`
  display: flex;
  flex-direction: row-reverse;
`

const CancelButton = styled(Button)`
  margin-right: 8px;
`

const SubmitButton = styled(Button)<{ disabled: boolean }>`
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
