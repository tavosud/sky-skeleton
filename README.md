# @tavosud/sky-skeleton

Lightweight, zero-dependency React skeleton loader with a GPU-accelerated CSS shimmer. Built for performance — under **1.3 KB** (ESM, minified), zero repaints.

[![npm version](https://img.shields.io/npm/v/@tavosud/sky-skeleton?color=CB3837&logo=npm&logoColor=white)](https://www.npmjs.com/package/@tavosud/sky-skeleton)
[![npm downloads](https://img.shields.io/npm/dm/@tavosud/sky-skeleton?color=CB3837&logo=npm&logoColor=white)](https://www.npmjs.com/package/@tavosud/sky-skeleton)
[![bundle size](https://img.shields.io/badge/bundle-~1.3%20KB-informational?logo=webpack&logoColor=white)](https://bundlephobia.com/package/@tavosud/sky-skeleton)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-%3E%3D17-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![license](https://img.shields.io/badge/license-MIT-green?logo=opensourceinitiative&logoColor=white)](./LICENSE)
[![Tests](https://img.shields.io/badge/tests-33%20passed-brightgreen?logo=vitest&logoColor=white)](#testing)
[![CodeSandbox](https://img.shields.io/badge/demo-CodeSandbox-151515?logo=codesandbox&logoColor=white)](https://codesandbox.io/p/sandbox/799989)
[![Ko-fi](https://img.shields.io/badge/Buy%20me%20a%20coffee-Ko--fi-FF5E5B?logo=ko-fi&logoColor=white)](https://ko-fi.com/tavosud)

## Features

- **Zero runtime dependencies** — React is a peer dependency
- **GPU-accelerated shimmer** — uses `transform: translateX()` on a pseudo-element; zero CPU repaints
- **Pulse effect** — alternative `effect="pulse"` fades the skeleton in and out
- **CSS custom properties** — colors, speed, and border-radius are fully themeable without JavaScript
- **Dark mode** — automatic via `prefers-color-scheme` CSS media query
- **`SkeletonTheme`** — set defaults once for an entire subtree with `display: contents` (layout-safe)
- **Three variants** — `rect`, `circle`, `text` with multi-line paragraph support via `count`
- **Staggered animation** — `stagger` prop creates a wave delay across `text` lines
- **Circle auto-square** — omit `height` on `variant="circle"` and it mirrors `width` automatically
- **Off-screen pause** — `IntersectionObserver` pauses the animation when the skeleton is not visible
- **`React.forwardRef`** — full ref forwarding to the underlying DOM element
- **Semantic HTML** — render any element with the `as` prop
- **Reduced-motion aware** — respects `prefers-reduced-motion` natively via CSS media query
- **Accessible** — `role="progressbar"`, `aria-busy`, and a customisable `aria-label` out of the box
- **Full TypeScript API** — every prop documented with JSDoc for rich IDE autocompletion
- **33 unit tests** — Vitest + Testing Library
- **Tree-shakeable** — ESM build with `sideEffects: false`

## Installation

```bash
npm install @tavosud/sky-skeleton
# or
yarn add @tavosud/sky-skeleton
# or
pnpm add @tavosud/sky-skeleton
```

React 17 or later is required as a peer dependency.

## Usage

```tsx
import { Skeleton } from '@tavosud/sky-skeleton';
```

### Rectangle (default)

Use to represent images, banners, or any block-level element.

```tsx
<Skeleton loading={true} width={320} height={180} />
```

### Circle

Use to represent avatars or profile pictures. When you only provide `width`, the component automatically sets `height` to the same value so you don't have to repeat yourself.

```tsx
// Auto-square: height mirrors width automatically
<Skeleton loading={true} variant="circle" width={48} />

// Explicit height overrides auto-square when needed
<Skeleton loading={true} variant="circle" width={64} height={32} />
```

### Text lines

Use to represent paragraphs. `count` controls how many lines are rendered — the last one is automatically narrowed to 80% width to mimic a real paragraph ending.

```tsx
// Single line
<Skeleton loading={true} variant="text" />

// Full paragraph (4 lines)
<Skeleton loading={true} variant="text" count={4} />

// Staggered "wave" — each line starts 80 ms after the previous
<Skeleton loading={true} variant="text" count={4} stagger={0.08} />
```

### Conditional rendering with children

When `loading` is `false`, the component renders its `children` instead of the skeleton.

```tsx
function UserCard({ user, isLoading }) {
  return (
    <div>
      <Skeleton loading={isLoading} variant="circle" width={48} height={48}>
        <img src={user.avatar} alt={user.name} />
      </Skeleton>

      <Skeleton loading={isLoading} variant="text" count={2}>
        <p>{user.name}</p>
        <p>{user.bio}</p>
      </Skeleton>
    </div>
  );
}
```

### Custom styles via `className`

```tsx
<Skeleton loading={true} variant="rect" className="my-custom-skeleton" />
```

```css
/* your-styles.css */
.my-custom-skeleton {
  border-radius: 12px;
  width: 100%;
  height: 200px;
}
```

### Inline styles via `style`

For one-off overrides without a CSS class:

```tsx
<Skeleton loading={true} style={{ borderRadius: '12px', width: '100%', height: 200 }} />
```

### Effect — shimmer vs pulse

Choose between two built-in animation styles:

```tsx
// Default: a highlight sweeps across the surface (GPU-accelerated)
<Skeleton effect="shimmer" width={300} height={20} />

// Alternative: the element gently fades in and out
<Skeleton effect="pulse" width={300} height={20} />
```

You can also set a default effect for the entire tree via `SkeletonTheme`:

```tsx
<SkeletonTheme effect="pulse">
  <Skeleton />
</SkeletonTheme>
```

### Disable animation

Pass `animate={false}` to render a static placeholder — useful in tests or when you need to manage motion yourself:

```tsx
<Skeleton loading={true} variant="rect" animate={false} />
```

> **Note:** the component also reads the OS-level `prefers-reduced-motion` setting via a CSS media query and disables the animation automatically — no `animate` prop needed. Additionally, skeletons that scroll out of the viewport have their animation automatically paused via `IntersectionObserver` to save GPU cycles.

### Semantic HTML via `as`

By default the skeleton renders a `<span>`. Use `as` to render the semantically correct element:

```tsx
<Skeleton as="div" height={200} />   {/* block container */}
<Skeleton as="p" variant="text" />   {/* paragraph */}
<Skeleton as="li" variant="text" count={3} />  {/* list items */}
```

### Control animation speed

```tsx
<Skeleton speed={2.5} />  {/* slower */}
<Skeleton speed={0.8} />  {/* faster */}
```

### borderRadius per instance

```tsx
<Skeleton borderRadius={12} height={180} />    {/* number → px */}
<Skeleton borderRadius="1rem" height={180} />  {/* or string */}
```

### Custom accessible label

```tsx
<Skeleton loading={true} variant="circle" width={48} aria-label="Loading user avatar" />
```

### Access the DOM element via ref

`Skeleton` is a `forwardRef` component — you can attach a `ref` to reach the underlying DOM node:

```tsx
const ref = useRef<HTMLElement>(null);

<Skeleton ref={ref} width={300} height={20} />
```

When `variant="text"` with multiple lines, the ref is forwarded to the **first** line.

## SkeletonTheme

Wrap your app or a section in `<SkeletonTheme>` to set defaults for all `<Skeleton>` children — no need to repeat props on every instance.

```tsx
import { Skeleton, SkeletonTheme } from '@tavosud/sky-skeleton';

<SkeletonTheme baseColor="#e0e0e0" highlightColor="#f0f0f0" speed={1.8} borderRadius={8}>
  <Skeleton height={120} />
  <Skeleton variant="circle" width={48} height={48} />
  <Skeleton variant="text" count={3} />
</SkeletonTheme>
```

`SkeletonTheme` injects CSS custom properties using a `display: contents` wrapper, so the theming has **zero JavaScript overhead per render** and **never breaks flex, grid, or any other layout context** — children see through it completely.

### Dark mode with SkeletonTheme

You can provide separate light/dark themes:

```tsx
const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

<SkeletonTheme
  baseColor={isDark ? '#2a2a2a' : '#eee'}
  highlightColor={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)'}
>
  <App />
</SkeletonTheme>
```

Or rely on the **automatic CSS dark mode** built into the library (no JavaScript needed — just set a CSS variable in your dark theme):

```css
@media (prefers-color-scheme: dark) {
  :root {
    --skeleton-base-color: #2a2a2a;
    --skeleton-highlight-color: rgba(255, 255, 255, 0.08);
  }
}
```

### SkeletonTheme Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `baseColor` | `string` | `#eee` | Background color of all skeletons in the subtree. |
| `highlightColor` | `string` | `rgba(255,255,255,0.6)` | Shimmer highlight color. |
| `speed` | `number` | `1.4` | Animation duration in seconds. |
| `borderRadius` | `string \| number` | `4` | Border radius. Numbers treated as `px`. |
| `animate` | `boolean` | `true` | Disable animation for all children. |
| `effect` | `'shimmer' \| 'pulse'` | `'shimmer'` | Default animation effect for all children. |
| `variant` | `SkeletonVariant` | `'rect'` | Default variant for all children. |

## API

| Prop          | Type                           | Default        | Description                                                                 |
| ------------- | ------------------------------ | -------------- | --------------------------------------------------------------------------- |
| `loading`     | `boolean`                         | `true`         | When `true`, renders the skeleton; `false` renders children.                |
| `variant`     | `'rect' \| 'circle' \| 'text'`    | `'rect'`       | Shape of the skeleton element.                                              |
| `as`          | `ElementType`                     | `'span'`       | HTML element or React component to render as the skeleton root.             |
| `width`       | `string \| number`                | —              | Custom width. Numbers are treated as `px`.                                  |
| `height`      | `string \| number`                | —              | Custom height. For `circle`, omitting this mirrors `width` automatically.  |
| `borderRadius`| `string \| number`                | `4`            | Border radius. Numbers treated as `px`. Overrides CSS variable.            |
| `count`       | `number`                          | `1`            | Number of lines to render. Only applies to `variant="text"`.               |
| `speed`       | `number`                          | `1.4`          | Duration of one animation cycle in seconds. Overrides CSS variable.        |
| `effect`      | `'shimmer' \| 'pulse'`            | `'shimmer'`    | Animation style. `shimmer` sweeps a highlight; `pulse` fades the element.  |
| `stagger`     | `number`                          | `0`            | Delay in seconds between each line in `variant="text"`. Creates a wave.   |
| `animate`     | `boolean`                         | `true`         | Enables or disables the animation.                                          |
| `style`       | `React.CSSProperties`             | —              | Inline styles merged onto the element. Takes precedence over `width`/`height` props. |
| `className`   | `string`                          | —              | Extra CSS class appended to the skeleton element.                           |
| `aria-label`  | `string`                          | `"Loading..."` | Screen reader label. Override when you know the content being loaded.       |
| `children`    | `React.ReactNode`                 | —              | Rendered when `loading` is `false`.                                         |
| `ref`         | `React.Ref<HTMLElement>`          | —              | Forwarded to the underlying DOM element (`forwardRef`).                     |

## Accessibility

When in loading state each skeleton element renders with:

```html
<span role="progressbar" aria-busy="true" aria-label="Loading..."></span>
```

Screen readers announce the loading state correctly with no extra configuration. Override `aria-label` when you know what content is loading:

```tsx
<Skeleton loading={true} aria-label="Loading article content" />
```

The shimmer animation is automatically disabled for users who have enabled **Reduce Motion** in their OS accessibility settings, via the native `prefers-reduced-motion` CSS media query.

## Mobile support

The component is mobile-first by default:

- `max-width: 100%` prevents horizontal overflow on narrow viewports
- `box-sizing: border-box` ensures padding/border never break the layout
- `rect` and `text` variants use `display: block` so they naturally fill their container without extra CSS
- The shimmer runs on the GPU compositor thread (`transform: translateX()`), which is equally efficient on low-end mobile hardware
- `prefers-reduced-motion` is respected automatically — no JavaScript needed

For fluid layouts, omit `width` and let the skeleton fill its parent:

```tsx
// Fills 100% of the parent — works on any screen size
<Skeleton loading={true} height={180} />
```

## CSS Custom Properties

You can override the skeleton’s visual tokens globally by setting CSS variables anywhere in your stylesheet:

```css
:root {
  --skeleton-base-color: #d0d0d0;
  --skeleton-highlight-color: rgba(255, 255, 255, 0.7);
  --skeleton-border-radius: 8px;
  --skeleton-animation-duration: 1.8s;
}
```

| Variable | Default | Description |
|---|---|---|
| `--skeleton-base-color` | `#eee` | Background fill color |
| `--skeleton-highlight-color` | `rgba(255,255,255,0.6)` | Shimmer sweep color |
| `--skeleton-border-radius` | `4px` | Corner radius for `rect` and `text` |
| `--skeleton-animation-duration` | `1.4s` | Duration of one animation cycle |
| `--skeleton-animation-delay` | `0s` | Per-element animation start delay (used internally by `stagger`) |

## Testing

The library ships with **33 unit tests** covering all props and the `SkeletonTheme` context. Run them with:

```bash
npm test          # single run
npm run test:watch  # watch mode
```

Tests are written with [Vitest](https://vitest.dev/) and [@testing-library/react](https://testing-library.com/).


The shimmer is implemented as a `::after` pseudo-element animated exclusively with `transform: translateX()`. This property is handled entirely by the browser's compositor thread — it never triggers layout or paint, keeping the main thread free and CPU usage near zero regardless of how many skeletons are on screen.

`will-change: transform` is set on the pseudo-element so the browser promotes it to its own GPU layer before the animation starts.

## Bundle size

| Format | Size    |
| ------ | ------- |
| ESM    | ~1.2 KB |
| CJS    | ~1.3 KB |

Measured after minification. CSS is injected inline — no separate stylesheet to load.

## Browser support

All modern browsers. Uses `@keyframes`, `transform`, `::after`, and `linear-gradient` — universally supported since IE 10+.

## License

MIT © [tavosud](https://github.com/tavosud)
