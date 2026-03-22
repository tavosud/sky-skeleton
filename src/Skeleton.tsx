import React, { CSSProperties, ElementType, forwardRef, useEffect, useRef, useState } from 'react';
import './Skeleton.css';
import { useSkeletonTheme } from './SkeletonTheme';

/**
 * Shape variant of the skeleton placeholder.
 * - `'rect'`    — rectangular block (cards, images, banners)
 * - `'circle'`  — circular shape (avatars, profile pictures)
 * - `'text'`    — narrow text line; combine with `count` for paragraphs
 */
export type SkeletonVariant = 'rect' | 'circle' | 'text';

/**
 * Visual animation style applied to the skeleton.
 * - `'shimmer'` — an animated highlight sweeps across the surface (GPU-accelerated, default)
 * - `'pulse'`   — the element gently fades in and out
 */
export type SkeletonEffect = 'shimmer' | 'pulse';

/** Merges multiple refs into a single callback ref. */
function mergeRefs<T>(...refs: (React.Ref<T> | null | undefined)[]): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as { current: T | null }).current = value;
      }
    });
  };
}

/** Returns `true` while the element is intersecting the viewport; pauses shimmer when hidden. */
function useIsVisible(ref: React.RefObject<HTMLElement>): boolean {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return visible;
}

export interface SkeletonProps {
  /**
   * Controls whether the skeleton or the actual content is displayed.
   * When `false`, the component renders its `children` unchanged.
   * @default true
   */
  loading?: boolean;

  /**
   * Shape of the skeleton placeholder.
   * @default 'rect'
   */
  variant?: SkeletonVariant;

  /**
   * HTML element or React component to render as the skeleton root.
   * Use this to keep the DOM semantically correct.
   * @example `as="div"` | `as="li"` | `as="p"`
   * @default 'span'
   */
  as?: ElementType;

  /**
   * Width of the skeleton element.
   * - Numbers are converted to pixels: `200` → `"200px"`
   * - Strings are used as-is: `"50%"`, `"12rem"`
   */
  width?: string | number;

  /**
   * Height of the skeleton element.
   * - Numbers are converted to pixels: `20` → `"20px"`
   * - Strings are used as-is: `"1.5rem"`, `"auto"`
   * - For `variant="circle"`, omitting `height` automatically copies `width`.
   */
  height?: string | number;

  /**
   * Border radius of the skeleton element.
   * - Numbers are converted to pixels: `8` → `"8px"`
   * - Strings are used as-is: `"50%"`, `"1rem"`
   * - Overrides the `--skeleton-border-radius` CSS variable for this instance.
   */
  borderRadius?: string | number;

  /**
   * Number of skeleton lines to render. Applies whenever `variant="text"`.
   * - `count={1}` renders a single line (default)
   * - `count={3}` renders three lines, with the last at 80% width to mimic
   *   a real paragraph ending
   * @default 1
   */
  count?: number;

  /**
   * Duration of one animation cycle in seconds.
   * Overrides the `--skeleton-animation-duration` CSS variable for this instance.
   * @example `speed={2}` for a slower, subtler animation
   * @default 1.4
   */
  speed?: number;

  /**
   * Visual effect for the skeleton animation.
   * - `'shimmer'` — a highlight sweeps across the surface (GPU-accelerated, default)
   * - `'pulse'`   — the element fades in and out
   * @default 'shimmer'
   */
  effect?: SkeletonEffect;

  /**
   * Animation-delay increment (in seconds) between each line when
   * `variant="text"` and `count > 1`. Creates a staggered wave effect.
   * @example `stagger={0.1}` → delays of 0s, 0.1s, 0.2s … per line
   * @default 0
   */
  stagger?: number;

  /**
   * Enables or disables the skeleton animation.
   * Set to `false` to render a static placeholder.
   * @default true
   */
  animate?: boolean;

  /**
   * Additional CSS class name appended to the skeleton element.
   */
  className?: string;

  /**
   * Inline styles applied directly to the skeleton element.
   * Values provided here take precedence over `width`/`height` props.
   */
  style?: CSSProperties;

