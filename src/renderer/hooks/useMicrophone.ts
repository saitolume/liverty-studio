import { useCallback, useEffect, useMemo, useState } from 'react'

export type Microphone = {
  audioTrack: MediaStreamTrack | null
  deviceName: string
}

export const useMicrophone = () => {
  const [audioTrack, setAudioTrack] = useState<MediaStreamTrack | null>(null)
  const [deviceName, setDeviceName] = useState('')

  const microphone = useMemo<Microphone>(() => ({ audioTrack, deviceName }), [
    audioTrack,
    deviceName
  ])

  const getMicrophone = useCallback(async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const [{ deviceId, label }] = devices.filter(device => device.kind === 'audioinput')
    setDeviceName(label)
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId },
      video: false
    })
    const [audioTrack] = stream.getAudioTracks()
    setAudioTrack(audioTrack)
  }, [])

  useEffect(() => {
    ;(async () => {
      await getMicrophone()
    })()
  }, [getMicrophone])

  return microphone
}
