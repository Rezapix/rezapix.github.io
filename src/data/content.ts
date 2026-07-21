/**
 * RPIX Seed Content
 * Production systems would load from CMS / Cloudflare D1 / KV.
 * This seed powers the full experience out of the box.
 */

import type {
  PortfolioItem,
  BlogPost,
  Project,
  Product,
  Course,
  Download,
  MediaAsset,
} from '@/types';

const now = '2026-07-01T00:00:00.000Z';

function media(
  id: string,
  type: MediaAsset['type'],
  alt: string,
  opts: Partial<MediaAsset> = {},
): MediaAsset {
  return {
    id,
    type,
    src: opts.src ?? `/images/${id}.jpg`,
    alt,
    width: opts.width ?? 1920,
    height: opts.height ?? 1080,
    thumbnail: opts.thumbnail ?? `/images/${id}-thumb.jpg`,
    dominantColor: opts.dominantColor ?? '#1a1814',
    createdAt: now,
    updatedAt: now,
    ...opts,
  };
}

export const PORTFOLIO: PortfolioItem[] = [
  {
    id: 'p-01',
    slug: 'nocturne-paris',
    title: 'Nocturne Paris',
    excerpt: 'A cinematic study of light and solitude across the city after midnight.',
    status: 'published',
    type: 'photography',
    cover: media('nocturne-paris', 'image', 'Paris street at night with golden reflections', {
      width: 2400,
      height: 1600,
      dominantColor: '#0a0a12',
    }),
    gallery: [
      media('nocturne-paris-01', 'image', 'Seine reflections'),
      media('nocturne-paris-02', 'image', 'Empty metro corridor'),
      media('nocturne-paris-03', 'image', 'Café neon glow'),
      media('nocturne-paris-04', 'image', 'Rooftop silhouette'),
    ],
    client: 'Personal',
    year: 2026,
    role: ['Photographer', 'Colorist'],
    tools: ['Leica Q3', 'Capture One', 'DaVinci Resolve'],
    featured: true,
    colorGrade: 'Teal & Gold Nocturne',
    aspectRatio: '3/2',
    tags: ['night', 'paris', 'street', 'cinematic'],
    categories: ['photography'],
    seo: {
      title: 'Nocturne Paris — RPIX Photography',
      description: 'Cinematic night photography series capturing the solitude of Paris after midnight.',
    },
    authorId: 'rpix',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },
  {
    id: 'p-02',
    slug: 'horizon-line',
    title: 'Horizon Line',
    excerpt: 'Aerial and ground studies of the Atlantic coastline — form, fog, and silence.',
    status: 'published',
    type: 'photography',
    cover: media('horizon-line', 'image', 'Minimal seascape with fog horizon', {
      width: 2400,
      height: 1600,
      dominantColor: '#1c2228',
    }),
    gallery: [
      media('horizon-01', 'image', 'Fog bank over water'),
      media('horizon-02', 'image', 'Cliff geometry'),
      media('horizon-03', 'image', 'Single boat silhouette'),
    ],
    client: 'Edition Print',
    year: 2025,
    role: ['Photographer'],
    tools: ['Phase One', 'Capture One'],
    featured: true,
    tags: ['landscape', 'minimal', 'ocean', 'fog'],
    categories: ['photography'],
    seo: {
      title: 'Horizon Line — RPIX Photography',
      description: 'Minimal Atlantic coastline photography — form, fog, and silence.',
    },
    authorId: 'rpix',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },
  {
    id: 'p-03',
    slug: 'chrome-motion',
    title: 'Chrome Motion',
    excerpt: 'High-end automotive film for a private collection unveiling.',
    status: 'published',
    type: 'videography',
    cover: media('chrome-motion', 'video', 'Automotive chrome detail with motion blur', {
      width: 3840,
      height: 2160,
      duration: 120,
      dominantColor: '#12141a',
    }),
    gallery: [
      media('chrome-01', 'image', 'Fender reflection'),
      media('chrome-02', 'video', 'Tracking shot', { duration: 15 }),
      media('chrome-03', 'image', 'Interior leather detail'),
    ],
    client: 'Maison Privée',
    year: 2026,
    role: ['Director', 'DP', 'Colorist'],
    tools: ['ARRI Alexa Mini LF', 'Cooke S7', 'DaVinci Resolve'],
    featured: true,
    tags: ['automotive', 'film', 'luxury', 'motion'],
    categories: ['videography'],
    seo: {
      title: 'Chrome Motion — RPIX Videography',
      description: 'High-end automotive film craft for private collection unveilings.',
    },
    authorId: 'rpix',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },
  {
    id: 'p-04',
    slug: 'amber-grade',
    title: 'Amber Grade',
    excerpt: 'Look development and final grade for an independent feature film.',
    status: 'published',
    type: 'color-grading',
    cover: media('amber-grade', 'image', 'Film still with warm amber grade', {
      width: 3840,
      height: 2160,
      dominantColor: '#2a1810',
    }),
    gallery: [
      media('amber-01', 'image', 'Before grade'),
      media('amber-02', 'image', 'After grade'),
    ],
    beforeAfter: [
      {
        before: media('amber-before', 'image', 'Ungraded log footage'),
        after: media('amber-after', 'image', 'Final amber cinematic grade'),
      },
    ],
    client: 'Northlight Films',
    year: 2025,
    role: ['Senior Colorist'],
    tools: ['DaVinci Resolve', 'Baselight', 'HDR Monitor'],
    featured: true,
    colorGrade: 'Amber Dusk — HDR10',
    tags: ['color', 'film', 'hdr', 'feature'],
    categories: ['color-grading'],
    seo: {
      title: 'Amber Grade — RPIX Color Grading',
      description: 'Feature film look development and final color grade.',
    },
    authorId: 'rpix',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },
  {
    id: 'p-05',
    slug: 'atelier-still-life',
    title: 'Atelier',
    excerpt: 'Product and still-life series for a heritage watchmaker.',
    status: 'published',
    type: 'photography',
    cover: media('atelier', 'image', 'Watch mechanism macro on dark velvet', {
      width: 2000,
      height: 2500,
      dominantColor: '#0e0c0a',
    }),
    gallery: [
      media('atelier-01', 'image', 'Gear macro'),
      media('atelier-02', 'image', 'Dial reflection'),
      media('atelier-03', 'image', 'Case side light'),
    ],
    client: 'Atelier Horloger',
    year: 2026,
    role: ['Photographer', 'Retoucher'],
    tools: ['Hasselblad X2D', 'Profoto', 'Capture One'],
    featured: false,
    tags: ['product', 'macro', 'luxury', 'watch'],
    categories: ['photography'],
    seo: {
      title: 'Atelier — RPIX Photography',
      description: 'Heritage watch still-life photography series.',
    },
    authorId: 'rpix',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },
  {
    id: 'p-06',
    slug: 'resonance',
    title: 'Resonance',
    excerpt: 'Music video — abstract light forms synchronized to a live score.',
    status: 'published',
    type: 'videography',
    cover: media('resonance', 'video', 'Abstract light trails in darkness', {
      width: 3840,
      height: 2160,
      duration: 240,
      dominantColor: '#0a0612',
    }),
    gallery: [
      media('resonance-01', 'image', 'Light form still'),
      media('resonance-02', 'video', 'Performance excerpt', { duration: 30 }),
    ],
    client: 'Independent Artist',
    year: 2025,
    role: ['Director', 'Editor', 'Colorist'],
    tools: ['Sony Venice', 'After Effects', 'DaVinci Resolve'],
    featured: false,
    tags: ['music', 'abstract', 'light', 'performance'],
    categories: ['videography'],
    seo: {
      title: 'Resonance — RPIX Videography',
      description: 'Abstract music video — light forms synchronized to live score.',
    },
    authorId: 'rpix',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'proj-01',
    slug: 'maison-rebrand',
    title: 'Maison Visual Identity',
    excerpt: 'Complete visual system and campaign imagery for a Parisian fashion house.',
    status: 'published',
    cover: media('maison-rebrand', 'image', 'Fashion campaign key visual'),
    gallery: [
      media('maison-01', 'image', 'Lookbook cover'),
      media('maison-02', 'image', 'Campaign billboard'),
      media('maison-03', 'video', 'Brand film', { type: 'video', duration: 60 }),
    ],
    client: 'Maison L.',
    year: 2026,
    services: ['Art Direction', 'Photography', 'Motion', 'Color'],
    challenge:
      'Translate a century of heritage into a contemporary visual language without losing soul.',
    solution:
      'A restrained palette, tactile typography, and cinematic stills that treat fabric as landscape.',
    results: [
      '340% increase in campaign engagement',
      'Featured in three international design annuals',
      'Full system adopted across 12 markets',
    ],
    testimonial: {
      quote:
        'RPIX did not deliver images. They delivered a new way of seeing our house.',
      author: 'Claire M.',
      role: 'Creative Director, Maison L.',
    },
    tags: ['fashion', 'branding', 'campaign'],
    categories: ['projects'],
    seo: {
      title: 'Maison Visual Identity — RPIX Projects',
      description: 'Complete visual system for a Parisian fashion house.',
    },
    authorId: 'rpix',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },
  {
    id: 'proj-02',
    slug: 'nordic-retreat',
    title: 'Nordic Retreat',
    excerpt: 'Architecture and lifestyle film for a secluded hospitality brand.',
    status: 'published',
    cover: media('nordic-retreat', 'image', 'Minimal timber architecture in snow'),
    gallery: [
      media('nordic-01', 'image', 'Exterior dawn'),
      media('nordic-02', 'image', 'Interior firelight'),
      media('nordic-03', 'video', 'Brand film', { type: 'video', duration: 90 }),
    ],
    client: 'Fjell & Hav',
    year: 2025,
    services: ['Cinematography', 'Color Grading', 'Sound Design'],
    challenge: 'Capture silence and space without emptiness.',
    solution:
      'Long lenses, natural light only, and a grade that preserves cold air and warm interiors.',
    results: [
      'Bookings up 85% in launch quarter',
      'Vimeo Staff Pick',
      'Used across all global marketing',
    ],
    tags: ['architecture', 'hospitality', 'film'],
    categories: ['projects'],
    seo: {
      title: 'Nordic Retreat — RPIX Projects',
      description: 'Architecture and lifestyle film for a hospitality brand.',
    },
    authorId: 'rpix',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },
];

