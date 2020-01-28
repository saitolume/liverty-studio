import { app, BrowserWindow } from 'electron'
import { inatallExtension } from './lib/installExtensions'
import './ipc'

let mainWindow: BrowserWindow | null = null

const rendererUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8080'
    : `file://${__dirname}/index.html`

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1050,
    height: 750,
    minWidth: 1050,
    minHeight: 750,
    backgroundColor: '#222',
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  })
  mainWindow.loadURL(rendererUrl)

  mainWindow.on('close', event => {
    event.preventDefault()
    mainWindow?.hide()
  })
}

app.on('ready', async () => {
  createWindow()
  if (process.env.NODE_ENV === 'development') {
    try {
      await inatallExtension()
    } catch (err) {
      console.error(err)
    }
  }
})

app.on('activate', () => {
  if (process.platform === 'darwin') mainWindow?.show()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
