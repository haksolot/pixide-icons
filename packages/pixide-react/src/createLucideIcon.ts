import { createElement, forwardRef } from 'react';
import { mergeClasses, toKebabCase, toPascalCase } from '@lucide/shared';
import { PixelGrid, PixideProps } from './types';
import Icon from './Icon';

const createPixideIcon = (iconName: string, pixelGrid: PixelGrid) => {
  const Component = forwardRef<SVGSVGElement, PixideProps>(({ className, ...props }, ref) =>
    createElement(Icon, {
      ref,
      pixelGrid,
      className: mergeClasses(
        `pixide-${toKebabCase(toPascalCase(iconName))}`,
        `pixide-${iconName}`,
        className,
      ),
      ...props,
    }),
  );

  Component.displayName = toPascalCase(iconName);

  return Component;
};

/** @deprecated Use createPixideIcon */
export const createLucideIcon = createPixideIcon;

export default createPixideIcon;
