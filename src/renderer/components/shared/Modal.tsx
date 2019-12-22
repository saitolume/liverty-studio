import React, { useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

type Props = {
  close: () => void
}

const Modal: React.FC<Props> = ({ children, close }) => {
  const ref = useRef<HTMLDivElement>(null)

  const closeModal = useCallback(
    (event: MouseEvent) => {
      const isClickTitlebar = event.clientY <= 22
      const isClickInside = ref.current?.contains(event.target as Node)
      if (isClickTitlebar || isClickInside) return
      close()
    },
    [close]
  )

  useEffect(() => {
    document.body.addEventListener('click', closeModal)
    return () => {
      document.body.removeEventListener('click', closeModal)
    }
  }, [closeModal])

  return createPortal(
    <Overlay>
      <Content ref={ref}>{children}</Content>
    </Overlay>,
    document.body
  )
}

const Overlay = styled.div`
  background-color: #00000075;
  box-shadow: 0 0 24px #00000075;
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
`

const Content = styled.div`
  background-color: ${({ theme }) => theme.grayDark};
  border-radius: 6px;
  box-shadow: 0 0 0 1px #333;
  margin: auto;
  padding: 16px;
`

export default Modal
