import React, { useCallback, useEffect } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import { VRMSchema, VRM } from '@pixiv/three-vrm'
import FaceFilter, { FaceFilterState } from 'facefilter'
import * as THREE from 'three'

type Props = {
  updateVrm: () => void
  vrm: VRM | null
}

const VrmModel: React.FC<Props> = ({ updateVrm, vrm }) => {
  const { aspect, setDefaultCamera } = useThree()

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

  // Set camera
  useEffect(() => {
    const camera = new THREE.PerspectiveCamera(30.0, aspect, 0.01, 20.0)
    camera.position.set(0.0, 1.3, 1.0)
    setDefaultCamera(camera)
  }, [aspect, setDefaultCamera])

  useEffect(() => {
    if (!vrm) return
    FaceFilter.init({
      canvas: document.createElement('canvas'),
      NNCpath: 'https://unpkg.com/facefilter@1.1.1/dist/NNC.json',
      followZRot: true,
      maxFacedDetected: 1,
      callbackReady: err => {
        if (err) {
          console.error(err)
          return
        }
      },
      callbackTrack: handleJeelizTrack
    })
  }, [handleJeelizTrack, vrm])

  useFrame(({ camera, clock, gl, scene }, delta) => {
    if (!vrm) return
    vrm.update(delta)
    const blink = Math.max(0.0, 1.0 - 10.0 * Math.abs((clock.getElapsedTime() % 4.0) - 2.0))
    vrm.blendShapeProxy?.setValue(VRMSchema.BlendShapePresetName.Blink, blink)
    gl.render(scene, camera)
    updateVrm()
  })

  return vrm ? <primitive object={vrm.scene} /> : null
}

export default VrmModel
