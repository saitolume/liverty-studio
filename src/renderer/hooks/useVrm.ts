import { useRef, useState } from 'react'
import { useThree } from 'react-three-fiber'
import { VRMPose, VRM } from '@pixiv/three-vrm'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import pose from '../../config/pose.json'

export const useVrm = () => {
  const { camera } = useThree()
  const { current: loader } = useRef(new GLTFLoader())
  const [vrm, setVrm] = useState<VRM | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const loadVrm = (url: string) => {
    setIsLoading(true)
    loader.load(url, async gltf => {
      const vrm = await VRM.from(gltf)
      vrm.humanoid?.setPose((pose as unknown) as VRMPose)
      if (vrm.lookAt) vrm.lookAt.target = camera
      setVrm(vrm)
    })
    setIsLoading(false)
  }

  const resetVrm = () => {
    setVrm(null)
  }

  return { vrm, isLoading, loadVrm, resetVrm }
}
