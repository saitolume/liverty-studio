import React from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

const AddSourceModal: React.FC = () => {
  return createPortal(
    <Wrapper>
      <div>aa</div>
    </Wrapper>,
    document.body
  )
}

const Wrapper = styled.div``

export default AddSourceModal
