# RPIX Admin OS

A browser-based **visual editing environment** — not a CMS dashboard.

URL: `/admin`

## Surfaces

| Zone | Role |
|------|------|
| Top bar | Undo/redo, device preview, draft, publish, open live |
| Left rail | Pages · Customizer · Content · Media · AI · Modules · Settings |
| Panel | Context tools for active rail item |
| Canvas | Live themed preview with selectable regions |
| Inspector | Token controls or component props + history |

## Customizer sections

Colors · Typography · Spacing · Glass · Cursor · Buttons · Cards · Gallery · Backgrounds · Lighting · Particles · Three.js · Transitions · Animation · Effects · Navigation · Header · Footer · Blog layout · Portfolio layout · Store layout

All changes:

1. Update in-memory theme  
2. Push history entry  
3. Apply CSS variables to `:root`  
4. Mark draft until Publish  

## Keyboard-minded workflows

- Iterate colors → watch canvas  
- Toggle grain/vignette/cursor  
- Save draft often  
- Publish creates a version snapshot  
- Export JSON from Settings for backup / multi-env  

## AI actions

| Action | Result |
|--------|--------|
| Write Blog | Markdown draft |
| Generate SEO | Title, description, keywords, schema |
| Create Gallery | Structured gallery plan |
| ALT Text | Accessible descriptions |
| Optimize Images | Format/size/CDN plan |
| Thumbnails | OG/card/story crops |
| Translate | Multi-language stubs |
| Social Posts | IG / X / LinkedIn copy |
| Design Review | Severity-tagged findings |
| Rewrite / Summarize | Copy tools |

Swap `demo` provider for OpenAI, Anthropic, or Cloudflare Workers AI in `src/lib/ai/assistant.ts`.

## Production checklist

- [ ] Protect `/admin` with Cloudflare Access  
- [ ] Persist theme + content to D1/KV  
- [ ] Wire real media uploads  
- [ ] Connect AI provider secrets  
- [ ] Add role-based permissions (`editor` / `admin` / `owner`)  
- [ ] Audit log for publish events  
