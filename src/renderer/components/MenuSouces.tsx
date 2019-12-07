import React, { useState } from 'react'
import styled from 'styled-components'
import MenuBase from './MenuBase'
import SourceAddModal from './SourceAddModal'
import Popper from './Popper'
import { Source } from '../domains/source/models'
import { useSource } from '../hooks/useSource'

const sourceTypes = ['image'] as const

type Props = {
  sources: Source[]
}

const MenuSources: React.FC<Props> = ({ sources }) => {
  const { removeSource } = useSource()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPopperOpen, setIsPopperOpen] = useState(false)
  const [modalType, setModalType] = useState<Source['type'] | null>(null)

  const openModal = (type: Source['type']) => {
    setIsPopperOpen(false)
    setModalType(type)
    setIsModalOpen(true)
  }

  return (
    <>
      <MenuBase title="Sources">
        {sources.map(source => (
          <SourceItem key={source.id}>
            {source.name}
            <button onClick={() => removeSource(source.id)}>-</button>
          </SourceItem>
        ))}
        <SourceMenus>
          <button onClick={() => setIsPopperOpen(true)}>+</button>
          {isPopperOpen && (
            <Popper close={() => setIsPopperOpen(false)} top={-sourceTypes.length * 32}>
              <SourceTypeList>
                {sourceTypes.map(type => (
                  <SourceTypeItem key={type} onClick={() => openModal(type)}>
                    {type}
                  </SourceTypeItem>
                ))}
              </SourceTypeList>
            </Popper>
          )}
        </SourceMenus>
      </MenuBase>
      {isModalOpen && modalType && (
        <SourceAddModal type={modalType} close={() => setIsModalOpen(false)} />
      )}
    </>
  )
}

const SourceMenus = styled.div`
  background-color: ${({ theme }) => theme.gray};
  margin-top: auto;
  padding-top: 4px;
  position: relative;
  width: 100%;
`

const SourceItem = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.grayLight};
  display: flex;
  justify-content: space-between;
  line-height: 32px;
  padding: 0 8px;
  width: calc(100% - 16px);
  height: 32px;
`

const SourceTypeList = styled.div`
  background-color: ${({ theme }) => theme.grayDark};
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
    background-color: ${({ theme }) => theme.gray};
  }
  &:first-child {
    border-radius: 6px 6px 0 0;
  }
  &:last-child {
    border-radius: 0 0 6px 6px;
  }
`

export default MenuSources
