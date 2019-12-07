import { app, BrowserWindow } from 'electron'
import { inatallExtension } from './lib/extensions'
import './ipc'

let mainWindow: BrowserWindow | null = null

const createWindow = () => {
  const window = new BrowserWindow({
    width: 1024,
    height: 728,
    backgroundColor: '#222',
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  })
  window.loadURL('http://127.0.0.1:8080')
  return window
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
