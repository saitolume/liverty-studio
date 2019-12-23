type FaceFilterInitArgs = {
  canvas: HTMLCanvasElement
  NNCpath: string
  followZRot: boolean
  maxFacedDetected: number
  callbackReady: (error: unknown) => void
  callbackTrack: (state: FaceFilterState) => void
}

export type FaceFilterState = {
  detected: number
  expressions: number[]
  rx: number
  ry: number
  rz: number
  s: number
  x: number
  y: number
}

declare module 'facefilter' {
  export default class JeelizFaceFilter {
    static init: (value: FaceFilterInitArgs) => void
  }
}