export const BLOG: BlogPost[] = [
  {
    id: 'b-01',
    slug: 'language-of-shadow',
    title: 'The Language of Shadow',
    excerpt:
      'Why the darkest parts of an image often carry the loudest emotion — and how to shape them with intention.',
    status: 'published',
    content: `There is a moment in every frame where light ends and something more interesting begins.

Shadow is not the absence of information. It is a deliberate reduction — a choice to withhold, to suggest, to let the mind complete what the eye cannot fully see. In luxury image-making, that restraint is everything.

## Seeing Less, Feeling More

When we crush blacks without care, we lose texture and depth. When we lift them indiscriminately, we lose mystery. The craft lives in the gradient between those failures: the region where form is implied, not declared.

I often start a grade by asking a single question: **what should remain unknown?**

## Practical Notes

- Expose for the highlight you cannot afford to lose, then shape shadow in the grade.
- Use power windows sparingly — global intention first, local correction second.
- Print stills. Screens lie about black levels; paper does not.

The goal is never darkness for its own sake. It is atmosphere with structure.`,
    cover: media('blog-shadow', 'image', 'Abstract shadow study on textured wall'),
    readingTime: 6,
    allowComments: true,
    tags: ['craft', 'color', 'philosophy'],
    categories: ['journal'],
    seo: {
      title: 'The Language of Shadow — RPIX Journal',
      description: 'Why the darkest parts of an image often carry the loudest emotion.',
    },
    authorId: 'rpix',
    createdAt: now,
    updatedAt: now,
    publishedAt: '2026-06-12T00:00:00.000Z',
  },
  {
    id: 'b-02',
    slug: 'leica-q3-field-notes',
    title: 'Leica Q3 Field Notes',
    excerpt: 'Six months with a single fixed lens — what disappeared, and what remained.',
    status: 'published',
    content: `Constraints refine taste faster than options ever will.

After six months exclusively with the Q3, my bag is lighter and my decisions are sharper. The 28mm frame forces proximity or patience — both of which produce better photographs than zooming from a safe distance.

## What Changed

Composition became instinct. I stopped hunting and started waiting. Color science held up in mixed city light better than expected. Files forgive aggressive grading without falling apart.

## What I Miss

Reach, occasionally. Nothing else.

The best camera is the one that disappears. This one mostly does.`,
    cover: media('blog-leica', 'image', 'Leica Q3 on dark marble'),
    readingTime: 4,
    allowComments: true,
    tags: ['gear', 'photography', 'notes'],
    categories: ['journal'],
    seo: {
      title: 'Leica Q3 Field Notes — RPIX Journal',
      description: 'Six months with a single fixed lens — field notes from the Q3.',
    },
    authorId: 'rpix',
    createdAt: now,
    updatedAt: now,
    publishedAt: '2026-05-28T00:00:00.000Z',
  },
  {
    id: 'b-03',
    slug: 'hdr-without-the-look',
    title: 'HDR Without the Look',
    excerpt: 'Delivering true HDR while preserving a cinematic, print-aware aesthetic.',
    status: 'published',
    content: `HDR does not require neon. It requires headroom.

The most common mistake is treating the expanded luminance range as permission to exaggerate. The better approach is quiet: protect specular detail, deepen shadow separation, and let skin remain human.

## A Working Approach

1. Grade SDR with final intent first.
2. Expand to HDR with restrained highlight rolloff.
3. Check on reference and consumer displays.
4. Always ship a matched SDR trim.

Cinematic HDR should feel like more air, not more chrome.`,
    cover: media('blog-hdr', 'image', 'HDR waveform on grading monitor'),
    readingTime: 8,
    allowComments: true,
    tags: ['color', 'hdr', 'workflow'],
    categories: ['journal'],
    seo: {
      title: 'HDR Without the Look — RPIX Journal',
      description: 'Delivering true HDR while preserving a cinematic aesthetic.',
    },
    authorId: 'rpix',
    createdAt: now,
    updatedAt: now,
    publishedAt: '2026-04-15T00:00:00.000Z',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    slug: 'obsidian-lut-pack',
    title: 'Obsidian LUT Pack',
    excerpt: '12 cinematic LUTs forged from real RPIX grades — LogC3, S-Log3, and Rec.709.',
    status: 'published',
    price: 79,
    compareAtPrice: 99,
    currency: 'EUR',
    cover: media('product-obsidian', 'image', 'Obsidian LUT pack preview grid'),
    gallery: [media('product-obsidian-01', 'image', 'Before after strip')],
    type: 'digital',
    sku: 'RPIX-LUT-OBS-01',
    features: [
      '12 handcrafted LUTs',
      'ARRI LogC3 / Sony S-Log3 / Rec.709',
      'DaVinci + Premiere + Final Cut',
      'Lifetime updates',
    ],
    featured: true,
    tags: ['lut', 'color', 'digital'],
    categories: ['store'],
    seo: {
      title: 'Obsidian LUT Pack — RPIX Store',
      description: '12 cinematic LUTs from real RPIX color grades.',
    },
    authorId: 'rpix',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },
  {
    id: 'prod-02',
    slug: 'print-nocturne-01',
    title: 'Nocturne №01 — Fine Art Print',
    excerpt: 'Museum-grade pigment print, signed and numbered. Edition of 25.',
    status: 'published',
    price: 420,
    currency: 'EUR',
    cover: media('product-print-nocturne', 'image', 'Framed Nocturne fine art print'),
    gallery: [
      media('product-print-01', 'image', 'Print detail'),
      media('product-print-02', 'image', 'Edition certificate'),
    ],
    type: 'physical',
    sku: 'RPIX-PRT-NOC-01',
    inventory: 18,
    features: [
      'Hahnemühle Photo Rag 308gsm',
      'Signed & numbered',
      'Edition of 25',
      'Certificate of authenticity',
      '50 × 75 cm',
    ],
    featured: true,
    tags: ['print', 'edition', 'photography'],
    categories: ['store'],
    seo: {
      title: 'Nocturne №01 Fine Art Print — RPIX Store',
      description: 'Museum-grade signed pigment print. Edition of 25.',
    },
    authorId: 'rpix',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },
  {
    id: 'prod-03',
    slug: 'rpix-preset-suite',
    title: 'RPIX Preset Suite',
    excerpt: 'Capture One and Lightroom presets used in commercial and personal work.',
    status: 'published',
    price: 49,
    currency: 'EUR',
    cover: media('product-presets', 'image', 'Preset suite color wheels'),
    gallery: [],
    type: 'digital',
    sku: 'RPIX-PRE-01',
    features: [
      '24 Capture One styles',
      '24 Lightroom profiles',
      'Skin-safe foundations',
      'Night / Day / Studio sets',
    ],
    featured: false,
    tags: ['presets', 'photography', 'digital'],
    categories: ['store'],
    seo: {
      title: 'RPIX Preset Suite — RPIX Store',
      description: 'Capture One and Lightroom presets from commercial work.',
    },
    authorId: 'rpix',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },
];

