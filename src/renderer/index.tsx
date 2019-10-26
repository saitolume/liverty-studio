import React, { useMemo } from 'react'
import { render } from 'react-dom'
import { hot } from 'react-hot-loader/root'
import { Provider } from 'react-redux'
import styled from 'styled-components'
import BoundingBoxImage from './components/BoundingBoxImage'
import BoundingBoxText from './components/BoundingBoxText'
import MenuBase from './components/MenuBase'
import MenuSources from './components/MenuSouces'
import Screen from './components/Screen'
import StatusBar from './components/StatusBar'
import { useSources } from './hooks/useSources'
import { store } from './store'

const App = hot(() => {
  const { sources } = useSources()
  const images = useMemo(() => sources.filter(item => item.type === 'image'), [sources])
  const texts = useMemo(() => sources.filter(item => item.type === 'text'), [sources])

  return (
    <Wrapper>
      <Main>
        <Screen>
          {images.map(image => (
            <BoundingBoxImage key={image.id} source={image} />
          ))}
          {texts.map(text => (
            <BoundingBoxText key={text.id} source={text} />
          ))}
        </Screen>
      </Main>
      <Menus>
        <MenuSources sources={sources} />
        <MenuBase title="Mixers"></MenuBase>
        <MenuBase title="Controls"></MenuBase>
      </Menus>
      <StyledStatusBar />
    </Wrapper>
  )
})

const Wrapper = styled.div`
  width: 100vw;
`

const Main = styled.div`
  display: flex;
  width: 100%;
  height: 60vh;
`

const Menus = styled.div`
  display: flex;
  width: 100%;
  height: calc(40vh - 32px);
`

const StyledStatusBar = styled(StatusBar)`
  width: 100%;
  height: 32px;
`

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
)
