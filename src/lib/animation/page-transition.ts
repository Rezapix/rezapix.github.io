/**
 * RPIX — Cinematic Page Transitions
 */

import gsap from 'gsap';

let overlay: HTMLElement | null = null;

function getOverlay(): HTMLElement {
  if (overlay && document.body.contains(overlay)) return overlay;
  overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);
  return overlay;
}

export async function transitionOut(): Promise<void> {
  const el = getOverlay();
  return new Promise((resolve) => {
    gsap.set(el, { scaleY: 0, transformOrigin: 'bottom' });
    gsap.to(el, {
      scaleY: 1,
      duration: 0.7,
      ease: 'power4.inOut',
      onComplete: resolve,
    });
  });
}

export async function transitionIn(): Promise<void> {
  const el = getOverlay();
  return new Promise((resolve) => {
    gsap.set(el, { scaleY: 1, transformOrigin: 'top' });
    gsap.to(el, {
      scaleY: 0,
      duration: 0.8,
      ease: 'power4.inOut',
      onComplete: resolve,
    });
  });
}

export function initPageTransitions() {
  if (typeof window === 'undefined') return;

  // Intercept internal links for cinematic transitions
  document.addEventListener('click', async (e) => {
    const anchor = (e.target as HTMLElement).closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href) return;
    if (anchor.target === '_blank') return;
    if (href.startsWith('#')) return;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (anchor.hasAttribute('data-no-transition')) return;
    if (href.startsWith('http') && !href.includes(window.location.host)) return;
    if (anchor.hasAttribute('download')) return;

    // Same-page hash
    const url = new URL(href, window.location.origin);
    if (url.pathname === window.location.pathname && url.hash) return;

    // Admin routes — no cinematic curtain
    if (url.pathname.startsWith('/admin')) return;

    e.preventDefault();
    await transitionOut();
    window.location.href = href;
  });

  // Animate in on load
  requestAnimationFrame(() => {
    const el = getOverlay();
    gsap.set(el, { scaleY: 1, transformOrigin: 'top' });
    gsap.to(el, {
      scaleY: 0,
      duration: 0.9,
      ease: 'power4.inOut',
      delay: 0.05,
    });
  });
}
