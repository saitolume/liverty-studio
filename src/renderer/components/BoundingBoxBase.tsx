import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { Source } from '../domains/source'
import { useSources } from '../hooks/useSources'

type Handle = {
  x: number
  y: number
  position:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'center-left'
    | 'center-right'
    | 'bottom-right'
    | 'bottom-center'
    | 'bottom-left'
}

export type BoundingBoxBaseProps = {
  source: Source
}

const BoundingBoxBase: React.FC<BoundingBoxBaseProps> = ({ children, source }) => {
  const ref = useRef<SVGGElement>(null)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [isHandling, setIsHandling] = useState<boolean>(false)
  const [isSelected, setIsSelected] = useState<boolean>(false)
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const { updateSource } = useSources()

  const { width, height, x, y } = source
  const handleWidth = width - 9
  const handleHeight = height - 9
  const handleX = x + 1
  const handleY = y + 1

  const handles: Handle[] = useMemo(
    () => [
      { position: 'top-left', x: handleX, y: handleY },
      { position: 'top-center', x: (handleX + handleWidth) / 2, y: handleY },
      { position: 'top-right', x: handleWidth, y: handleY },
      { position: 'center-left', x: handleX, y: (handleY + handleHeight) / 2 },
      { position: 'center-right', x: handleWidth, y: (handleY + handleHeight) / 2 },
      { position: 'bottom-left', x: handleX, y: handleHeight },
      { position: 'bottom-center', x: (handleX + handleWidth) / 2, y: handleHeight },
      { position: 'bottom-right', x: handleWidth, y: handleHeight }
    ],
    [handleX, handleY, handleWidth, handleHeight]
  )

  const onHandle = useCallback(
    (event: React.MouseEvent<SVGRectElement, MouseEvent>, position: Handle['position']) => {
      event.stopPropagation()
      event.preventDefault()
      if (!isHandling) return

      switch (position) {
        case 'top-left':
          updateSource({ ...source, x: event.clientX - 4, y: event.clientY - 4 })
          break
        case 'top-center':
          updateSource({ ...source, y: event.clientY - 4 })
          break
        case 'top-right':
          updateSource({ ...source, width: event.clientX + 4, y: event.clientY - 4 })
          break
        case 'center-left':
          updateSource({ ...source, x: event.clientX - 4 })
          break
        case 'center-right':
          updateSource({ ...source, width: event.clientX + 4 })
          break
        case 'bottom-right':
          updateSource({ ...source, width: event.clientX + 4, height: event.clientY + 4 })
          break
        case 'bottom-center':
          updateSource({ ...source, height: event.clientY + 4 })
          break
        case 'bottom-left':
          updateSource({ ...source, x: event.clientX - 4, height: event.clientY + 4 })
          break
      }
    },
    [isHandling, updateSource, source]
  )

  const onDrag = useCallback(
    (event: React.MouseEvent<SVGGElement, MouseEvent>) => {
      if (!isDragging) return
      updateSource({
        ...source,
        x: event.clientX - offset.x,
        y: event.clientY - offset.y,
        width: event.clientX - offset.x + width - x,
        height: event.clientY - offset.y + height - y
      })
    },
    [height, isDragging, offset.x, offset.y, updateSource, source, width, x, y]
  )

  const onMouseDown = (event: React.MouseEvent<SVGGElement, MouseEvent>) => {
    setIsDragging(true)
    setOffset({ x: event.clientX - x, y: event.clientY - y })
  }

  const onOutsideClick = (event: MouseEvent) => {
    if (ref.current && event.target && ref.current.contains(event.target as Node)) return
    setIsSelected(false)
  }

  useEffect(() => {
    document.body.addEventListener('mousedown', onOutsideClick)
    return () => {
      document.body.removeEventListener('mousedown', onOutsideClick)
    }
  }, [])

  return (
    <Wrapper
      ref={ref}
      onClick={() => setIsSelected(true)}
      onMouseDown={onMouseDown}
      onMouseMove={onDrag}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}>
      {children}
      {isSelected && (
        <>
          <polygon
            points={`
            ${x + 4} ${y + 4} ${width - 4} ${y + 4} ${width - 4} ${height - 4} ${x + 4} ${height -
              4}
          `}
            stroke="#fff"
            strokeDasharray="3"
            fill="none"
          />
          {handles.map(({ x, y, position }, index) => (
            <g key={index}>
              <rect x={x} y={y} width="8" height="8" fill="#fff" stroke="black" strokeWidth="1" />
              <Handle
                x={x - 12}
                y={y - 12}
                position={position}
                width="32"
                height="32"
                fill="transparent"
                onMouseMove={event => onHandle(event, position)}
                onMouseLeave={() => setIsHandling(false)}
                onMouseUp={() => setIsHandling(false)}
                onMouseDown={() => setIsHandling(true)}
              />
            </g>
          ))}
        </>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.g`
  cursor: move;
`

const Handle = styled.rect<{ position: Handle['position'] }>`
  ${({ position }) => {
    switch (position) {
      case 'top-left':
      case 'bottom-right':
        return css`
          cursor: nwse-resize;
        `
      case 'top-center':
      case 'bottom-center':
        return css`
          cursor: ns-resize;
        `
      case 'top-right':
      case 'bottom-left':
        return css`
          cursor: nesw-resize;
        `
      case 'center-left':
      case 'center-right':
        return css`
          cursor: ew-resize;
        `
    }
  }}
`

export default BoundingBoxBase
