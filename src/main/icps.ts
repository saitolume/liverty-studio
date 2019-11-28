import { ipcMain } from 'electron'
import { imageSize } from 'image-size'
import { promisify } from 'util'
import { RES_IMAGE_SIZE, REQ_IMAGE_SIZE } from './../constants/channels'

const sizeOf = promisify(imageSize)

// Calc image size from image path
ipcMain.on(REQ_IMAGE_SIZE, async (event, imagePath) => {
  try {
    const size = await sizeOf(imagePath)
    event.reply(RES_IMAGE_SIZE, size)
  } catch (err) {
    console.error(err)
  }
})
