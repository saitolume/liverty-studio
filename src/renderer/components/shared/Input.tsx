import React from 'react'
import styled from 'styled-components'

type Props = {
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>

const Input: React.FC<Props> = ({ className, ...props }) => (
  <StyledInput className={className} {...props} />
)

const StyledInput = styled.input`
  -webkit-appearance: none;
  background-color: #2c2c2c;
  border: 1px solid ${({ theme }) => theme.grayLight};
  border-radius: 4px;
  box-shadow: 0 0 24px #00000050;
  caret-color: #fff;
  color: #fff;
  font-size: 1.1rem;
  line-height: 24px;
  outline: none;
  padding: 4px 8px;
  width: calc(100% - 16px);
  height: 24px;
  &:focus {
    border: 1px solid #fff;
  }
`

export default Input
