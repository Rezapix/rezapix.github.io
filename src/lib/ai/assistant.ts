/**
 * RPIX AI Assistant
 * Integrated creative intelligence for content, SEO, media, and design.
 * Architecture supports OpenAI / Anthropic / local models via adapter.
 */

import { nanoid } from 'nanoid';
import type { AIAction, AIMessage } from '@/types';

export type AIProvider = 'demo' | 'openai' | 'anthropic' | 'cloudflare';

export type AIRequest = {
  action: AIAction;
  prompt: string;
  context?: Record<string, unknown>;
};

export type AIResponse = {
  id: string;
  action: AIAction;
  content: string;
  data?: unknown;
  suggestions?: string[];
};

/** Demo responses — replace with real provider in production */
const DEMO_HANDLERS: Record<AIAction, (prompt: string, ctx?: Record<string, unknown>) => AIResponse> = {
  'write-blog': (prompt) => ({
    id: nanoid(),
    action: 'write-blog',
    content: generateBlogDraft(prompt),
    suggestions: ['Add a stronger opening hook', 'Include a practical takeaway section', 'Generate SEO meta'],
  }),
  'generate-seo': (prompt, ctx) => ({
    id: nanoid(),
    action: 'generate-seo',
    content: 'SEO package generated.',
    data: {
      title: `${ctx?.title ?? prompt} — RPIX`.slice(0, 60),
      description: `Discover ${prompt}. Premium creative craft from RPIX studio — photography, film, and color.`.slice(0, 155),
      keywords: extractKeywords(prompt),
      ogTitle: String(ctx?.title ?? prompt),
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: ctx?.title ?? prompt,
      },
    },
    suggestions: ['A/B test title variants', 'Add FAQ schema'],
  }),
  'generate-alt': (prompt) => ({
    id: nanoid(),
    action: 'generate-alt',
    content: `Cinematic ${prompt.toLowerCase()} with refined lighting and shallow depth of field`,
    data: {
      alt: `Cinematic ${prompt.toLowerCase()} with refined lighting and shallow depth of field`,
      longDescription: `A carefully composed image depicting ${prompt}, rendered with the signature RPIX approach to light and shadow.`,
    },
  }),
  'create-gallery': (prompt) => ({
    id: nanoid(),
    action: 'create-gallery',
    content: `Gallery structure created for “${prompt}”.`,
    data: {
      title: prompt,
      layout: 'cinematic',
      items: [
        { order: 1, aspect: '3/2', caption: 'Opening frame' },
        { order: 2, aspect: '2/3', caption: 'Detail study' },
        { order: 3, aspect: '16/9', caption: 'Environment' },
        { order: 4, aspect: '1/1', caption: 'Portrait' },
        { order: 5, aspect: '21/9', caption: 'Cinematic wide' },
      ],
    },
    suggestions: ['Enable before/after on item 2', 'Add 3D transition between 3 → 4'],
  }),
  'optimize-images': () => ({
    id: nanoid(),
    action: 'optimize-images',
    content: 'Image optimization plan ready.',
    data: {
      formats: ['avif', 'webp', 'jpg'],
      sizes: [640, 960, 1280, 1920, 2560],
      quality: { avif: 65, webp: 75, jpg: 82 },
      lazy: true,
      blurhash: true,
      cloudflareImages: true,
    },
  }),
  'create-thumbnails': (prompt) => ({
    id: nanoid(),
    action: 'create-thumbnails',
    content: `Thumbnail set generated for “${prompt}”.`,
    data: {
      variants: [
        { name: 'og', width: 1200, height: 630 },
        { name: 'card', width: 800, height: 600 },
        { name: 'square', width: 600, height: 600 },
        { name: 'story', width: 1080, height: 1920 },
      ],
    },
  }),
  translate: (prompt, ctx) => ({
    id: nanoid(),
    action: 'translate',
    content: `[${ctx?.lang ?? 'fr'}] ${prompt}`,
    data: {
      source: prompt,
      target: ctx?.lang ?? 'fr',
      result: demoTranslate(prompt, String(ctx?.lang ?? 'fr')),
    },
  }),
  'social-posts': (prompt) => ({
    id: nanoid(),
    action: 'social-posts',
    content: 'Social package ready.',
    data: {
      instagram: `New work. ${prompt}\n\nCrafted with intention.\n\n#RPIX #Photography #Cinematic`,
      twitter: `${prompt} — now live on rpix.studio`,
      linkedin: `We're proud to share: ${prompt}. A project defined by restraint, light, and lasting image-making.`,
    },
  }),
  'design-improve': (prompt) => ({
    id: nanoid(),
    action: 'design-improve',
    content: `Design review for “${prompt}”.`,
    data: {
      findings: [
        { severity: 'medium', area: 'Typography', note: 'Increase body line-height to 1.7 for long-form readability.' },
        { severity: 'low', area: 'Spacing', note: 'Section rhythm is strong; consider 8pt baseline consistency on mobile.' },
        { severity: 'high', area: 'Contrast', note: 'Muted text on dark cards is close to AA — lift muted-fg slightly.' },
        { severity: 'low', area: 'Motion', note: 'Stagger delay on portfolio grid feels premium; keep under 100ms per item.' },
      ],
      quickWins: ['Add focus rings on all interactive cards', 'Preload hero poster frame'],
    },
  }),
  'upload-media': () => ({
    id: nanoid(),
    action: 'upload-media',
    content: 'Media pipeline ready. Connect Cloudflare Images / Stream credentials in Admin → Integrations.',
    data: { providers: ['cloudflare-images', 'cloudflare-stream', 'r2'] },
  }),
  summarize: (prompt) => ({
    id: nanoid(),
    action: 'summarize',
    content: prompt.split(/\s+/).slice(0, 40).join(' ') + (prompt.split(/\s+/).length > 40 ? '…' : ''),
  }),
  rewrite: (prompt) => ({
    id: nanoid(),
    action: 'rewrite',
    content: rewriteLuxury(prompt),
    suggestions: ['Make shorter', 'Make more technical', 'Add a call to action'],
  }),
};

