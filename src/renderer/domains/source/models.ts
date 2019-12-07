type SourceBase = {
  id: string
  name: string
  width: number
  height: number
  x: number
  y: number
}

interface SourceImage extends SourceBase {
  type: 'image'
  filepath: string
}

// interface SourceText extends SourceBase {
//   type: 'text'
//   content: string
// }

export type Source = SourceImage
