import { app, BrowserWindow } from 'electron'
import loadDevtool from 'electron-load-devtool'
import './icps'
import './server'

let mainWindow: BrowserWindow | null = null

const inatallExtentions = async () => {
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'] as const
  await Promise.all(extensions.map(name => loadDevtool(loadDevtool[name])))
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 728,
    backgroundColor: '#1a1d21',
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  })
  mainWindow.loadURL('http://127.0.0.1:8080')
  return mainWindow
}

app.on('ready', async () => {
  mainWindow = createWindow()
  try {
    await inatallExtentions()
  } catch (err) {
    console.error(err)
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    mainWindow = createWindow()
  }
})
