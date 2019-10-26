import React, { useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import styled from 'styled-components'
import { VRM, VRMSchema } from '@pixiv/three-vrm'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const VrmModel: React.FC<{ url: string }> = ({ url }) => {
  const ref = useRef<HTMLDivElement>(null)
  const camera = useRef<THREE.PerspectiveCamera>()
  const clock = useRef<THREE.Clock>(new THREE.Clock())
  const loader = useRef(new GLTFLoader())
  const renderer = useRef<THREE.WebGLRenderer>(new THREE.WebGLRenderer())
  const scene = useRef<THREE.Scene>()
  const light = useRef<THREE.DirectionalLight>()
  const [vrm, setVrm] = useState<VRM>()
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })

  const initRenderer = useCallback(() => {
    if (!ref.current) return
    const width = ref.current.clientWidth
    const height = ref.current.clientHeight
    renderer.current.setSize(width, height)
    setSize({ width, height })

    ref.current.appendChild(renderer.current.domElement)
  }, [])

  const initCamera = useCallback(() => {
    camera.current = new THREE.PerspectiveCamera(30.0, size.width / size.height, 0.01, 20.0)
    camera.current.position.set(0.0, 0.0, 5.0)
  }, [size.height, size.width])

  const loadVrm = () => {
    loader.current.load(url, async gltf => {
      if (!scene.current) return
      const vrm = await VRM.from(gltf)
      scene.current.add(vrm.scene)
      vrm.scene.rotation.y = Math.PI

      if (!vrm.lookAt || !vrm.lookAt.target) return
      vrm.lookAt.target = camera.current

      if (!vrm.humanoid) return
      const head = vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.Head)
      if (!head || !camera.current) return
      camera.current.position.set(0.0, head.getWorldPosition(new THREE.Vector3()).y, 2.0)
      setVrm(vrm)
    })
  }

  const update = () => {
    requestAnimationFrame(update)
    if (!clock.current) return
    const delta = clock.current.getDelta()

    if (vrm) {
      vrm.scene.rotation.y = Math.PI * Math.sin(clock.current.getElapsedTime())
      vrm.update(delta)
    }

    if (!scene.current || !camera.current) return
    renderer.current.render(scene.current, camera.current)
  }

  useEffect(() => {
    initRenderer()
    initCamera()
    scene.current = new THREE.Scene()
    light.current = new THREE.DirectionalLight(0xffffff)
    light.current.position.set(1.0, 1.0, 1.0).normalize()
    scene.current.add(light.current)
    clock.current.start()
    loadVrm()
    update()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Wrapper ref={ref}></Wrapper>
}

const Wrapper = styled.div`
  background-color: #000;
  border-left: 1px solid #fff;
  width: calc(100% - 1px);
  height: 100%;
`

export default VrmModel
