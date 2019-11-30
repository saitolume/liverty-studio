import loadDevtool from 'electron-load-devtool'

export const inatallExtension = () => {
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'] as const
  return Promise.all(extensions.map(name => loadDevtool(loadDevtool[name])))
}
