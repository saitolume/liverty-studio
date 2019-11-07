import { app, ipcMain, BrowserWindow } from 'electron'
import loadDevtool from 'electron-load-devtool'
import { promisify } from 'util'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sizeOf = promisify(require('image-size'))

let mainWindow: Electron.BrowserWindow | null = null

const inatallExtentions = () => {
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'] as const
  return Promise.all(extensions.map(name => loadDevtool(loadDevtool[name])))
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 728,
    backgroundColor: '#252525',
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  })
  mainWindow.loadURL('http://127.0.0.1:3000')
  return mainWindow
}

ipcMain.on('req-image-size', async (event, imagePath) => {
  try {
    const { width, height } = await sizeOf(imagePath)
    event.reply('res-image-size', { width, height })
  } catch (err) {
    console.error(err)
  }
})

app.on('ready', async () => {
  try {
    await inatallExtentions()
  } catch (err) {
    console.error(err)
  }
  mainWindow = createWindow()
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
