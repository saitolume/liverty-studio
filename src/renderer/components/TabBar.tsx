import React from 'react'
import styled from 'styled-components'

const TabBar: React.FC = () => (
  <Wrapper>
    <Tab>Main</Tab>
  </Wrapper>
)

const Wrapper = styled.div`
  -webkit-app-region: drag;
  background-color: #fff;
  display: flex;
  padding-left: 68px;
  width: calc(100vw - 68px);
  height: 24px;
`

const Tab = styled.div`
  -webkit-app-region: no-drag;
  background-color: ${({ theme }) => theme.grayDark};
  border-radius: 8px 8px 0 0;
  margin-top: auto;
  padding: 6px 12px;
  width: 150px;
  height: calc(80% - 12px);
`

export default TabBar
