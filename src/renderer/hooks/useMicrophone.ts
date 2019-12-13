import { useCallback, useEffect, useRef, useState } from 'react'

export type Microphone = {
  audioTrack: MediaStreamTrack | null
  deviceName: string
  isMuted: boolean
  mute: () => void
  unmute: () => void
}

export const useMicrophone = (): Microphone => {
  const audioTrack = useRef<Microphone['audioTrack']>(null)
  const [deviceName, setDeviceName] = useState<Microphone['deviceName']>('')
  const [isMuted, setMuted] = useState<Microphone['isMuted']>(false)

  const getMicrophone = useCallback(async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const [{ deviceId, label }] = devices.filter(device => device.kind === 'audioinput')
    setDeviceName(label)
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId },
      video: false
    })
    const [microphone] = stream.getAudioTracks()
    audioTrack.current = microphone
  }, [])

  const mute = () => {
    if (!audioTrack.current || isMuted) return
    audioTrack.current.enabled = false
    setMuted(true)
  }

  const unmute = () => {
    if (!audioTrack.current || !isMuted) return
    audioTrack.current.enabled = true
    setMuted(false)
  }

  useEffect(() => {
    ;(async () => {
      await getMicrophone()
    })()
  }, [getMicrophone])

  return {
    audioTrack: audioTrack.current,
    deviceName,
    isMuted,
    mute,
    unmute
  }
}