export const COURSES: Course[] = [
  {
    id: 'c-01',
    slug: 'cinematic-color-masterclass',
    title: 'Cinematic Color Masterclass',
    excerpt:
      'From log to delivery — a complete color philosophy and technical pipeline for film and commercial work.',
    status: 'published',
    cover: media('course-color', 'image', 'Color grading suite overview'),
    price: 349,
    currency: 'EUR',
    level: 'advanced',
    duration: 720,
    instructor: 'RPIX',
    prerequisites: ['Basic familiarity with DaVinci Resolve', 'Understanding of exposure'],
    outcomes: [
      'Build complete show LUTs',
      'Grade HDR and SDR in parallel',
      'Develop a personal color philosophy',
      'Deliver broadcast-safe masters',
    ],
    lessons: [
      { id: 'l1', title: 'Seeing Before Grading', duration: 28, free: true, order: 1 },
      { id: 'l2', title: 'The Node Graph as Language', duration: 45, free: false, order: 2 },
      { id: 'l3', title: 'Skin, Always', duration: 52, free: false, order: 3 },
      { id: 'l4', title: 'Look Development', duration: 68, free: false, order: 4 },
      { id: 'l5', title: 'HDR Pipelines', duration: 55, free: false, order: 5 },
      { id: 'l6', title: 'Final Delivery', duration: 40, free: false, order: 6 },
    ],
    featured: true,
    tags: ['color', 'davinci', 'course'],
    categories: ['courses'],
    seo: {
      title: 'Cinematic Color Masterclass — RPIX Courses',
      description: 'Complete color philosophy and technical pipeline masterclass.',
    },
    authorId: 'rpix',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },
  {
    id: 'c-02',
    slug: 'light-as-material',
    title: 'Light as Material',
    excerpt: 'A photography course on shaping light with intention — available light to full studio.',
    status: 'published',
    cover: media('course-light', 'image', 'Studio light forming geometry on face'),
    price: 249,
    currency: 'EUR',
    level: 'intermediate',
    duration: 480,
    instructor: 'RPIX',
    prerequisites: ['Working knowledge of manual exposure'],
    outcomes: [
      'Read and shape any lighting scenario',
      'Build minimal effective lighting setups',
      'Develop consistent personal lighting style',
    ],
    lessons: [
      { id: 'll1', title: 'The Physics You Actually Need', duration: 35, free: true, order: 1 },
      { id: 'll2', title: 'One Light Discipline', duration: 48, free: false, order: 2 },
      { id: 'll3', title: 'Available Light Mastery', duration: 55, free: false, order: 3 },
      { id: 'll4', title: 'Studio as Instrument', duration: 60, free: false, order: 4 },
    ],
    featured: true,
    tags: ['photography', 'lighting', 'course'],
    categories: ['courses'],
    seo: {
      title: 'Light as Material — RPIX Courses',
      description: 'Photography course on shaping light with intention.',
    },
    authorId: 'rpix',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },
];

