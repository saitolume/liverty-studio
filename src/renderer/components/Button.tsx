import React from 'react'
import styled from 'styled-components'

type Props = {
  className?: string
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const Button: React.FC<Props> = ({ children, className, onClick }) => (
  <StyledButton className={className} onClick={onClick}>
    {children}
  </StyledButton>
)

const StyledButton = styled.div`
  background-color: ${({ theme }) => theme.grayLight};
  border-radius: 4px;
  box-shadow: 0 0 24px #00000050;
  cursor: pointer;
  line-height: 24px;
  outline: none;
  padding: 4px 8px;
  text-align: center;
  width: calc(100% - 16px);
  height: 24px;
  transition: filter 0.15s;
  &:hover {
    filter: brightness(1.1);
  }
`

export default Button
