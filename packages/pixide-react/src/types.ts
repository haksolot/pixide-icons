import type { SVGProps, ForwardRefExoticComponent, RefAttributes } from 'react';

/**
 * Base64-encoded bitpacked 24×24 pixel grid (96 chars).
 * Each bit = 1 pixel, row-major, MSB first within each byte.
 */
export type PixelGrid = string;

export type SVGAttributes = Partial<SVGProps<SVGSVGElement>>;
type ElementAttributes = RefAttributes<SVGSVGElement> & SVGAttributes;

export interface PixideProps extends ElementAttributes {
  /** Icon display size in px. Default: 24 */
  size?: string | number;
  /** Icon color. Defaults to currentColor. */
  color?: string;
}

/** @deprecated Use PixideProps */
export type LucideProps = PixideProps;

export type PixideIcon = ForwardRefExoticComponent<
  Omit<PixideProps, 'ref'> & RefAttributes<SVGSVGElement>
>;

/** @deprecated Use PixideIcon */
export type LucideIcon = PixideIcon;
