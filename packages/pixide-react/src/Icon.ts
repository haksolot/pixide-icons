'use client';

import { createElement, forwardRef, useMemo } from 'react';
import { svgAttributes, GRID_SIZE } from './defaultAttributes';
import { PixelGrid, PixideProps } from './types';
import { mergeClasses, hasA11yProp } from '@lucide/shared';
import { usePixideContext } from './context';
import { unpackGrid, gridToRects } from './grid';

interface IconComponentProps extends PixideProps {
  pixelGrid: PixelGrid;
}

const Icon = forwardRef<SVGSVGElement, IconComponentProps>(
  ({ color, size, className = '', children, pixelGrid, ...rest }, ref) => {
    const {
      size: contextSize = GRID_SIZE,
      color: contextColor = 'currentColor',
      className: contextClass = '',
    } = usePixideContext() ?? {};

    const resolvedColor = color ?? contextColor;

    const rects = useMemo(() => {
      const grid = unpackGrid(pixelGrid);
      return gridToRects(grid);
    }, [pixelGrid]);

    const resolvedSize = size ?? contextSize ?? svgAttributes.width;

    return createElement(
      'svg',
      {
        ref,
        ...svgAttributes,
        width: resolvedSize,
        height: resolvedSize,
        fill: resolvedColor,
        className: mergeClasses('pixide', contextClass, className),
        ...(!children && !hasA11yProp(rest) && { 'aria-hidden': 'true' }),
        ...rest,
      },
      [
        ...rects.map(({ x, y }) =>
          createElement('rect', { key: `${x}-${y}`, x, y, width: 1, height: 1 }),
        ),
        ...(Array.isArray(children) ? children : [children]),
      ],
    );
  },
);

export default Icon;