  /**
   * Accessible label read by screen readers while the skeleton is visible.
   * @default "Loading..."
   */
  'aria-label'?: string;

  /**
   * Content rendered when `loading` is `false`.
   */
  children?: React.ReactNode;
}

function normalizeSize(value: string | number | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

type SkeletonItemProps = Required<Pick<SkeletonProps, 'variant'>> &
  Pick<SkeletonProps, 'as' | 'width' | 'height' | 'borderRadius' | 'speed' | 'effect' | 'className' | 'style' | 'animate' | 'aria-label'> & {
    /** Per-item animation-delay in seconds (stagger effect). */
    delay?: number;
  };

const SkeletonItem = forwardRef<HTMLElement, SkeletonItemProps>(function SkeletonItem({
  variant = 'rect',
  as: Tag = 'span',
  width,
  height,
  borderRadius,
  speed,
  delay,
  effect = 'shimmer',
  className,
  style: styleProp,
  animate = true,
  'aria-label': ariaLabel = 'Loading...',
}, forwardedRef) {
  const innerRef = useRef<HTMLElement>(null);
  const isVisible = useIsVisible(innerRef);

  // Auto-square circle: when only width is given, mirror it as height
  const resolvedHeight =
    variant === 'circle' && height === undefined && width !== undefined ? width : height;

  const cssVars: Record<string, string> = {};
  if (speed !== undefined) {
    cssVars['--skeleton-animation-duration'] = `${speed}s`;
  }
  if (borderRadius !== undefined) {
    cssVars['--skeleton-border-radius'] =
      typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius;
  }
  if (delay !== undefined && delay > 0) {
    cssVars['--skeleton-animation-delay'] = `${delay}s`;
  }

  const style: CSSProperties = {
    width: normalizeSize(width),
    height: normalizeSize(resolvedHeight),
    ...cssVars,
    ...styleProp,
  };

  const classes = [
    'skeleton',
    `skeleton--${variant}`,
    `skeleton--${effect}`,
    !animate && 'skeleton--no-animate',
    animate && !isVisible && 'skeleton--paused',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const El: any = Tag;
  return (
    <El
      ref={mergeRefs(innerRef, forwardedRef)}
      role="progressbar"
      aria-busy="true"
      aria-label={ariaLabel}
      className={classes}
      style={style}
    />
  );
});

/**
 * Animated content placeholder shown while data is loading.
 *
 * @example
 * // Single rect (default)
 * <Skeleton width={300} height={20} />
 *
 * // Paragraph of 3 text lines
 * <Skeleton variant="text" count={3} stagger={0.08} />
 *
 * // Avatar circle
 * <Skeleton variant="circle" width={48} />
 */
export const Skeleton = forwardRef<HTMLElement, SkeletonProps>(function Skeleton(props, ref) {
  const theme = useSkeletonTheme();

  const {
    loading = true,
    variant = theme.variant ?? 'rect',
    as,
    width,
    height,
    borderRadius = theme.borderRadius,
    count = 1,
    speed = theme.speed,
    effect = theme.effect ?? 'shimmer',
    stagger = 0,
    animate = theme.animate ?? true,
    className,
    style,
    'aria-label': ariaLabel,
    children,
  } = props;

  if (!loading) {
    return <>{children}</>;
  }

  const itemProps: Omit<SkeletonItemProps, 'delay'> = {
    variant,
    as,
    width,
    height,
    borderRadius,
    speed,
    effect,
    animate,
    className,
    style,
    'aria-label': ariaLabel,
  };

  if (variant === 'text') {
    return (
      <>
        {Array.from({ length: count }, (_, i) => (
          <SkeletonItem
            key={i}
            {...itemProps}
            variant="text"
            delay={stagger > 0 ? i * stagger : undefined}
            ref={i === 0 ? ref : undefined}
          />
        ))}
      </>
    );
  }

  return <SkeletonItem {...itemProps} ref={ref} />;
});

export default Skeleton;

