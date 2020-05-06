import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'

import {
  FoundationContext,
  CoordArray,
  useDraggable,
  DraggableHandler,
  LinerContext,
} from 'media-overlay-library'

const SvgCircleCorner = styled.circle`
  fill: rgb(0.5, 0.5, 0.5);
  stroke: grey;
`

const SvgCircleHandle = styled.circle`
  fill: rgb(0.5, 0.5, 0.5, 0);

  &:hover {
    fill: rgb(0.5, 0.5, 0.5, 0.6);
  }
`

const SvgLine = styled.line`
  fill: rgb(0.5, 0.5, 0.5, 0.2);
  stroke: grey;
`

interface LineProps {
  /**
   * An array of coordinate pairs [x, y] that represent
   * the two corners of the line.
   */
  readonly pos: CoordArray
  /**
   * Callback with new corner coordinates whenever they
   * changed.
   */
  readonly onChangePos: (newPos: CoordArray) => void
}

export const Line: React.FC<LineProps> = ({ pos, onChangePos }) => {
  const { toSvgBasis, toUserBasis } = useContext(FoundationContext)
  const { clampCoord, clampCoordArray } = useContext(LinerContext)

  const [svgPos, setSvgPos] = useState<CoordArray>(pos.map(toSvgBasis))

  const { subscribe, unsubscribe, start: startDrag } = useDraggable()

  useEffect(() => {
    const initialSvgPos = pos.map(toSvgBasis)

    /**
     * Updates the coordinates when a draggable event is emitted.
     *
     * When the whole polygon is moved (`name` === 'g'), then we
     * translate all points, otherwise we just translated the point
     * that matches the `name`.
     */
    const updatePosition: DraggableHandler = (
      { name, vector: [tx, ty] },
      ended,
    ) => {
      const newSvgPos: CoordArray =
        name === 'g'
          ? clampCoordArray(initialSvgPos.map(([x, y]) => [x + tx, y + ty]))
          : initialSvgPos.map(([x, y], index) =>
              name === `p${index}` ? clampCoord([x + tx, y + ty]) : [x, y],
            )

      if (ended) {
        onChangePos(newSvgPos.map(toUserBasis))
        return
      }
      setSvgPos(newSvgPos)
    }

    /**
     * Subscribe to draggable events with the update function.
     */
    subscribe(updatePosition)

    return () => {
      unsubscribe()
    }
  }, [pos])

  const [[x1, y1], [x2, y2]] = svgPos

  return (
    <g name="g" onPointerDown={startDrag}>
      <SvgLine x1={x1} y1={y1} x2={x2} y2={y2} />
      <SvgCircleCorner r={3} cx={x1} cy={y1} />
      <SvgCircleCorner r={3} cx={x2} cy={y2} />
      <SvgCircleHandle
        name={'p1'}
        r={5}
        cx={x1}
        cy={y1}
        onPointerDown={startDrag}
      />
      <SvgCircleHandle
        name={'p2'}
        r={5}
        cx={x2}
        cy={y2}
        onPointerDown={startDrag}
      />
    </g>
  )
}