export const DOWNLOADS: Download[] = [
  {
    id: 'd-01',
    slug: 'shot-list-template',
    title: 'Cinematic Shot List Template',
    excerpt: 'A refined Notion + PDF shot list used on commercial productions.',
    status: 'published',
    cover: media('dl-shotlist', 'image', 'Shot list template preview'),
    fileUrl: '/downloads/rpix-shot-list.pdf',
    fileSize: 245000,
    fileType: 'pdf',
    price: 0,
    free: true,
    downloadCount: 1840,
    tags: ['template', 'production'],
    categories: ['downloads'],
    seo: {
      title: 'Cinematic Shot List Template — RPIX',
      description: 'Free commercial shot list template from RPIX productions.',
    },
    authorId: 'rpix',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },
  {
    id: 'd-02',
    slug: 'color-checklist',
    title: 'Pre-Grade Checklist',
    excerpt: 'Technical checklist before you touch a single node.',
    status: 'published',
    cover: media('dl-checklist', 'image', 'Color checklist document'),
    fileUrl: '/downloads/rpix-pregrade-checklist.pdf',
    fileSize: 128000,
    fileType: 'pdf',
    price: 0,
    free: true,
    downloadCount: 2204,
    tags: ['color', 'checklist'],
    categories: ['downloads'],
    seo: {
      title: 'Pre-Grade Checklist — RPIX',
      description: 'Free technical checklist for colorists.',
    },
    authorId: 'rpix',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },
];

