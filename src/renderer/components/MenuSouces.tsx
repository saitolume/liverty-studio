import React from 'react'
import styled from 'styled-components'
import { remote } from 'electron'
import MenuBase from './MenuBase'
import { Source } from '../domains/source/models'
import { useSources } from '../hooks/useSources'
import { getImageSize } from '../utils/getImageSize'

type Props = {
  sources: Source[]
}

const MenuSources: React.FC<Props> = ({ sources }) => {
  const { dialog } = remote
  const { addImage, removeSource } = useSources()

  const onClickPlusButton = async () => {
    const { filePaths } = await dialog.showOpenDialog({})
    if (!filePaths) return
    const [filepath] = filePaths
    const size = await getImageSize(filepath)
    addImage({ filepath, ...size })
  }

  return (
    <MenuBase title="Sources">
      {sources.map(source => (
        <SourceBox key={source.id}>
          {source.name}
          <button onClick={() => removeSource(source.id)}>-</button>
        </SourceBox>
      ))}
      <MenuSourcesActions>
        <button onClick={onClickPlusButton}>+</button>
      </MenuSourcesActions>
    </MenuBase>
  )
}

const SourceBox = styled.div`
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  line-height: 32px;
  padding: 0 8px;
  width: calc(100% - 16px);
  height: 32px;
`

const MenuSourcesActions = styled.div`
  background-color: #333;
  line-height: 32px;
  margin-top: auto;
  padding: 0 8px;
  width: calc(100% - 16px);
  height: 32px;
`

export default MenuSources
