import React, { useContext } from 'react'
import styled from 'styled-components'

import { FoundationContext, Coord } from 'media-overlay-library'

const SvgEllipse = styled.ellipse`
  fill: rgb(0.5, 0.5, 0.5, 0.2);
  stroke: grey;
`

/*
 * Ellipse
 *
 * Renders an SVG <circle> at some specified user coordinate.
 */

interface EllipseProps extends React.SVGProps<SVGEllipseElement> {
  /**
   * A coordinate pair [x, y] that represents the middle of the ellipse.
   */
  readonly pos: Coord
  /**
   * X-axis radius
   */
  readonly rx: number
  /**
   * Y-axis radius
   */
  readonly ry: number
}

export const Ellipse: React.FC<EllipseProps> = ({
  pos,
  rx,
  ry,
  ...ellipseProps
}) => {
  const { toSvgBasis } = useContext(FoundationContext)

  const [cx, cy] = toSvgBasis(pos)

  return <SvgEllipse cx={cx} cy={cy} rx={rx} ry={ry} {...ellipseProps} />
}