export const FAQ_ITEMS = [
  {
    id: 'faq-01',
    question: 'What kind of projects does RPIX take on?',
    answer:
      'Select photography, cinematography, and color grading for brands and filmmakers who value restraint, craft, and longevity over volume. We work with a limited number of clients each year.',
    category: 'general',
  },
  {
    id: 'faq-02',
    question: 'Do you work remotely for color grading?',
    answer:
      'Yes. Most grading engagements are remote with secure media transfer, calibrated review sessions, and HDR/SDR dual delivery. On-set and near-set supervision is available in Europe.',
    category: 'services',
  },
  {
    id: 'faq-03',
    question: 'What is included with digital products?',
    answer:
      'Lifetime access, free version updates, documentation, and member-only installation support. LUTs and presets are licensed for commercial use by the purchasing individual or studio.',
    category: 'store',
  },
  {
    id: 'faq-04',
    question: 'Can I license images from the portfolio?',
    answer:
      'Selected works are available for licensing. Edition prints are sold separately. Contact the studio with usage details for a tailored license.',
    category: 'licensing',
  },
  {
    id: 'faq-05',
    question: 'How do courses work?',
    answer:
      'Courses are self-paced with lifetime access. Lessons combine theory, breakdowns of real work, and practical assignments. Members can bookmark progress and join periodic live reviews.',
    category: 'courses',
  },
  {
    id: 'faq-06',
    question: 'What is the typical project timeline?',
    answer:
      'Still campaigns: 2–6 weeks. Short films and brand films: 4–12 weeks. Feature grading: scheduled by reel count and delivery specs. Exact timelines are defined in the proposal.',
    category: 'services',
  },
];

