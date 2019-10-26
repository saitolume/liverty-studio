export type SourceType = 'image' | 'text'

export type Source = {
  id: string
  type: SourceType
  name: string
  content?: string
  filepath?: string
  width: number
  height: number
  x: number
  y: number
}
