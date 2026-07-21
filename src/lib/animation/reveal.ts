/**
 * RPIX — Scroll Reveal System
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

function ensureGSAP() {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

export type RevealOptions = {
  y?: number;
  x?: number;
  scale?: number;
  opacity?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
  start?: string;
  markers?: boolean;
};

const DEFAULTS: Required<Omit<RevealOptions, 'x' | 'scale' | 'markers'>> & {
  x: number;
  scale: number;
} = {
  y: 48,
  x: 0,
  scale: 1,
  opacity: 0,
  duration: 1.1,
  delay: 0,
  stagger: 0.08,
  ease: 'power3.out',
  start: 'top 88%',
};

export function revealElements(
  selector: string | Element | Element[] | NodeListOf<Element> = '[data-reveal]',
  options: RevealOptions = {},
) {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const els =
      typeof selector === 'string'
        ? document.querySelectorAll(selector)
        : selector instanceof Element
          ? [selector]
          : selector;
    els.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  ensureGSAP();
  const opts = { ...DEFAULTS, ...options };

  const elements =
    typeof selector === 'string'
      ? gsap.utils.toArray<HTMLElement>(selector)
      : selector instanceof Element
        ? [selector as HTMLElement]
        : Array.from(selector) as HTMLElement[];

  elements.forEach((el) => {
    const type = el.dataset.reveal || 'up';
    const delay = Number(el.dataset.revealDelay || opts.delay);

    let from: gsap.TweenVars = {
      opacity: opts.opacity,
      y: opts.y,
      x: opts.x,
      scale: opts.scale === 1 ? undefined : opts.scale,
    };

    if (type === 'fade') from = { opacity: 0 };
    if (type === 'left') from = { opacity: 0, x: -48 };
    if (type === 'right') from = { opacity: 0, x: 48 };
    if (type === 'scale') from = { opacity: 0, scale: 0.92 };
    if (type === 'up') from = { opacity: 0, y: opts.y };

    gsap.fromTo(el, from, {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      duration: opts.duration * getAnimSpeed(),
      delay: delay / 1000,
      ease: opts.ease,
      onStart: () => el.classList.add('is-revealed'),
      scrollTrigger: {
        trigger: el,
        start: opts.start,
        toggleActions: 'play none none none',
        once: true,
      },
    });
  });
}

export function revealStagger(
  container: string | Element,
  childSelector = '[data-reveal-child]',
  options: RevealOptions = {},
) {
  if (typeof window === 'undefined') return;
  ensureGSAP();

  const opts = { ...DEFAULTS, ...options };
  const root =
    typeof container === 'string' ? document.querySelector(container) : container;
  if (!root) return;

  const children = root.querySelectorAll(childSelector);
  if (!children.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    children.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  gsap.fromTo(
    children,
    { opacity: 0, y: opts.y },
    {
      opacity: 1,
      y: 0,
      duration: opts.duration * getAnimSpeed(),
      stagger: opts.stagger,
      ease: opts.ease,
      scrollTrigger: {
        trigger: root,
        start: opts.start,
        once: true,
      },
      onStart: () => {
        children.forEach((el) => el.classList.add('is-revealed'));
      },
    },
  );
}

export function splitTextReveal(element: string | HTMLElement, options: RevealOptions = {}) {
  if (typeof window === 'undefined') return;
  ensureGSAP();

  const el =
    typeof element === 'string' ? document.querySelector<HTMLElement>(element) : element;
  if (!el || !el.textContent) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.style.opacity = '1';
    return;
  }

  const text = el.textContent;
  const words = text.split(/(\s+)/);
  el.innerHTML = words
    .map((w) =>
      w.trim()
        ? `<span class="split-word" style="display:inline-block;overflow:hidden;vertical-align:top"><span class="split-inner" style="display:inline-block">${w}</span></span>`
        : w,
    )
    .join('');

  const inners = el.querySelectorAll('.split-inner');
  gsap.fromTo(
    inners,
    { y: '110%', opacity: 0 },
    {
      y: '0%',
      opacity: 1,
      duration: (options.duration ?? 1) * getAnimSpeed(),
      stagger: options.stagger ?? 0.03,
      ease: options.ease ?? 'power3.out',
      delay: (options.delay ?? 0) / 1000,
      scrollTrigger: options.start
        ? { trigger: el, start: options.start, once: true }
        : undefined,
    },
  );
}

function getAnimSpeed(): number {
  if (typeof document === 'undefined') return 1;
  const v = getComputedStyle(document.documentElement).getPropertyValue('--rpix-anim-speed');
  return Number(v) || 1;
}

export function refreshScrollTriggers() {
  if (typeof window === 'undefined') return;
  ensureGSAP();
  ScrollTrigger.refresh();
}
