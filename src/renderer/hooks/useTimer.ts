import { useCallback, useEffect, useRef, useState } from 'react'

export const useTimer = (isActive: boolean) => {
  const intervalId = useRef<number>()
  const [time, setTime] = useState(0)

  const setTimer = useCallback(() => {
    intervalId.current = setInterval(() => {
      setTime(x => x + 1)
    }, 1000)
  }, [])

  useEffect(() => {
    if (isActive && !intervalId.current) setTimer()
  }, [isActive, setTimer])

  useEffect(() => {
    if (!isActive) {
      clearInterval(intervalId.current)
      setTime(0)
    }
  }, [isActive])

  return { time }
}
