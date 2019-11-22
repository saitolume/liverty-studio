import { promisify } from 'util'

type SizeOf = (imagePath: string) => Promise<{ width: number; height: number }>
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const sizeOf: SizeOf = promisify(require('image-size'))
