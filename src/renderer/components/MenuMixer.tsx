import React from 'react'
import styled from 'styled-components'
import MenuBase from './MenuBase'
import Mixer from './Mixer'

const MenuMixer: React.FC = () => {
  return (
    <Wrapper title="Mixer">
      <Mixer />
    </Wrapper>
  )
}

const Wrapper = styled(MenuBase)`
  padding: 12px 12px 0;
  width: calc(100% - 32px);
  height: calc(100% - 40px);
`

export default MenuMixer
