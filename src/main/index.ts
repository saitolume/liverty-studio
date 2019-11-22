import { app, ipcMain, BrowserWindow } from 'electron'
import loadDevtool from 'electron-load-devtool'
import { sizeOf } from './utils/sizeOf'
import { RES_IMAGE_SIZE, REQ_IMAGE_SIZE } from './../constants/channels'

let mainWindow: BrowserWindow | null = null

const inatallExtentions = () => {
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'] as const
  return Promise.all(extensions.map(name => loadDevtool(loadDevtool[name])))
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
  mainWindow.loadURL('http://127.0.0.1:3000')
  return mainWindow
}

ipcMain.on(REQ_IMAGE_SIZE, async (event, imagePath) => {
  try {
    const { width, height } = await sizeOf(imagePath)
    event.reply(RES_IMAGE_SIZE, { width, height })
  } catch (err) {
    console.error(err)
  }
})

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
