import React from 'react'
import styled from 'styled-components'

const Screen: React.FC = ({ children }) => {
  return <Wrapper>{children}</Wrapper>
}

const Wrapper = styled.svg`
  background-color: #000;
  width: 100%;
  height: 100%;
`

export default Screen
