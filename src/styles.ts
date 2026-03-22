/**
 * All skeleton styles as a minified string.
 * Injected into <head> on first Skeleton render — works in any bundler,
 * regardless of tree-shaking or CSS pipeline configuration.
 */
export const SKELETON_STYLES = `:root{--skeleton-base-color:#eee;--skeleton-highlight-color:rgba(255,255,255,.6);--skeleton-border-radius:4px;--skeleton-animation-duration:1.4s;--skeleton-animation-delay:0s}@media(prefers-color-scheme:dark){:root{--skeleton-base-color:#2a2a2a;--skeleton-highlight-color:rgba(255,255,255,.08)}}@keyframes shimmer{0%{transform:translateX(-100%)}to{transform:translateX(100%)}}@keyframes pulse{0%,to{opacity:1}50%{opacity:.4}}.skeleton{position:relative;overflow:hidden;display:inline-block;box-sizing:border-box;max-width:100%;background-color:var(--skeleton-base-color)}.skeleton::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent 0%,var(--skeleton-highlight-color) 50%,transparent 100%);transform:translateX(-100%);will-change:transform}.skeleton--shimmer::after{animation:shimmer var(--skeleton-animation-duration) ease-in-out infinite;animation-delay:var(--skeleton-animation-delay)}.skeleton--pulse::after{display:none}.skeleton--pulse{animation:pulse var(--skeleton-animation-duration) ease-in-out infinite;animation-delay:var(--skeleton-animation-delay)}.skeleton--paused,.skeleton--paused::after{animation-play-state:paused}.skeleton--no-animate,.skeleton--no-animate::after{animation:none}.skeleton--rect{display:block;border-radius:var(--skeleton-border-radius);width:100%}.skeleton--circle{border-radius:50%;width:40px;height:40px}.skeleton--text{border-radius:var(--skeleton-border-radius);width:100%;height:.85em;display:block;margin-bottom:.5em}.skeleton--text:last-child{width:80%;margin-bottom:0}@media(prefers-reduced-motion:reduce){.skeleton,.skeleton::after{animation:none}}`;

let _injected = false;

/**
 * Injects the skeleton stylesheet into <head> exactly once.
 * Safe to call repeatedly — guarded by a module-level flag.
 * No-ops in SSR environments where `document` is undefined.
 */
export function injectStyles(): void {
  if (_injected || typeof document === 'undefined') return;
  _injected = true;
  const el = document.createElement('style');
  el.setAttribute('data-sky-skeleton', '');
  el.textContent = SKELETON_STYLES;
  document.head.appendChild(el);
}
