/**
 * RPIX Creative OS — Core Type System
 * Single source of truth for the entire platform.
 */

// ─────────────────────────────────────────────
// Design Tokens
// ─────────────────────────────────────────────

export type ColorToken = {
  id: string;
  name: string;
  value: string;
  cssVar: string;
};

export type TypographyScale = {
  id: string;
  name: string;
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  fontWeight: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
};

export type SpacingScale = Record<string, string>;

export type GlassConfig = {
  blur: number;
  opacity: number;
  borderOpacity: number;
  saturation: number;
};

export type CursorConfig = {
  enabled: boolean;
  size: number;
  mixBlendMode: string;
  trail: boolean;
  magnetic: boolean;
  color: string;
};

export type ParticleConfig = {
  enabled: boolean;
  count: number;
  color: string;
  speed: number;
  size: number;
  connectionDistance: number;
};

export type LightingConfig = {
  ambient: string;
  key: string;
  fill: string;
  rim: string;
  intensity: number;
};

export type TransitionConfig = {
  type: 'fade' | 'slide' | 'morph' | 'curtain' | 'reveal' | 'glitch' | 'cinematic';
  duration: number;
  ease: string;
};

export type ThemeConfig = {
  id: string;
  name: string;
  version: number;
  colors: {
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    secondary: string;
    secondaryForeground: string;
    border: string;
    ring: string;
    card: string;
    cardForeground: string;
    destructive: string;
    success: string;
    warning: string;
    gold: string;
    platinum: string;
    ink: string;
  };
  typography: {
    display: string;
    body: string;
    mono: string;
    scales: TypographyScale[];
  };
  spacing: SpacingScale;
  radius: Record<string, string>;
  glass: GlassConfig;
  cursor: CursorConfig;
  particles: ParticleConfig;
  lighting: LightingConfig;
  transitions: TransitionConfig;
  animationSpeed: number;
  effects: {
    grain: boolean;
    vignette: boolean;
    scanlines: boolean;
    bloom: boolean;
    parallax: boolean;
  };
  navigation: {
    style: 'minimal' | 'expanded' | 'sidebar' | 'fullscreen';
    position: 'fixed' | 'sticky' | 'static';
    blur: boolean;
  };
  header: {
    height: number;
    transparent: boolean;
    showLogo: boolean;
    showCta: boolean;
  };
  footer: {
    style: 'minimal' | 'expanded' | 'mega';
    showNewsletter: boolean;
    showSocial: boolean;
  };
  layouts: {
    blog: 'magazine' | 'list' | 'grid' | 'editorial';
    portfolio: 'masonry' | 'grid' | 'cinematic' | 'horizontal' | 'stack';
    store: 'grid' | 'list' | 'featured';
  };
};

// ─────────────────────────────────────────────
// Content Models
// ─────────────────────────────────────────────

export type MediaType =
  | 'image'
  | 'video'
  | 'gif'
  | 'lottie'
  | 'glb'
  | 'hdri'
  | 'audio'
  | 'pdf';

export type MediaAsset = {
  id: string;
  type: MediaType;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  duration?: number;
  thumbnail?: string;
  blurhash?: string;
  cloudflareId?: string;
  dominantColor?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type SEOData = {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noindex?: boolean;
  structuredData?: Record<string, unknown>;
};

export type ContentStatus = 'draft' | 'review' | 'scheduled' | 'published' | 'archived';

export type BaseContent = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  status: ContentStatus;
  seo: SEOData;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  authorId: string;
  tags: string[];
  categories: string[];
};

export type PortfolioItem = BaseContent & {
  type: 'photography' | 'videography' | 'color-grading' | 'mixed' | '3d' | 'motion';
  cover: MediaAsset;
  gallery: MediaAsset[];
  client?: string;
  year: number;
  role: string[];
  tools: string[];
  beforeAfter?: { before: MediaAsset; after: MediaAsset }[];
  featured: boolean;
  colorGrade?: string;
  aspectRatio?: string;
  immersiveScene?: string;
};

export type BlogPost = BaseContent & {
  content: string;
  cover?: MediaAsset;
  readingTime: number;
  series?: string;
  relatedIds?: string[];
  allowComments: boolean;
};

export type Project = BaseContent & {
  cover: MediaAsset;
  gallery: MediaAsset[];
  client: string;
  year: number;
  services: string[];
  challenge: string;
  solution: string;
  results: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    avatar?: string;
  };
  liveUrl?: string;
  caseStudy?: string;
};

export type Product = BaseContent & {
  price: number;
  compareAtPrice?: number;
  currency: string;
  cover: MediaAsset;
  gallery: MediaAsset[];
  type: 'digital' | 'physical' | 'service' | 'subscription';
  sku: string;
  inventory?: number;
  digitalFile?: string;
  features: string[];
  featured: boolean;
};

export type Course = BaseContent & {
  cover: MediaAsset;
  price: number;
  currency: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'master';
  duration: number;
  lessons: CourseLesson[];
  instructor: string;
  prerequisites: string[];
  outcomes: string[];
  featured: boolean;
};