/** Helpers */
export function getPortfolioBySlug(slug: string) {
  return PORTFOLIO.find((p) => p.slug === slug);
}

export function getPortfolioByType(type: PortfolioItem['type']) {
  return PORTFOLIO.filter((p) => p.type === type || type === 'mixed');
}

export function getFeaturedPortfolio() {
  return PORTFOLIO.filter((p) => p.featured);
}

export function getBlogBySlug(slug: string) {
  return BLOG.find((b) => b.slug === slug);
}

export function getProjectBySlug(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getCourseBySlug(slug: string) {
  return COURSES.find((c) => c.slug === slug);
}

export function searchContent(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: Array<{
    id: string;
    type: string;
    title: string;
    excerpt: string;
    href: string;
    score: number;
  }> = [];

  const score = (title: string, excerpt: string, tags: string[]) => {
    let s = 0;
    if (title.toLowerCase().includes(q)) s += 10;
    if (excerpt.toLowerCase().includes(q)) s += 5;
    if (tags.some((t) => t.includes(q))) s += 3;
    return s;
  };

  for (const p of PORTFOLIO) {
    const s = score(p.title, p.excerpt ?? '', p.tags);
    if (s > 0)
      results.push({
        id: p.id,
        type: 'portfolio',
        title: p.title,
        excerpt: p.excerpt ?? '',
        href: `/portfolio/${p.slug}`,
        score: s,
      });
  }
  for (const b of BLOG) {
    const s = score(b.title, b.excerpt ?? '', b.tags);
    if (s > 0)
      results.push({
        id: b.id,
        type: 'blog',
        title: b.title,
        excerpt: b.excerpt ?? '',
        href: `/blog/${b.slug}`,
        score: s,
      });
  }
  for (const p of PROJECTS) {
    const s = score(p.title, p.excerpt ?? '', p.tags);
    if (s > 0)
      results.push({
        id: p.id,
        type: 'project',
        title: p.title,
        excerpt: p.excerpt ?? '',
        href: `/projects/${p.slug}`,
        score: s,
      });
  }
  for (const p of PRODUCTS) {
    const s = score(p.title, p.excerpt ?? '', p.tags);
    if (s > 0)
      results.push({
        id: p.id,
        type: 'product',
        title: p.title,
        excerpt: p.excerpt ?? '',
        href: `/store/${p.slug}`,
        score: s,
      });
  }
  for (const c of COURSES) {
    const s = score(c.title, c.excerpt ?? '', c.tags);
    if (s > 0)
      results.push({
        id: c.id,
        type: 'course',
        title: c.title,
        excerpt: c.excerpt ?? '',
        href: `/courses/${c.slug}`,
        score: s,
      });
  }

  return results.sort((a, b) => b.score - a.score);
}
