import React, { useCallback, useEffect } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import { VRMSchema, VRMPose } from '@pixiv/three-vrm'
import FaceFilter, { FaceFilterState } from 'facefilter'
import * as THREE from 'three'
import { useVrm } from '../hooks/useVrm'
import pose from '../../config/pose.json'

type Props = {
  url: string
  renderTo2dCanvas: () => void
}

const VrmModel: React.FC<Props> = ({ url, renderTo2dCanvas }) => {
  const vrm = useVrm(url)
  const { aspect, camera, setDefaultCamera } = useThree()
  const facefilterCanvas = document.createElement('canvas')

  const handleJeelizReady = (error: unknown) => {
    if (error) {
      console.error(error)
      return
    }
  }

  const handleJeelizTrack = useCallback(
    (state: FaceFilterState) => {
      if (!vrm) return

      const head = vrm.humanoid?.getBoneNode(VRMSchema.HumanoidBoneName.Head)
      head?.rotation.set(-state.rx, -state.ry, state.rz, 'ZXY')

      const [mouth] = state.expressions
      vrm.blendShapeProxy?.setValue(VRMSchema.BlendShapePresetName.A, mouth)
    },
    [vrm]
  )

  const initializeFaceFilter = useCallback(() => {
    FaceFilter.init({
      canvas: facefilterCanvas,
      NNCpath: 'https://unpkg.com/facefilter@1.1.1/dist/NNC.json',
      followZRot: true,
      maxFacedDetected: 1,
      callbackReady: handleJeelizReady,
      callbackTrack: handleJeelizTrack
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleJeelizTrack])

  // Set camera
  useEffect(() => {
    const camera = new THREE.PerspectiveCamera(30.0, aspect, 0.01, 20.0)
    camera.position.set(0.0, 1.3, 1.0)
    setDefaultCamera(camera)
  }, [aspect, setDefaultCamera])

  // Initializer
  useEffect(() => {
    if (!vrm) return
    vrm.humanoid?.setPose((pose as unknown) as VRMPose)
    if (vrm.lookAt) {
      vrm.lookAt.target = camera
    }
    initializeFaceFilter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initializeFaceFilter, vrm])

  useFrame(({ camera, clock, gl, scene }, delta) => {
    if (!vrm) return
    vrm.update(delta)

    const blink = Math.max(0.0, 1.0 - 10.0 * Math.abs((clock.getElapsedTime() % 4.0) - 2.0))
    vrm.blendShapeProxy?.setValue(VRMSchema.BlendShapePresetName.Blink, blink)

    gl.render(scene, camera)
    renderTo2dCanvas()
  })

  return vrm ? <primitive object={vrm.scene} /> : null
}

export default VrmModel
