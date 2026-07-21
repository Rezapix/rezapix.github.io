/**
 * RPIX Design System — Tokens
 * Luxury · Minimal · Dark · Cinematic · Timeless
 */

import type { ThemeConfig } from '@/types';

export const RPIX_THEME: ThemeConfig = {
  id: 'rpix-obsidian',
  name: 'Obsidian',
  version: 1,

  colors: {
    background: '#050505',
    foreground: '#F5F2EB',
    muted: '#121212',
    mutedForeground: '#8A8680',
    accent: '#C9A84C',
    accentForeground: '#050505',
    secondary: '#1A1A1A',
    secondaryForeground: '#E8E4DC',
    border: 'rgba(245, 242, 235, 0.08)',
    ring: '#C9A84C',
    card: '#0C0C0C',
    cardForeground: '#F5F2EB',
    destructive: '#E5484D',
    success: '#46A758',
    warning: '#F5A524',
    gold: '#C9A84C',
    platinum: '#E8E4DC',
    ink: '#050505',
  },

  typography: {
    display: '"Neue Haas Grotesk Display", "Helvetica Neue", "SF Pro Display", system-ui, sans-serif',
    body: '"Neue Haas Grotesk Text", "Helvetica Neue", "SF Pro Text", system-ui, sans-serif',
    mono: '"JetBrains Mono", "SF Mono", "Fira Code", ui-monospace, monospace',
    scales: [
      {
        id: 'hero',
        name: 'Hero',
        fontFamily: 'display',
        fontSize: 'clamp(3.5rem, 12vw, 10rem)',
        lineHeight: '0.9',
        letterSpacing: '-0.04em',
        fontWeight: 500,
      },
      {
        id: 'display',
        name: 'Display',
        fontFamily: 'display',
        fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
        lineHeight: '0.95',
        letterSpacing: '-0.035em',
        fontWeight: 500,
      },
      {
        id: 'h1',
        name: 'Heading 1',
        fontFamily: 'display',
        fontSize: 'clamp(2rem, 4vw, 3.5rem)',
        lineHeight: '1.05',
        letterSpacing: '-0.03em',
        fontWeight: 500,
      },
      {
        id: 'h2',
        name: 'Heading 2',
        fontFamily: 'display',
        fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
        lineHeight: '1.15',
        letterSpacing: '-0.025em',
        fontWeight: 500,
      },
      {
        id: 'h3',
        name: 'Heading 3',
        fontFamily: 'display',
        fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
        lineHeight: '1.25',
        letterSpacing: '-0.02em',
        fontWeight: 500,
      },
      {
        id: 'body-lg',
        name: 'Body Large',
        fontFamily: 'body',
        fontSize: '1.25rem',
        lineHeight: '1.6',
        letterSpacing: '-0.01em',
        fontWeight: 400,
      },
      {
        id: 'body',
        name: 'Body',
        fontFamily: 'body',
        fontSize: '1rem',
        lineHeight: '1.65',
        letterSpacing: '0',
        fontWeight: 400,
      },
      {
        id: 'body-sm',
        name: 'Body Small',
        fontFamily: 'body',
        fontSize: '0.875rem',
        lineHeight: '1.5',
        letterSpacing: '0.01em',
        fontWeight: 400,
      },
      {
        id: 'caption',
        name: 'Caption',
        fontFamily: 'body',
        fontSize: '0.75rem',
        lineHeight: '1.4',
        letterSpacing: '0.04em',
        fontWeight: 500,
        textTransform: 'uppercase',
      },
      {
        id: 'label',
        name: 'Label',
        fontFamily: 'mono',
        fontSize: '0.6875rem',
        lineHeight: '1.3',
        letterSpacing: '0.08em',
        fontWeight: 500,
        textTransform: 'uppercase',
      },
    ],
  },

  spacing: {
    '0': '0',
    'px': '1px',
    '0.5': '0.125rem',
    '1': '0.25rem',
    '1.5': '0.375rem',
    '2': '0.5rem',
    '3': '0.75rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '8': '2rem',
    '10': '2.5rem',
    '12': '3rem',
    '16': '4rem',
    '20': '5rem',
    '24': '6rem',
    '32': '8rem',
    '40': '10rem',
    '48': '12rem',
    '64': '16rem',
    'section': 'clamp(5rem, 12vw, 10rem)',
    'gutter': 'clamp(1.25rem, 4vw, 3rem)',
  },

  radius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

  glass: {
    blur: 24,
    opacity: 0.06,
    borderOpacity: 0.08,
    saturation: 1.2,
  },

  cursor: {
    enabled: true,
    size: 16,
    mixBlendMode: 'difference',
    trail: true,
    magnetic: true,
    color: '#F5F2EB',
  },

  particles: {
    enabled: true,
    count: 60,
    color: '#C9A84C',
    speed: 0.3,
    size: 1.2,
    connectionDistance: 120,
  },

  lighting: {
    ambient: '#1a1814',
    key: '#C9A84C',
    fill: '#3a3528',
    rim: '#E8E4DC',
    intensity: 1.0,
  },

  transitions: {
    type: 'cinematic',
    duration: 1.2,
    ease: 'cubic-bezier(0.76, 0, 0.24, 1)',
  },

  animationSpeed: 1.0,

  effects: {
    grain: true,
    vignette: true,
    scanlines: false,
    bloom: true,
    parallax: true,
  },

  navigation: {
    style: 'minimal',
    position: 'fixed',
    blur: true,
  },

  header: {
    height: 80,
    transparent: true,
    showLogo: true,
    showCta: true,
  },

  footer: {
    style: 'expanded',
    showNewsletter: true,
    showSocial: true,
  },

  layouts: {
    blog: 'editorial',
    portfolio: 'cinematic',
    store: 'featured',
  },
};

/** Easing curves — cinematic motion language */
export const EASE = {
  outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  outQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
  inOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
  inOutQuart: 'cubic-bezier(0.76, 0, 0.24, 1)',
  cinematic: 'cubic-bezier(0.77, 0, 0.175, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

/** Duration scale (ms) */
export const DURATION = {
  instant: 100,
  fast: 200,
  normal: 400,
  slow: 700,
  slower: 1000,
  cinematic: 1400,
  epic: 2000,
} as const;

/** Z-index scale */
export const Z = {
  base: 0,
  raised: 10,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  toast: 500,
  cursor: 900,
  loader: 1000,
} as const;

/** Breakpoints */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1920,
} as const;
