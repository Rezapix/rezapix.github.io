# RPIX — Creative Operating System

**Crafted light. Timeless image.**

A world-class luxury digital ecosystem for a premium creative brand — photography, videography, color grading, store, courses, journal, members, and a full browser-based Admin OS with live visual editing, advanced customizer, and integrated AI.

> Not a template. Not WordPress. An evolvable creative platform.

## Quick start

```bash
# Node 22+
npm install
npm run dev
```

- Site: [http://localhost:4321](http://localhost:4321)  
- Admin OS: [http://localhost:4321/admin](http://localhost:4321/admin)

```bash
npm run build    # production → dist/
npm run preview  # preview build
```

## What's included

### Public experience
- Immersive homepage with Three.js hero
- Portfolio (filterable) + discipline hubs
- Before/after grade comparison
- Projects / case studies
- Journal with reading progress, TOC, bookmarks, RSS
- Store (digital + physical)
- Courses with curriculum
- Downloads, About, Contact, FAQ, Search
- Members area (auth-ready)
- Custom cursor, Lenis smooth scroll, GSAP reveals
- Cinematic page transitions, grain, vignette
- Fully responsive, accessible, SEO-ready

### Admin OS (`/admin`)
- Realtime visual preview (desktop / tablet / mobile)
- Component selection & inspector
- **Customizer** — colors, typography, glass, cursor, particles, lighting, Three.js, transitions, effects, navigation, layouts…
- Undo / Redo / History timeline
- Draft · Publish · Version snapshots
- AI assistant (blog, SEO, galleries, ALT, social, design review…)
- Media library (Cloudflare Images / Stream ready)
- Content browser
- Module system (CRM, booking, payments… scaffolded)
- Theme JSON export

### Architecture
- Astro + TypeScript + Tailwind 4 + React islands
- GSAP · Three.js · Lenis
- Modular `MODULES` registry for multi-year evolution
- Design tokens → CSS variables → live customizer
- Cloudflare Pages deployment target

## Docs

- [Architecture](./docs/ARCHITECTURE.md) — system design, modules, extension points

## Design language

| Token | Value |
|-------|-------|
| Background | `#050505` Obsidian |
| Foreground | `#F5F2EB` Platinum |
| Accent | `#C9A84C` Gold |
| Motion | Cinematic eases, GPU-friendly |

Inspiration: Apple · Leica · Porsche · Studio Freight · Active Theory · Dogstudio · Obys

## Project structure (high level)

```
src/
  components/   UI · layout · three · admin
  data/         Content seed · site · modules
  lib/          Design system · animation · AI · customizer · history
  pages/        All routes including /admin
  styles/       Global design system
  types/        Platform contracts
```

## License

UNLICENSED — All rights reserved · RPIX Studio
