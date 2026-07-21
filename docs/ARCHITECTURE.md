# RPIX Creative OS — Architecture

> A scalable digital ecosystem for a premium creative brand.  
> Not a website template — an operating system for visual craft.

## Philosophy

- Every pixel has purpose
- Every animation tells a story
- Every interaction feels handcrafted
- Architecture must evolve for years without rebuilds

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Astro 5 (static + islands) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 + design tokens |
| Animation | GSAP + ScrollTrigger |
| Smooth scroll | Lenis |
| 3D | Three.js |
| Interactivity | React islands (Admin OS) |
| Deploy target | Cloudflare Pages + Workers |
| Media | Cloudflare Images + Stream + R2 |

## Monorepo layout

```
rpix/
├── src/
│   ├── components/          # UI, layout, effects, three, admin
│   │   ├── admin/           # Full Admin OS (visual editor)
│   │   ├── effects/         # Runtime boot (Lenis, cursor, loader)
│   │   ├── home/ layout/ ui/ portfolio/ blog/ store/
│   │   └── three/           # WebGL scenes
│   ├── content/             # Future MD/MDX content collections
│   ├── data/                # Seed content + site config + modules
│   ├── hooks/
│   ├── layouts/             # BaseLayout
│   ├── lib/
│   │   ├── ai/              # AI assistant (demo + provider adapters)
│   │   ├── animation/       # Lenis, GSAP reveals, cursor, transitions
│   │   ├── content/         # RSS, content helpers
│   │   ├── customizer/      # Theme store, history, live CSS vars
│   │   ├── design-system/   # Tokens (Obsidian theme)
│   │   ├── history/         # Editor undo/redo/versions/drafts
│   │   ├── seo/             # JSON-LD schemas
│   │   └── utils/
│   ├── pages/               # File-based routes (all site sections)
│   ├── styles/global.css    # Design system CSS
│   └── types/               # Platform-wide TypeScript contracts
├── public/
├── docs/
└── admin-docs/
```

## Module system

Modules are declared in `src/data/site.ts` → `MODULES`.

**Enabled now:** core, portfolio, blog, store, courses, members, admin, ai  

**Scaffolded for future (disabled):** CRM, booking, client portal, automation, analytics, Instagram, Telegram, payments, marketplace, mobile

Enabling a module is a config + route registration concern — not a rebuild.

## Design system

Single source of truth: `src/lib/design-system/tokens.ts` (`RPIX_THEME`).

Runtime application via CSS custom properties (`--rpix-*`) controlled by the Customizer store. Admin changes persist to `localStorage` and can be published.

### Visual language

- Background: `#050505` Obsidian
- Foreground: `#F5F2EB` Warm platinum
- Accent: `#C9A84C` Refined gold
- Motion: cinematic eases (`power3/4`, custom cubic-beziers)
- Effects: film grain, vignette, magnetic cursor, page curtains

## Public routes

| Path | Purpose |
|------|---------|
| `/` | Immersive homepage + Three.js hero |
| `/portfolio` | Filterable cinematic portfolio |
| `/portfolio/[slug]` | Case detail, gallery, before/after |
| `/photography` `/videography` `/color-grading` | Discipline hubs |
| `/projects` `/projects/[slug]` | Long-form case studies |
| `/blog` `/blog/[slug]` | Journal + reading progress + TOC + bookmarks |
| `/store` `/store/[slug]` | Digital + physical products |
| `/courses` `/courses/[slug]` | Course catalog + curriculum |
| `/downloads` | Free resources |
| `/about` `/contact` `/faq` | Studio |
| `/search` | Unified content search |
| `/members` | Member portal (auth-ready) |
| `/admin` | **Admin OS** visual environment |
| `/rss.xml` | Blog RSS |

## Admin OS

Route: `/admin` — React client island.

### Capabilities

1. **Live visual editor** — click components in device-framed preview  
2. **Customizer** — 21 sections (colors, type, glass, cursor, particles, Three.js, layouts…)  
3. **Undo / Redo / History** — stack with labels  
4. **Draft / Publish / Versions** — local persistence + version snapshots  
5. **AI Assistant** — gallery, blog, SEO, ALT, optimize, translate, social, design review  
6. **Media library** — Cloudflare Images/Stream ready  
7. **Content browser** — portfolio, blog, store, courses, projects  
8. **Module manager** — enable/disable future systems  
9. **Theme export** — JSON download  

### Architecture notes

- `CustomizerStore` — singleton, observable, history-aware  
- `EditorHistory` — undo stack + named versions + drafts  
- `AIAssistant` — provider switch (`demo` | `openai` | `anthropic` | `cloudflare`)  

Production wiring:

- Persist theme → Cloudflare KV / D1  
- Auth → Cloudflare Access or Auth.js  
- AI → Workers AI / OpenAI / Anthropic keys via Workers secrets  
- Media → direct upload to Cloudflare Images & Stream  

## Performance

- Astro islands: only Admin + Hero Three.js hydrate  
- Manual chunks: `three`, `gsap`, `lenis`  
- `prefers-reduced-motion` respected globally  
- Mobile particle budget reduced  
- Prefetch: viewport strategy  
- Static output for edge CDN  

## Accessibility

- Skip link, focus-visible rings  
- Semantic landmarks  
- Before/after slider keyboard support  
- Reduced motion disables Lenis/cursor/complex tweens  
- Color contrast targeting AAA on primary text  

## Deployment (Cloudflare)

```bash
npm run build
# Output: dist/
# Connect GitHub → Cloudflare Pages
# Build command: npm run build
# Output directory: dist
# Node: 22+
```

Optional Workers:

- `/api/ai/*` — AI proxy  
- `/api/contact` — form handler  
- `/api/checkout` — Stripe  
- Image resizing via Cloudflare Images  

## Extending

1. **New page** — add `src/pages/...` using `BaseLayout`  
2. **New module** — register in `MODULES`, add routes, gate by `enabled`  
3. **New content type** — extend `src/types`, seed in `src/data/content.ts`, later move to CMS/D1  
4. **New customizer section** — add to `CustomizerSection` union + `CUSTOMIZER_SECTIONS` + inspector UI  
5. **New AI action** — extend `AIAction` + handler in `assistant.ts`  

## Quality bar

Comparable to Apple / Leica / Porsche digital, and Awwwards-level studios (Freight, Active Theory, Dogstudio, Obys).

Handcrafted. Premium. Timeless.
