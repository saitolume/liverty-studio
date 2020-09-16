import { ipcRenderer } from 'electron'
import {
  GET_IMAGE_SIZE,
  SEND_STREAM_KEY,
  START_SERVER,
  TERMINATE_SERVER,
} from '../constants/channels'

type Size = {
  width: number
  height: number
}

export const getImageSize = async (imagePath: string) => {
  const size: Size = await ipcRenderer.invoke(GET_IMAGE_SIZE, imagePath)
  return size
}

export const sendStreamKey = async (streamKey: string) => {
  await ipcRenderer.invoke(SEND_STREAM_KEY, streamKey)
}

export const startServer = async () => {
  await ipcRenderer.invoke(START_SERVER)
}

export const terminateServer = async () => {
  await ipcRenderer.invoke(TERMINATE_SERVER)
}
