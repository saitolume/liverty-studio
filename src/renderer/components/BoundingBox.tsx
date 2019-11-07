// import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
// import { Sprite as Image, Graphics as Polygon, PixiComponent } from '@inlet/react-pixi'
// import { Sprite, Graphics } from 'pixi.js'
// import { Source } from '../domains/source'

// type Position = {
//   x: number
//   y: number
// }

// type InteractionEvent = {
//   currentTarget: Sprite
//   data: InteractionData
//   stopPropagationHint: boolean
//   stopped: boolean
//   stopPropagation: () => void
//   stopsPropagatingAt: unknown
//   stopsPropagatingHist: boolean
//   target: Sprite
//   type: Event['type']
// }

// type InteractionData = {
//   button: number
//   buttons: number
//   global: Position
//   height: number
//   identifier: number
//   isPrimary: true
//   getLocalPosition: (currentTarget: unknown) => Position
//   originalEvent: PointerEvent
//   pointerType: string
//   pressure: number
//   rotationAngle: undefined
//   tangentialPressure: number
//   target: null
//   tiltX: number
//   tiltY: number
//   twist: number
//   width: number
//   pointerId: number
// }

// type HandleProps = {
//   onMouseDown: () => void
//   onMouseLeave: () => void
//   onMouseMove: (event: InteractionEvent) => void
//   onMouseUp: () => void
//   x: number
//   y: number
// }

// const Handle = PixiComponent<HandleProps, Graphics>('Handle', {
//   create: () => new Graphics(),
//   didMount: instance => {
//     /* eslint-disable @typescript-eslint/no-explicit-any */
//     const { onMouseDown, onMouseLeave, onMouseMove, onMouseUp }: HandleProps = instance as any
//     instance
//       .addListener('mousedown', onMouseDown, false)
//       .addListener('mouseup', onMouseUp, false)
//       .addListener('mouseupoutside', onMouseLeave, false)
//       .addListener('mousemove', onMouseMove, false)
//   },
//   willUnmount: instance => {
//     instance.removeAllListeners()
//   },
//   applyProps: (instance, _, props) => {
//     const { x, y, onMouseDown, onMouseLeave, onMouseMove, onMouseUp } = props
//     instance.interactive = true
//     instance.buttonMode = true
//     instance.clear()
//     instance.lineStyle(2, 0xffffff)
//     instance.beginFill(0xffffff)
//     instance.drawRect(x, y, 12, 12)
//     instance.endFill()
//     ;(instance as any).onMouseDown = onMouseDown
//     ;(instance as any).onMouseLeave = onMouseLeave
//     ;(instance as any).onMouseMove = onMouseMove
//     ;(instance as any).onMouseUp = onMouseUp
//     // eslint-enable-next-line @typescript-eslint/no-explicit-any
//   }
// })

// type Props = {
//   source: Source
//   updateSource: (source: Source) => void
// }

// const BoundingBox: React.FC<Props> = ({ source, updateSource }) => {
//   const { x, y, width, height, filepath } = source
//   const ref = useRef<Sprite>(null)
//   const [isDragging, setIsDragging] = useState(false)
//   const [isHandling, setIsHandling] = useState(false)
//   const [offset, setOffset] = useState<Position>({ x: 0, y: 0 })

//   const handles: Position[] = useMemo(
//     () => [
//       { x: x - 6, y: y - 6 },
//       { x: (x + x + width) / 2, y: y - 6 },
//       { x: x + width - 6, y: y - 6 },
//       { x: x - 6, y: (y + y + height) / 2 },
//       { x: x + width - 6, y: (y + y + height) / 2 },
//       { x: x - 6, y: y + height - 6 },
//       { x: (x + x + width) / 2, y: y + height - 6 },
//       { x: x + width - 6, y: y + height - 6 }
//     ],
//     [height, width, x, y]
//   )

//   useEffect(() => {
//     console.log(`isHandling: ${isHandling}`)
//   }, [isHandling])

//   const onHandleStart = () => {
//     setIsHandling(true)
//   }

//   const onHandle = (event: InteractionEvent) => {
//     // console.log(event.target)

//     if (!event.target || !isHandling) return
//     const { clientX, clientY } = event.data.originalEvent
//     console.log(clientX, clientY)
//   }

//   const onHandleEnd = () => {
//     setIsHandling(false)
//   }

//   const onDragStart = useCallback(
//     (event: InteractionEvent) => {
//       const { clientX, clientY } = event.data.originalEvent
//       setOffset({ x: clientX - x, y: clientY - y })
//       setIsDragging(true)
//     },
//     [x, y]
//   )

//   const onDrag = useCallback(
//     (event: InteractionEvent) => {
//       if (!isDragging) return
//       const { clientX, clientY } = event.data.originalEvent
//       updateSource({ ...source, x: clientX - offset.x, y: clientY - offset.y })
//     },
//     [isDragging, offset.x, offset.y, source, updateSource]
//   )

//   const onDragEnd = () => {
//     setIsDragging(false)
//   }

//   const drawPolygon = (g: Graphics) => {
//     g.clear()
//     g.lineStyle(2, 0xffffff)
//     g.drawPolygon([x, y, x + width, y, x + width, y + height, x, y + height])
//     g.endFill()
//   }

//   useEffect(() => {
//     if (!ref.current) return
//     const image = ref.current
//     image.interactive = true
//     image
//       .on('mousedown', onDragStart, false)
//       .on('mouseup', onDragEnd, false)
//       .on('mouseupoutside', onDragEnd, false)
//       .on('mousemove', onDrag, false)
//     return () => {
//       image
//         .off('mousedown', onDragStart)
//         .off('mouseup', onDragEnd)
//         .off('mouseupoutside', onDragEnd)
//         .off('mousemove', onDrag)
//     }
//   }, [onDrag, onDragStart])

//   return (
//     <>
//       <Image
//         ref={(ref as unknown) as React.RefObject<Image> | null}
//         image={`file://${filepath}`}
//         x={x}
//         y={y}
//         width={width}
//         height={height}
//       />
//       <Polygon draw={drawPolygon} />
//       {handles.map(({ x, y }, index) => (
//         <Handle
//           key={index}
//           x={x}
//           y={y}
//           onMouseDown={onHandleStart}
//           onMouseUp={onHandleEnd}
//           onMouseLeave={onHandleEnd}
//           onMouseMove={onHandle}
//         />
//       ))}
//     </>
//   )
// }

// export default BoundingBox
