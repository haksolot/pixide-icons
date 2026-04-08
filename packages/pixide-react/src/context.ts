'use client';

import { createContext, createElement, type ReactNode, useContext, useMemo } from 'react';
import { PixideProps } from './types';

type PixideConfig = {
  size: number;
  color: string;
  className: string;
};

const PixideContext = createContext<Partial<PixideConfig>>({});

type PixideProviderProps = {
  children: ReactNode;
} & Partial<PixideConfig>;

export function PixideProvider({ children, size, color, className }: PixideProviderProps) {
  const value = useMemo(
    () => ({ size, color, className }),
    [size, color, className],
  );

  return createElement(PixideContext.Provider, { value }, children);
}

export const usePixideContext = () => useContext(PixideContext);

/** @deprecated Use PixideProvider */
export const LucideProvider = PixideProvider;
/** @deprecated Use usePixideContext */
export const useLucideContext = usePixideContext;
