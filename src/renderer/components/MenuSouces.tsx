import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import Button from './Button'
import MenuBase from './MenuBase'
import Popper from './Popper'
import SourceAddModal from './SourceAddModal'
import { Source } from '../domains/source/models'
import { useEventListener } from '../hooks/useEventListener'
import { keyCodes } from '../../constants/keyCodes'

const sourceTypes = ['image'] as const

type Props = {
  currentSourceId: Source['id']
  sources: Source[]
  removeSource: (sourceId: Source['id']) => void
  selectCurrentSource: (sourceId: Source['id']) => void
}

const MenuSources: React.FC<Props> = ({
  currentSourceId,
  sources,
  removeSource,
  selectCurrentSource
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPopperOpen, setIsPopperOpen] = useState(false)
  const [modalType, setModalType] = useState<Source['type'] | null>(null)

  const openModal = (type: Source['type']) => {
    setIsPopperOpen(false)
    setModalType(type)
    setIsModalOpen(true)
  }

  const remove = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | KeyboardEvent) => {
    if ('keyCode' in event && event.keyCode !== keyCodes.delete) return
    if ('nativeEvent' in event) event.nativeEvent.stopImmediatePropagation()
    removeSource(currentSourceId)
  }

  const select = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: Source['id']) => {
    event.nativeEvent.stopImmediatePropagation()
    selectCurrentSource(id)
  }

  useEventListener('keydown', remove)

  return (
    <>
      <MenuBase name="Sources">
        {sources.map(({ id, name }) => (
          <SourceItem key={id} onClick={event => select(event, id)} active={id === currentSourceId}>
            {name}
          </SourceItem>
        ))}
        <SourceMenus>
          <ControlButton onClick={() => setIsPopperOpen(true)}>
            <ButtonIcon icon={faPlus} />
          </ControlButton>
          <ControlButton onClick={remove}>
            <ButtonIcon icon={faMinus} />
          </ControlButton>
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
  display: flex;
  margin-top: auto;
  padding-top: 4px;
  position: relative;
  width: 100%;
`

const SourceItem = styled.div<{ active: boolean }>`
  background-color: ${({ active, theme }) => active && theme.grayLight};
  border-bottom: 1px solid ${({ theme }) => theme.gray};
  display: flex;
  justify-content: space-between;
  line-height: 40px;
  padding: 0 8px;
  width: calc(100% - 16px);
  height: 40px;
`

const ControlButton = styled(Button)`
  background-color: transparent;
  box-shadow: none;
  color: #ffffff;
  display: flex;
  font-size: 24px;
  padding: 0;
  width: 32px;
  height: 32px;
`

const ButtonIcon = styled(FontAwesomeIcon)`
  margin: auto;
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
