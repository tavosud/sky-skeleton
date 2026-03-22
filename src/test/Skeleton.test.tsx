import React, { createRef } from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Skeleton } from '../Skeleton';
import { SkeletonTheme } from '../SkeletonTheme';

// ─── Skeleton ────────────────────────────────────────────────────────────────

describe('Skeleton', () => {
  it('renders a progressbar when loading=true', () => {
    render(<Skeleton loading={true} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders children when loading=false', () => {
    render(<Skeleton loading={false}><span>Loaded</span></Skeleton>);
    expect(screen.getByText('Loaded')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).toBeNull();
  });

  it('defaults loading to true when prop is omitted', () => {
    render(<Skeleton />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders count lines for variant="text"', () => {
    render(<Skeleton variant="text" count={4} />);
    expect(screen.getAllByRole('progressbar')).toHaveLength(4);
  });

  it('renders a single line for variant="text" count=1', () => {
    render(<Skeleton variant="text" count={1} />);
    expect(screen.getAllByRole('progressbar')).toHaveLength(1);
  });

  it('applies skeleton--circle class for variant="circle"', () => {
    render(<Skeleton variant="circle" />);
    expect(screen.getByRole('progressbar')).toHaveClass('skeleton--circle');
  });

  it('applies skeleton--rect class for variant="rect"', () => {
    render(<Skeleton variant="rect" />);
    expect(screen.getByRole('progressbar')).toHaveClass('skeleton--rect');
  });

  it('applies skeleton--no-animate when animate=false', () => {
    render(<Skeleton animate={false} />);
    expect(screen.getByRole('progressbar')).toHaveClass('skeleton--no-animate');
  });

  it('uses the custom aria-label', () => {
    render(<Skeleton aria-label="Loading article" />);
    expect(screen.getByLabelText('Loading article')).toBeInTheDocument();
  });

  it('defaults aria-label to "Loading..."', () => {
    render(<Skeleton />);
    expect(screen.getByLabelText('Loading...')).toBeInTheDocument();
  });

  it('renders as a custom element via the "as" prop', () => {
    const { container } = render(<Skeleton as="div" />);
    expect(container.querySelector('div.skeleton')).toBeInTheDocument();
  });

  it('applies numeric width as px inline style', () => {
    render(<Skeleton width={200} />);
    expect(screen.getByRole('progressbar')).toHaveStyle({ width: '200px' });
  });

  it('applies string width as-is', () => {
    render(<Skeleton width="50%" />);
    expect(screen.getByRole('progressbar')).toHaveStyle({ width: '50%' });
  });

  it('applies speed as CSS custom property', () => {
    render(<Skeleton speed={2} />);
    const el = screen.getByRole('progressbar') as HTMLElement;
    expect(el.style.getPropertyValue('--skeleton-animation-duration')).toBe('2s');
  });

  it('applies borderRadius as CSS custom property', () => {
    render(<Skeleton borderRadius={8} />);
    const el = screen.getByRole('progressbar') as HTMLElement;
    expect(el.style.getPropertyValue('--skeleton-border-radius')).toBe('8px');
  });

  it('merges extra className', () => {
    render(<Skeleton className="my-class" />);
    expect(screen.getByRole('progressbar')).toHaveClass('my-class');
  });

  // ── effect ──────────────────────────────────────────────────────────────────

  it('defaults to skeleton--shimmer class', () => {
    render(<Skeleton />);
    expect(screen.getByRole('progressbar')).toHaveClass('skeleton--shimmer');
  });

  it('applies skeleton--pulse class for effect="pulse"', () => {
    render(<Skeleton effect="pulse" />);
    const el = screen.getByRole('progressbar');
    expect(el).toHaveClass('skeleton--pulse');
    expect(el).not.toHaveClass('skeleton--shimmer');
  });

  // ── stagger ─────────────────────────────────────────────────────────────────

  it('sets --skeleton-animation-delay on staggered text lines', () => {
    render(<Skeleton variant="text" count={3} stagger={0.1} />);
    const lines = screen.getAllByRole('progressbar') as HTMLElement[];
    expect(lines[0].style.getPropertyValue('--skeleton-animation-delay')).toBe('');
    expect(lines[1].style.getPropertyValue('--skeleton-animation-delay')).toBe('0.1s');
    expect(lines[2].style.getPropertyValue('--skeleton-animation-delay')).toBe('0.2s');
  });

  it('does not set --skeleton-animation-delay when stagger=0', () => {
    render(<Skeleton variant="text" count={2} stagger={0} />);
    const lines = screen.getAllByRole('progressbar') as HTMLElement[];
    expect(lines[1].style.getPropertyValue('--skeleton-animation-delay')).toBe('');
  });

  // ── circle auto-square ───────────────────────────────────────────────────────

  it('auto-sets height from width for circle variant', () => {
    render(<Skeleton variant="circle" width={64} />);
    const el = screen.getByRole('progressbar') as HTMLElement;
    expect(el.style.width).toBe('64px');
    expect(el.style.height).toBe('64px');
  });

  it('does not override explicit height on circle variant', () => {
    render(<Skeleton variant="circle" width={64} height={32} />);
    const el = screen.getByRole('progressbar') as HTMLElement;
    expect(el.style.height).toBe('32px');
  });

  // ── forwardRef ───────────────────────────────────────────────────────────────

  it('forwards ref to the underlying DOM element', () => {
    const ref = createRef<HTMLElement>();
    render(<Skeleton ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current).toHaveClass('skeleton');
  });

  it('forwards ref to the first text line when variant="text"', () => {
    const ref = createRef<HTMLElement>();
    render(<Skeleton ref={ref} variant="text" count={3} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current).toHaveClass('skeleton--text');
  });

  // ── off-screen pause (IntersectionObserver) ──────────────────────────────────

  it('does not add skeleton--paused while element is visible', () => {
    render(<Skeleton />);
    expect(screen.getByRole('progressbar')).not.toHaveClass('skeleton--paused');
  });

  it('adds skeleton--paused when IntersectionObserver reports not intersecting', async () => {
    let triggerIntersection: (entries: Partial<IntersectionObserverEntry>[]) => void = () => {};

    // Must be a real constructor function so `new MockIO(...)` works.
    function MockIO(this: unknown, cb: IntersectionObserverCallback) {
      triggerIntersection = (entries) =>
        cb(entries as IntersectionObserverEntry[], {} as IntersectionObserver);
    }
    MockIO.prototype.observe = vi.fn();
    MockIO.prototype.disconnect = vi.fn();
    MockIO.prototype.unobserve = vi.fn();

    vi.stubGlobal('IntersectionObserver', MockIO);

    render(<Skeleton />);

    await act(async () => {
      triggerIntersection([{ isIntersecting: false }]);
    });

    expect(screen.getByRole('progressbar')).toHaveClass('skeleton--paused');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });
});

// ─── SkeletonTheme ────────────────────────────────────────────────────────────

describe('SkeletonTheme', () => {
  it('passes animate=false to children via context', () => {
    render(
      <SkeletonTheme animate={false}>
        <Skeleton />
      </SkeletonTheme>
    );
    expect(screen.getByRole('progressbar')).toHaveClass('skeleton--no-animate');
  });

  it('injects CSS variables when baseColor is set', () => {
    const { container } = render(
      <SkeletonTheme baseColor="#ff0000">
        <Skeleton />
      </SkeletonTheme>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.getPropertyValue('--skeleton-base-color')).toBe('#ff0000');
  });

  it('wrapper uses display:contents so it is layout-invisible', () => {
    const { container } = render(
      <SkeletonTheme baseColor="#ff0000">
        <Skeleton />
      </SkeletonTheme>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.display).toBe('contents');
  });

  it('injects --skeleton-animation-duration when speed is set', () => {
    const { container } = render(
      <SkeletonTheme speed={2.5}>
        <Skeleton />
      </SkeletonTheme>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.getPropertyValue('--skeleton-animation-duration')).toBe('2.5s');
  });

  it('instance speed overrides theme speed', () => {
    render(
      <SkeletonTheme speed={2}>
        <Skeleton speed={0.5} />
      </SkeletonTheme>
    );
    const el = screen.getByRole('progressbar') as HTMLElement;
    expect(el.style.getPropertyValue('--skeleton-animation-duration')).toBe('0.5s');
  });

  it('uses theme variant when instance does not specify one', () => {
    render(
      <SkeletonTheme variant="circle">
        <Skeleton />
      </SkeletonTheme>
    );
    expect(screen.getByRole('progressbar')).toHaveClass('skeleton--circle');
  });

  it('passes effect="pulse" to children via context', () => {
    render(
      <SkeletonTheme effect="pulse">
        <Skeleton />
      </SkeletonTheme>
    );
    expect(screen.getByRole('progressbar')).toHaveClass('skeleton--pulse');
  });
});

