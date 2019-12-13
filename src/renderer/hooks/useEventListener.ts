import { useEffect } from 'react'

export const useEventListener = (type: keyof WindowEventMap, listener: Function) => {
  useEffect(() => {
    document.body.addEventListener(type, listener as EventListener)
    return () => {
      document.body.removeEventListener(type, listener as EventListener)
    }
  }, [listener, type])
}
