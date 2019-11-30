import { app, BrowserWindow } from 'electron'
import { inatallExtension } from './lib/extensions'
import './ipc'

let mainWindow: BrowserWindow | null = null

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
    await inatallExtension()
  } catch (err) {
    console.error(err)
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    mainWindow = createWindow()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