export type CourseLesson = {
  id: string;
  title: string;
  duration: number;
  videoId?: string;
  content?: string;
  free: boolean;
  order: number;
};

export type Download = BaseContent & {
  cover: MediaAsset;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  price: number;
  free: boolean;
  downloadCount: number;
};

// ─────────────────────────────────────────────
// Admin / Editor
// ─────────────────────────────────────────────

export type EditorMode = 'visual' | 'code' | 'split' | 'preview';

export type HistoryEntry = {
  id: string;
  timestamp: number;
  action: string;
  snapshot: unknown;
  label: string;
};

export type Version = {
  id: string;
  number: number;
  label: string;
  createdAt: string;
  authorId: string;
  snapshot: unknown;
  published: boolean;
};

export type Draft = {
  id: string;
  contentId: string;
  contentType: string;
  data: unknown;
  updatedAt: string;
  autoSaved: boolean;
};

export type CustomizerSection =
  | 'colors'
  | 'typography'
  | 'spacing'
  | 'glass'
  | 'cursor'
  | 'buttons'
  | 'cards'
  | 'gallery'
  | 'backgrounds'
  | 'lighting'
  | 'particles'
  | 'three'
  | 'transitions'
  | 'animation'
  | 'effects'
  | 'navigation'
  | 'header'
  | 'footer'
  | 'blog'
  | 'portfolio'
  | 'store';

export type AIAction =
  | 'create-gallery'
  | 'write-blog'
  | 'generate-seo'
  | 'optimize-images'
  | 'generate-alt'
  | 'create-thumbnails'
  | 'translate'
  | 'social-posts'
  | 'design-improve'
  | 'upload-media'
  | 'summarize'
  | 'rewrite';

export type AIMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  action?: AIAction;
  timestamp: number;
  metadata?: Record<string, unknown>;
};

// ─────────────────────────────────────────────
// User / Members
// ─────────────────────────────────────────────

export type UserRole = 'visitor' | 'member' | 'client' | 'editor' | 'admin' | 'owner';

export type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  bookmarks: string[];
  preferences: {
    theme: 'dark' | 'light' | 'system';
    reducedMotion: boolean;
    language: string;
  };
  createdAt: string;
  lastLoginAt?: string;
};

export type Comment = {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  parentId?: string;
  likes: number;
};

// ─────────────────────────────────────────────
// Navigation / Site
// ─────────────────────────────────────────────

export type NavItem = {
  id: string;
  label: string;
  href: string;
  children?: NavItem[];
  external?: boolean;
  badge?: string;
  icon?: string;
};

export type SiteConfig = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  locale: string;
  social: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    vimeo?: string;
    behance?: string;
    linkedin?: string;
    telegram?: string;
  };
  contact: {
    email: string;
    phone?: string;
    location?: string;
  };
  navigation: NavItem[];
  footerNav: NavItem[];
};

// ─────────────────────────────────────────────
// Module System (Future-proof)
// ─────────────────────────────────────────────

export type ModuleId =
  | 'core'
  | 'portfolio'
  | 'blog'
  | 'store'
  | 'courses'
  | 'members'
  | 'admin'
  | 'ai'
  | 'crm'
  | 'booking'
  | 'client-portal'
  | 'automation'
  | 'analytics'
  | 'instagram'
  | 'telegram'
  | 'payments'
  | 'marketplace'
  | 'mobile';

export type ModuleManifest = {
  id: ModuleId;
  name: string;
  version: string;
  description: string;
  enabled: boolean;
  dependencies: ModuleId[];
  routes: string[];
  permissions: UserRole[];
  config?: Record<string, unknown>;
};

// ─────────────────────────────────────────────
// Three.js / Immersive
// ─────────────────────────────────────────────

export type SceneConfig = {
  id: string;
  name: string;
  camera: {
    position: [number, number, number];
    fov: number;
    near: number;
    far: number;
  };
  lights: Array<{
    type: 'ambient' | 'directional' | 'point' | 'spot' | 'hemisphere';
    color: string;
    intensity: number;
    position?: [number, number, number];
  }>;
  environment?: string;
  fog?: { color: string; near: number; far: number };
  objects: Array<{
    id: string;
    type: 'mesh' | 'glb' | 'particles' | 'plane' | 'text';
    src?: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    material?: Record<string, unknown>;
  }>;
  postprocessing?: string[];
};

// ─────────────────────────────────────────────
// Search
// ─────────────────────────────────────────────

export type SearchResult = {
  id: string;
  type: 'page' | 'portfolio' | 'blog' | 'project' | 'product' | 'course' | 'download';
  title: string;
  excerpt: string;
  href: string;
  thumbnail?: string;
  score: number;
  highlights?: string[];
};

export type SearchIndex = {
  id: string;
  type: SearchResult['type'];
  title: string;
  content: string;
  tags: string[];
  href: string;
  thumbnail?: string;
};
