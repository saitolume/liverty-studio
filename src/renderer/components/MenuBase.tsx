import React from 'react'
import styled from 'styled-components'

type Props = {
  className?: string
  title: string
}

const MenuBase: React.FC<Props> = ({ className, children, title }) => (
  <Wrapper>
    <MenuTitle>{title}</MenuTitle>
    <MenuBox className={className}>{children}</MenuBox>
  </Wrapper>
)

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.gray};
  width: 100%;
  height: 100%;
  &:nth-last-child(2) {
    border-left: 6px solid ${({ theme }) => theme.grayDark};
    border-right: 6px solid ${({ theme }) => theme.grayDark};
  }
`

const MenuTitle = styled.div`
  background-color: ${({ theme }) => theme.gray};
  line-height: 24px;
  text-align: center;
  width: 100%;
  height: 24px;
`

const MenuBox = styled.div`
  background-color: ${({ theme }) => theme.grayDark};
  display: flex;
  flex-direction: column;
  margin: 0 4px 4px;
  width: calc(100% - 8px);
  height: calc(100% - 28px);
`

export default MenuBase
