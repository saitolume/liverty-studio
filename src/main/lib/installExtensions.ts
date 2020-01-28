import loadDevtool from 'electron-load-devtool'

export const inatallExtension = () => {
  const extensions = ['REACT_DEVELOPER_TOOLS'] as const
  return Promise.all(extensions.map(name => loadDevtool(loadDevtool[name])))
}
