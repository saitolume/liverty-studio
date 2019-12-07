import React from 'react'
import styled from 'styled-components'

const StatusBar: React.FC = () => (
  <Wrapper>
    <Span>30 fps</Span>
    <Span>CPU: 0.0%</Span>
    <Span>LIVE: 00:00:00</Span>
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  line-height: 24px;
  margin-top: auto;
  padding: 4px 0;
  width: 100%;
  height: 24px;
`

const Span = styled.span`
  margin-left: 24px;
`

export default StatusBar