function generateBlogDraft(topic: string): string {
  return `# ${topic}

There is a precision to great image-making that has little to do with equipment and everything to do with attention.

## The Core Idea

${topic} is not a technique to collect — it is a way of seeing. When the frame is reduced to what matters, emotion has room to arrive.

## In Practice

1. Begin with constraint. One lens, one light, one intention.
2. Delay the grade. Understand the capture before you reshape it.
3. Print something. Screens flatter; paper tells the truth.

## Closing

Craft compounds. The work you refuse is as important as the work you release.

---
*Draft generated by RPIX AI · Review and personalize before publishing.*`;
}

function extractKeywords(text: string): string[] {
  const stop = new Set(['the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'for', 'with', 'on']);
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 2 && !stop.has(w))
    .slice(0, 8);
}

function demoTranslate(text: string, lang: string): string {
  if (lang === 'fr') return `[FR] ${text}`;
  if (lang === 'de') return `[DE] ${text}`;
  if (lang === 'es') return `[ES] ${text}`;
  return `[${lang}] ${text}`;
}

function rewriteLuxury(text: string): string {
  return text
    .replace(/\bvery\b/gi, 'decidedly')
    .replace(/\bnice\b/gi, 'refined')
    .replace(/\bgood\b/gi, 'considered')
    .replace(/\bawesome\b/gi, 'exceptional')
    .replace(/\bphotos?\b/gi, 'images')
    .trim();
}

export class AIAssistant {
  private messages: AIMessage[] = [];
  private provider: AIProvider = 'demo';

  constructor(provider: AIProvider = 'demo') {
    this.provider = provider;
    this.messages.push({
      id: nanoid(),
      role: 'system',
      content:
        'You are the RPIX creative AI — precise, elegant, practical. You help with content, SEO, media, and design inside the RPIX Creative OS.',
      timestamp: Date.now(),
    });
  }

  getMessages(): AIMessage[] {
    return this.messages.filter((m) => m.role !== 'system');
  }

  async chat(prompt: string): Promise<AIMessage> {
    const userMsg: AIMessage = {
      id: nanoid(),
      role: 'user',
      content: prompt,
      timestamp: Date.now(),
    };
    this.messages.push(userMsg);

    const action = inferAction(prompt);
    const result = await this.run({ action, prompt });

    const assistantMsg: AIMessage = {
      id: nanoid(),
      role: 'assistant',
      content: result.content,
      action,
      timestamp: Date.now(),
      metadata: { data: result.data, suggestions: result.suggestions },
    };
    this.messages.push(assistantMsg);
    return assistantMsg;
  }

  async run(request: AIRequest): Promise<AIResponse> {
    // Production: route to OpenAI / Anthropic / Workers AI
    if (this.provider === 'demo') {
      await delay(600 + Math.random() * 800);
      const handler = DEMO_HANDLERS[request.action];
      return handler(request.prompt, request.context);
    }

    // Placeholder for real providers
    await delay(400);
    return DEMO_HANDLERS[request.action](request.prompt, request.context);
  }

  clear() {
    this.messages = this.messages.filter((m) => m.role === 'system');
  }
}

function inferAction(prompt: string): AIAction {
  const p = prompt.toLowerCase();
  if (p.includes('seo') || p.includes('meta')) return 'generate-seo';
  if (p.includes('alt text') || p.includes('alt-text')) return 'generate-alt';
  if (p.includes('gallery')) return 'create-gallery';
  if (p.includes('blog') || p.includes('article') || p.includes('write')) return 'write-blog';
  if (p.includes('optimize') && p.includes('image')) return 'optimize-images';
  if (p.includes('thumbnail')) return 'create-thumbnails';
  if (p.includes('translate')) return 'translate';
  if (p.includes('social') || p.includes('instagram') || p.includes('tweet')) return 'social-posts';
  if (p.includes('design') || p.includes('improve') || p.includes('review')) return 'design-improve';
  if (p.includes('summarize') || p.includes('summary')) return 'summarize';
  if (p.includes('rewrite') || p.includes('rephrase')) return 'rewrite';
  return 'rewrite';
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

let assistant: AIAssistant | null = null;

export function getAI(): AIAssistant {
  if (!assistant) assistant = new AIAssistant('demo');
  return assistant;
}

export const AI_ACTIONS: { id: AIAction; label: string; description: string }[] = [
  { id: 'write-blog', label: 'Write Blog', description: 'Draft a journal article' },
  { id: 'generate-seo', label: 'Generate SEO', description: 'Titles, meta, schema' },
  { id: 'create-gallery', label: 'Create Gallery', description: 'Structure a visual gallery' },
  { id: 'generate-alt', label: 'ALT Text', description: 'Accessible image descriptions' },
  { id: 'optimize-images', label: 'Optimize Images', description: 'Formats, sizes, CDN plan' },
  { id: 'create-thumbnails', label: 'Thumbnails', description: 'Social and card crops' },
  { id: 'translate', label: 'Translate', description: 'Multi-language content' },
  { id: 'social-posts', label: 'Social Posts', description: 'Platform-ready copy' },
  { id: 'design-improve', label: 'Design Review', description: 'UX and visual critique' },
  { id: 'rewrite', label: 'Rewrite', description: 'Elevate existing copy' },
  { id: 'summarize', label: 'Summarize', description: 'Condense long content' },
  { id: 'upload-media', label: 'Media Pipeline', description: 'Cloudflare media setup' },
];
