import { ipcRenderer } from 'electron'

type Size = {
  width: number
  height: number
}

export const getImageSize = (imagePath: string) =>
  new Promise<Size>(resolve => {
    ipcRenderer.send('req-image-size', imagePath)
    ipcRenderer.on('res-image-size', (_: unknown, size: Size) => {
      resolve(size)
    })
  })
