import { useRef, useState, useEffect } from 'react'
import { VRM } from '@pixiv/three-vrm'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export const useVrm = (url: string) => {
  const loader = useRef(new GLTFLoader())
  const [vrm, setVrm] = useState<VRM | null>(null)

  useEffect(() => {
    loader.current.load(url, async gltf => {
      const vrm = await VRM.from(gltf)
      setVrm(vrm)
    })
  }, [url])

  return vrm
}
