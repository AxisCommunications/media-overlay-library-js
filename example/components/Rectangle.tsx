import React, { useContext } from 'react'
import styled from 'styled-components'

import { FoundationContext, Coord } from 'media-overlay-library'

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
  readonly pos: Coord
}

export const Rectangle: React.FC<RectangleProps> = ({
  pos,
  ...rectangleProps
}) => {
  const { toSvgBasis } = useContext(FoundationContext)

  const [x, y] = toSvgBasis(pos)

  return <SvgRectangle x={x} y={y} {...rectangleProps} />
}
