import React from 'react'
import styled from 'styled-components'
import MenuBase from './MenuBase'
import Mixer from './Mixer'
import { Microphone } from '../hooks/useMicrophone'

type Props = {
  microphone: Microphone | null
}

const MenuMixers: React.FC<Props> = ({ microphone }) => {
  return (
    <Wrapper name="Mixers">
      <Mixer audio={microphone} />
    </Wrapper>
  )
}

const Wrapper = styled(MenuBase)`
  padding: 12px 12px 0;
  width: calc(100% - 32px);
  height: calc(100% - 40px);
`

export default MenuMixers
