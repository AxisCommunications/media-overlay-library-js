import React, { useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import {
  Coord,
  useDraggable,
  DraggableHandler,
  FoundationContext,
  LinerContext,
} from 'media-overlay-library'

const SvgText = styled.text<{ readonly dragging: boolean }>`
  user-select: none;
  cursor: ${({ dragging }) => (dragging ? 'grabbing' : 'grab')};
`

interface TextProps extends React.SVGProps<SVGTextElement> {
  readonly x: number
  readonly y: number
  readonly onChangePos: (pos: Coord) => void
}

export const Text: React.FC<TextProps> = ({
  x: userX,
  y: userY,
  onChangePos,
  children,
  ...props
}) => {
  const { toSvgBasis, toUserBasis } = useContext(FoundationContext)
  const { clampBBox } = useContext(LinerContext)

  const [dragging, setDragging] = useState(false)

  const { subscribe, unsubscribe, start: startDragging } = useDraggable()
  const textRef = useRef<SVGTextElement>(null)

  useEffect(() => {
    const textEl = textRef.current
    if (textEl === null) {
      return
    }

    // Note: this doesn't work correctly since the bottom of the bounding
    // box does not match the origin of the baseline of the text, but it
    // works reliably enough to limit the text box within the Liner.
    const { x: x0, y: y0 } = textEl.getBBox()
    let __dragStarted = false
    const updatePosition: DraggableHandler = ({ vector: [tx, ty] }, ended) => {
      if (!__dragStarted) {
        __dragStarted = true
        setDragging(true)
      }
      const { width, height } = textEl.getBBox()
      const newBBox = clampBBox({ x: x0 + tx, y: y0 + ty, width, height })
      const newSvgPos: Coord = [newBBox.x, newBBox.y + height]
      textEl.setAttribute('x', String(newSvgPos[0]))
      textEl.setAttribute('y', String(newSvgPos[1]))
      if (ended) {
        setDragging(false)
        onChangePos(toUserBasis(newSvgPos))
      }
    }
    subscribe(updatePosition)
    return () => {
      unsubscribe()
    }
  }, [userX, userY])

  const [x, y] = toSvgBasis([userX, userY])

  return (
    <SvgText
      name="text"
      ref={textRef}
      x={x}
      y={y}
      {...props}
      onPointerDown={startDragging}
      dragging={dragging}
    >
      {children}
    </SvgText>
  )
}
