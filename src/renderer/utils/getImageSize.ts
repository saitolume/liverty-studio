import { ipcRenderer } from 'electron'
import { REQ_IMAGE_SIZE, RES_IMAGE_SIZE } from './../../constants/channels'

type Size = {
  width: number
  height: number
}

export const getImageSize = (imagePath: string) =>
  new Promise<Size>(resolve => {
    ipcRenderer.send(REQ_IMAGE_SIZE, imagePath)
    ipcRenderer.on(RES_IMAGE_SIZE, (_: unknown, size: Size) => {
      resolve(size)
    })
  })
