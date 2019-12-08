import { useCallback, useEffect, useRef, useState } from 'react'

export const useTimer = (isActive: boolean) => {
  const IntervalId = useRef<number>()
  const [time, setTime] = useState(0)

  const setTimer = useCallback(() => {
    IntervalId.current = setInterval(() => {
      setTime(x => x + 1)
    }, 1000)
  }, [])

  useEffect(() => {
    if (isActive && !IntervalId.current) setTimer()
  }, [isActive, setTimer])

  useEffect(() => {
    if (!isActive) {
      clearInterval(IntervalId.current)
      setTime(0)
    }
  }, [isActive])

  return { time }
}
