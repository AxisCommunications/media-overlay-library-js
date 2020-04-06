import React, { useContext, useMemo } from 'react'
import styled from 'styled-components'

import { FoundationContext, CoordArray, bbox } from 'media-overlay-library'

const SvgRectangle = styled.rect`
  fill: rgb(0.5, 0.5, 0.5, 0.2);
  stroke: grey;
`

/*
 * Rectangle
 *
 * Renders an SVG <rect> at some specified user coordinate.
 */

interface RectangleProps extends React.SVGProps<SVGRectElement> {
  readonly pos: CoordArray
}

export const Rectangle: React.FC<RectangleProps> = ({
  pos,
  ...rectangleProps
}) => {
  const { toSvgBasis } = useContext(FoundationContext)

  const { top, left, right, bottom } = useMemo(() => {
    const { x, y, width, height } = bbox(pos)
    const [left, top] = toSvgBasis([x, y])
    const [right, bottom] = toSvgBasis([width + x, height + y])

    return { top, left, right, bottom }
  }, [pos])

  return (
    <SvgRectangle
      x={top}
      y={left}
      width={right}
      height={bottom}
      {...rectangleProps}
    />
  )
}
