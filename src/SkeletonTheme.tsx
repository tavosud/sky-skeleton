import React, { createContext, useContext, CSSProperties } from 'react';
import { SkeletonVariant, SkeletonEffect } from './Skeleton';

export interface SkeletonThemeContextValue {
  /**
   * Base background color of the skeleton.
   * Overrides the `--skeleton-base-color` CSS variable.
   */
  baseColor?: string;

  /**
   * Color of the shimmer highlight.
   * Overrides the `--skeleton-highlight-color` CSS variable.
   */
  highlightColor?: string;

  /**
   * Duration of one animation cycle in seconds.
   * @default 1.4
   */
  speed?: number;

  /**
   * Border radius applied to `rect` and `text` variants.
   * Numbers are treated as `px`.
   * @default 4
   */
  borderRadius?: string | number;

  /**
   * When `false`, all skeletons inside the theme render without animation.
   * @default true
   */
  animate?: boolean;

  /**
   * Default animation effect for all Skeleton children.
   * @default 'shimmer'
   */
  effect?: SkeletonEffect;

  /**
   * Default variant for all Skeleton children.
   * @default 'rect'
   */
  variant?: SkeletonVariant;
}

const SkeletonThemeContext = createContext<SkeletonThemeContextValue>({});

/** Read the nearest SkeletonTheme context. */
export function useSkeletonTheme(): SkeletonThemeContextValue {
  return useContext(SkeletonThemeContext);
}

export interface SkeletonThemeProps extends SkeletonThemeContextValue {
  children: React.ReactNode;
}

/**
 * Sets default values for all `<Skeleton>` components in its subtree.
 * Also injects CSS custom properties so colors and speed are applied
 * without any JavaScript per-instance overhead.
 *
 * Uses `display: contents` on the CSS-variable wrapper so it never
 * breaks flex, grid, or any other layout context.
 *
 * @example
 * <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5" speed={1.8}>
 *   <Skeleton />
 *   <Skeleton variant="circle" width={48} />
 * </SkeletonTheme>
 */
export function SkeletonTheme({
  children,
  baseColor,
  highlightColor,
  speed,
  borderRadius,
  animate,
  effect,
  variant,
}: SkeletonThemeProps) {
  const cssVars: CSSProperties = {};

  if (baseColor !== undefined) {
    (cssVars as Record<string, string>)['--skeleton-base-color'] = baseColor;
  }
  if (highlightColor !== undefined) {
    (cssVars as Record<string, string>)['--skeleton-highlight-color'] = highlightColor;
  }
  if (speed !== undefined) {
    (cssVars as Record<string, string>)['--skeleton-animation-duration'] = `${speed}s`;
  }
  if (borderRadius !== undefined) {
    const r = typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;
    (cssVars as Record<string, string>)['--skeleton-border-radius'] = r;
  }

  const hasCssVars = Object.keys(cssVars).length > 0;

  return (
    <SkeletonThemeContext.Provider value={{ baseColor, highlightColor, speed, borderRadius, animate, effect, variant }}>
      {hasCssVars ? (
        // display:contents makes the wrapper invisible to layout (flex/grid),
        // while still propagating inherited CSS custom properties.
        <div style={{ ...cssVars, display: 'contents' }}>
          {children}
        </div>
      ) : (
        <>{children}</>
      )}
    </SkeletonThemeContext.Provider>
  );
}

export default SkeletonTheme;
