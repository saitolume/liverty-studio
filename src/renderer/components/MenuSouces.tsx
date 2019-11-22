import React, { useState } from 'react'
import styled from 'styled-components'
import MenuBase from './MenuBase'
import SourceAddModal from './SourceAddModal'
import Popper from './Popper'
import { Source } from '../domains/source/models'
import { useSource } from '../hooks/useSource'

const sourceTypes = ['image', 'text'] as const

type Props = {
  sources: Source[]
}

const MenuSources: React.FC<Props> = ({ sources }) => {
  const { removeSource } = useSource()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPopperOpen, setIsPopperOpen] = useState(false)
  const [modalType, setModalType] = useState<Source['type'] | null>(null)

  const closePopper = () => {
    setIsPopperOpen(false)
  }

  const openPopper = () => {
    setIsPopperOpen(true)
  }

  const onClickSourceTypeItem = (sourceType: Source['type']) => {
    closePopper()
    setModalType(sourceType)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <MenuBase title="Sources">
        {sources.map(source => (
          <SourceBox key={source.id}>
            {source.name}
            <button onClick={() => removeSource(source.id)}>-</button>
          </SourceBox>
        ))}
        <MenuSourcesActions>
          <button onClick={openPopper}>+</button>
          {isPopperOpen && (
            <Popper close={closePopper} top={-(sourceTypes.length * 32 + 10)}>
              <SourceTypeList>
                {sourceTypes.map((sourceType, index) => (
                  <SourceTypeItem key={index} onClick={() => onClickSourceTypeItem(sourceType)}>
                    {sourceType}
                  </SourceTypeItem>
                ))}
              </SourceTypeList>
            </Popper>
          )}
        </MenuSourcesActions>
      </MenuBase>
      {isModalOpen && modalType && <SourceAddModal type={modalType} close={closeModal} />}
    </>
  )
}

const SourceBox = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.grayLight};
  display: flex;
  justify-content: space-between;
  line-height: 32px;
  padding: 0 8px;
  width: calc(100% - 16px);
  height: 32px;
`

const MenuSourcesActions = styled.div`
  background-color: ${({ theme }) => theme.grayLight};
  line-height: 32px;
  margin-top: auto;
  padding: 0 8px;
  position: relative;
  width: calc(100% - 16px);
  height: 32px;
`

const SourceTypeList = styled.div`
  border-radius: 6px;
  box-shadow: 0 0 0 1px #333;
  width: 150px;
`

const SourceTypeItem = styled.div`
  cursor: pointer;
  line-height: 24px;
  padding: 4px 8px;
  width: calc(100% - 16px);
  height: 24px;
  &:hover {
    background-color: ${({ theme }) => theme.grayLight};
  }
  &:first-child {
    border-radius: 6px 6px 0 0;
  }
  &:last-child {
    border-radius: 0 0 6px 6px;
  }
`

export default MenuSources
