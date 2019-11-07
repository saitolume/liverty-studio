import React from 'react'
import styled from 'styled-components'

type Props = {
  className?: string
}

const StatusBar: React.FC<Props> = ({ className }) => {
  return <Wrapper className={className}></Wrapper>
}

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  line-height: 32px;
  width: 100%;
  height: 32px;
`

export default StatusBar
