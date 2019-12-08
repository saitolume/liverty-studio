import React, { useRef, useCallback, useEffect } from 'react'
import styled from 'styled-components'

type Props = {
  className?: string
  close?: () => void
  top?: number
  right?: number
  left?: number
  bottom?: number
}

const Popper: React.FC<Props> = ({ children, className, close, ...props }) => {
  const ref = useRef<HTMLDivElement>(null)

  const onOutsideClick = useCallback(
    (event: MouseEvent) => {
      const isClickInside = ref.current?.contains(event.target as Node)
      if (isClickInside || !close) return
      close()
    },
    [close]
  )

  useEffect(() => {
    document.body.addEventListener('click', onOutsideClick)
    return () => {
      document.body.removeEventListener('click', onOutsideClick)
    }
  }, [onOutsideClick])

  return (
    <Wrapper className={className} ref={ref} {...props}>
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ top?: number; right?: number; left?: number; bottom?: number }>`
  box-shadow: 0 0 24px #00000050;
  position: absolute;
  ${({ top }) => typeof top === 'number' && `top: ${top}px;`}
  ${({ right }) => typeof right === 'number' && `right: ${right}px;`}
  ${({ left }) => typeof left === 'number' && `left: ${left}px;`}
  ${({ bottom }) => typeof bottom === 'number' && `bottom: ${bottom}px;`}
  z-index: 9999;
`

export default Popper
