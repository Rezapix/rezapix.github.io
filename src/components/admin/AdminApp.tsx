/**
 * RPIX Admin OS — Visual Editing Environment
 * Not a dashboard. A complete creative control surface.
 */
import { useEffect, useMemo, useState } from 'react';
import {
  getCustomizer,
  CUSTOMIZER_SECTIONS,
} from '@/lib/customizer/store';
import { getEditorHistory } from '@/lib/history/editor-history';
import { getAI, AI_ACTIONS } from '@/lib/ai/assistant';
import type { AIMessage, CustomizerSection, ThemeConfig } from '@/types';
import { MODULES } from '@/data/site';
import { PORTFOLIO, BLOG, PRODUCTS, COURSES, PROJECTS } from '@/data/content';

type RailView =
  | 'pages'
  | 'customizer'
  | 'media'
  | 'content'
  | 'ai'
  | 'modules'
  | 'settings';

type DevicePreview = 'desktop' | 'tablet' | 'mobile';

const PAGES = [
  { id: 'home', label: 'Homepage', path: '/' },
  { id: 'portfolio', label: 'Portfolio', path: '/portfolio' },
  { id: 'photography', label: 'Photography', path: '/photography' },
  { id: 'videography', label: 'Videography', path: '/videography' },
  { id: 'color', label: 'Color Grading', path: '/color-grading' },
  { id: 'projects', label: 'Projects', path: '/projects' },
  { id: 'blog', label: 'Journal', path: '/blog' },
  { id: 'store', label: 'Store', path: '/store' },
  { id: 'courses', label: 'Courses', path: '/courses' },
  { id: 'downloads', label: 'Downloads', path: '/downloads' },
  { id: 'about', label: 'About', path: '/about' },
  { id: 'contact', label: 'Contact', path: '/contact' },
  { id: 'faq', label: 'FAQ', path: '/faq' },
  { id: 'members', label: 'Members', path: '/members' },
];

const RAIL: { id: RailView; label: string; icon: string }[] = [
  { id: 'pages', label: 'Pages', icon: '▣' },
  { id: 'customizer', label: 'Customizer', icon: '◐' },
  { id: 'content', label: 'Content', icon: '¶' },
  { id: 'media', label: 'Media', icon: '▦' },
  { id: 'ai', label: 'AI', icon: '✦' },
  { id: 'modules', label: 'Modules', icon: '⬡' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
];

export default function AdminApp() {
  const [rail, setRail] = useState<RailView>('customizer');
  const [section, setSection] = useState<CustomizerSection>('colors');
  const [theme, setTheme] = useState<ThemeConfig>(() => getCustomizer().getTheme());
  const [page, setPage] = useState(PAGES[0]);
  const [device, setDevice] = useState<DevicePreview>('desktop');
  const [draft, setDraft] = useState(true);
  const [aiInput, setAiInput] = useState('');
  const [aiBusy, setAiBusy] = useState(false);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>('hero');
  const [historyTick, setHistoryTick] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [contentTab, setContentTab] = useState<'portfolio' | 'blog' | 'store' | 'courses' | 'projects'>('portfolio');
  const [panelOpen, setPanelOpen] = useState(true);
  const [inspectorOpen, setInspectorOpen] = useState(true);

  const customizer = useMemo(() => getCustomizer(), []);
  const history = useMemo(() => getEditorHistory(), []);
  const ai = useMemo(() => getAI(), []);

  useEffect(() => {
    const unsub = customizer.subscribe((t) => {
      setTheme({ ...t });
      setDraft(customizer.isDraft());
      setHistoryTick((n) => n + 1);
    });
    customizer.applyToDOM();
    setAiMessages(ai.getMessages());
    history.push('open', 'Opened Admin OS', customizer.getTheme());
    return unsub;
  }, [customizer, history, ai]);

  const flash = (msg: string) => {
    setStatusMsg(msg);
    window.setTimeout(() => setStatusMsg(''), 2800);
  };

  const undo = () => {
    customizer.undo();
    flash('Undo');
  };
  const redo = () => {
    customizer.redo();
    flash('Redo');
  };

  const publish = () => {
    customizer.publish();
    history.createVersion('Published theme', customizer.getTheme(), 'admin');
    history.publishVersion(history.getVersions().at(-1)?.id ?? '');
    setDraft(false);
    flash('Published live');
  };

  const saveDraft = () => {
    customizer.saveDraft();
    history.saveDraft('theme', 'theme', customizer.getTheme(), false);
    flash('Draft saved');
  };

  const resetTheme = () => {
    if (confirm('Reset all customizer values to Obsidian defaults?')) {
      customizer.reset();
      flash('Reset to defaults');
    }
  };

  const runAI = async (prompt: string, action?: string) => {
    if (!prompt.trim() || aiBusy) return;
    setAiBusy(true);
    setAiInput('');
    try {
      if (action) {
        const res = await ai.run({
          action: action as Parameters<typeof ai.run>[0]['action'],
          prompt,
        });
        setAiMessages((m) => [
          ...m,
          {
            id: res.id + '-u',
            role: 'user',
            content: prompt,
            timestamp: Date.now(),
          },
          {
            id: res.id,
            role: 'assistant',
            content: res.content + (res.data ? '\n\n```json\n' + JSON.stringify(res.data, null, 2) + '\n```' : ''),
            action: res.action,
            timestamp: Date.now(),
            metadata: { suggestions: res.suggestions },
          },
        ]);
      } else {
        const msg = await ai.chat(prompt);
        setAiMessages(ai.getMessages());
        void msg;
      }
    } finally {
      setAiBusy(false);
    }
  };

  const deviceWidth =
    device === 'desktop' ? '100%' : device === 'tablet' ? '768px' : '390px';

  // force re-read canUndo when historyTick changes
  void historyTick;
  const canUndo = customizer.canUndo();
  const canRedo = customizer.canRedo();

  return (
    <div className="admin-shell" style={{ fontFamily: 'var(--font-body)' }}>
      {/* TOPBAR */}
      <header className="admin-topbar">
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="font-medium tracking-[0.3em] text-sm hover:text-[var(--rpix-gold)] transition-colors"
            data-no-transition
          >
            RPIX
          </a>
          <span className="text-[10px] uppercase tracking-widest text-[var(--rpix-muted-fg)] px-2 py-0.5 rounded border border-white/10">
            Admin OS
          </span>
          {draft && (
            <span className="text-[10px] uppercase tracking-widest text-amber-400/90 px-2 py-0.5 rounded bg-amber-400/10">
              Draft
            </span>
          )}
          {statusMsg && (
            <span className="text-[11px] text-[var(--rpix-gold)] animate-pulse">{statusMsg}</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Device preview */}
          {(['desktop', 'tablet', 'mobile'] as DevicePreview[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDevice(d)}
              className={`px-2.5 py-1 rounded text-[11px] capitalize ${
                device === d
                  ? 'bg-white/10 text-white'
                  : 'text-[var(--rpix-muted-fg)] hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
          <div className="w-px h-4 bg-white/10 mx-2" />
          <button
            type="button"
            onClick={undo}
            disabled={!canUndo}
            className="px-2 py-1 text-[11px] text-[var(--rpix-muted-fg)] hover:text-white disabled:opacity-30"
            title="Undo"
          >
            ↶ Undo
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={!canRedo}
            className="px-2 py-1 text-[11px] text-[var(--rpix-muted-fg)] hover:text-white disabled:opacity-30"
            title="Redo"
          >
            ↷ Redo
          </button>
          <div className="w-px h-4 bg-white/10 mx-2" />
          <button
            type="button"
            onClick={saveDraft}
            className="px-3 py-1.5 rounded-md text-[11px] border border-white/10 hover:border-white/20"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={publish}
            className="px-3 py-1.5 rounded-md text-[11px] bg-[var(--rpix-gold)] text-black font-medium hover:brightness-110"
          >
            Publish
          </button>
          <a
            href={page.path}
            target="_blank"
            rel="noopener"
            className="px-3 py-1.5 rounded-md text-[11px] text-[var(--rpix-muted-fg)] hover:text-white"
            data-no-transition
          >
            Open ↗
          </a>
        </div>
      </header>

      {/* RAIL */}
      <nav className="admin-rail" aria-label="Admin navigation">
        {RAIL.map((r) => (
          <button
            key={r.id}
            type="button"
            title={r.label}
            aria-label={r.label}
            onClick={() => {
              setRail(r.id);
              setPanelOpen(true);
            }}
            className={`admin-rail-btn ${rail === r.id ? 'is-active' : ''}`}
          >
            <span className="text-base leading-none">{r.icon}</span>
          </button>
        ))}
        <div className="flex-1" />
        <a href="/" className="admin-rail-btn" title="Exit to site" data-no-transition>
          ←
        </a>
      </nav>

      {/* LEFT PANEL */}
      <aside className={`admin-panel ${panelOpen ? 'is-open' : ''}`}>
        {rail === 'pages' && (
          <>
            <p className="admin-section-title">Pages</p>
            <div className="px-2 pb-4">
              {PAGES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-[12px] mb-0.5 transition-colors ${
                    page.id === p.id
                      ? 'bg-[rgba(201,168,76,0.12)] text-[var(--rpix-gold)]'
                      : 'text-[var(--rpix-muted-fg)] hover:bg-white/[0.03] hover:text-white'
                  }`}
                >
                  {p.label}
                  <span className="block text-[10px] opacity-50 mt-0.5">{p.path}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {rail === 'customizer' && (
          <>
            <p className="admin-section-title">Customizer</p>
            <div className="px-2 pb-4">
              {CUSTOMIZER_SECTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSection(s.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-[12px] mb-0.5 flex items-center gap-2 transition-colors ${
                    section === s.id
                      ? 'bg-[rgba(201,168,76,0.12)] text-[var(--rpix-gold)]'
                      : 'text-[var(--rpix-muted-fg)] hover:bg-white/[0.03] hover:text-white'
                  }`}
                >
                  <span className="opacity-60 w-4 text-center">{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </div>
          </>
        )}

        {rail === 'content' && (
          <>
            <p className="admin-section-title">Content</p>
            <div className="flex gap-1 px-3 mb-3">
              {(['portfolio', 'blog', 'store', 'courses', 'projects'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setContentTab(t)}
                  className={`px-2 py-1 rounded text-[10px] capitalize ${
                    contentTab === t ? 'bg-white/10 text-white' : 'text-[var(--rpix-muted-fg)]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="px-3 pb-4 space-y-1 overflow-y-auto">
              {(contentTab === 'portfolio'
                ? PORTFOLIO
                : contentTab === 'blog'
                  ? BLOG
                  : contentTab === 'store'
                    ? PRODUCTS
                    : contentTab === 'courses'
                      ? COURSES
                      : PROJECTS
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedComponent(item.id);
                    setInspectorOpen(true);
                    flash(`Selected ${item.title}`);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/[0.03] border border-transparent hover:border-white/5"
                >
                  <span className="text-[12px] block truncate">{item.title}</span>
                  <span className="text-[10px] text-[var(--rpix-muted-fg)]">{item.status}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {rail === 'media' && (
          <>
            <p className="admin-section-title">Media Library</p>
            <div className="px-3 pb-4">
              <div className="border border-dashed border-white/15 rounded-xl p-8 text-center mb-4 hover:border-[var(--rpix-gold)]/40 transition-colors cursor-pointer">
                <p className="text-[12px] mb-1">Drop files or click</p>
                <p className="text-[10px] text-[var(--rpix-muted-fg)]">
                  Images · Video · GIF · Lottie · GLB · HDRI · Audio
                </p>
              </div>
              <p className="text-[10px] text-[var(--rpix-muted-fg)] mb-3 uppercase tracking-wider">
                Cloudflare
              </p>
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between p-2 rounded bg-white/[0.03]">
                  <span>Images</span>
                  <span className="text-[var(--rpix-gold)]">Ready</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-white/[0.03]">
                  <span>Stream</span>
                  <span className="text-[var(--rpix-gold)]">Ready</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-white/[0.03]">
                  <span>R2 Storage</span>
                  <span className="text-[var(--rpix-muted-fg)]">Configure</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {PORTFOLIO.slice(0, 6).map((p) => (
                  <div
                    key={p.id}
                    className="aspect-square rounded-md bg-gradient-to-br from-[#1a1814] to-[#0c0c0c] border border-white/5 flex items-center justify-center"
                    title={p.title}
                  >
                    <span className="text-[8px] text-white/20 tracking-widest">RPIX</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {rail === 'ai' && (
          <>
            <p className="admin-section-title">AI Assistant</p>
            <div className="px-3 pb-3 flex flex-wrap gap-1">
              {AI_ACTIONS.slice(0, 8).map((a) => (
                <button
                  key={a.id}
                  type="button"
                  title={a.description}
                  onClick={() => runAI(a.label + ': ' + page.label, a.id)}
                  className="px-2 py-1 rounded text-[10px] border border-white/10 text-[var(--rpix-muted-fg)] hover:border-[var(--rpix-gold)]/40 hover:text-[var(--rpix-gold)]"
                >
                  {a.label}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto px-3 space-y-3 pb-3 min-h-[200px]">
              {aiMessages.length === 0 && (
                <p className="text-[11px] text-[var(--rpix-muted-fg)] leading-relaxed">
                  Ask RPIX AI to write blogs, generate SEO, build galleries, optimize media,
                  translate, or review design.
                </p>
              )}
              {aiMessages.map((m) => (
                <div
                  key={m.id}
                  className={`text-[11px] leading-relaxed p-2.5 rounded-lg ${
                    m.role === 'user'
                      ? 'bg-white/[0.04] ml-4'
                      : 'bg-[rgba(201,168,76,0.08)] mr-2 border border-[rgba(201,168,76,0.12)]'
                  }`}
                >
                  <p className="text-[9px] uppercase tracking-wider opacity-50 mb-1">{m.role}</p>
                  <pre className="whitespace-pre-wrap font-[inherit] text-[11px] max-h-48 overflow-y-auto">
                    {m.content}
                  </pre>
                </div>
              ))}
              {aiBusy && (
                <p className="text-[11px] text-[var(--rpix-gold)] animate-pulse">Thinking…</p>
              )}
            </div>
            <div className="p-3 border-t border-white/5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runAI(aiInput);
                }}
                className="flex gap-2"
              >
                <input
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Ask AI…"
                  className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-[12px] outline-none focus:border-[var(--rpix-gold)]/50"
                />
                <button
                  type="submit"
                  disabled={aiBusy}
                  className="px-3 py-2 rounded-lg bg-[var(--rpix-gold)] text-black text-[11px] font-medium disabled:opacity-40"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        )}

        {rail === 'modules' && (
          <>
            <p className="admin-section-title">Module System</p>
            <div className="px-3 pb-4 space-y-2">
              <p className="text-[11px] text-[var(--rpix-muted-fg)] mb-3 leading-relaxed">
                Enable future systems without rebuilding. Architecture is modular by design.
              </p>
              {MODULES.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02]"
                >
                  <div className="min-w-0">
                    <p className="text-[12px] truncate">{m.name}</p>
                    <p className="text-[10px] text-[var(--rpix-muted-fg)] truncate">{m.description}</p>
                  </div>
                  <span
                    className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ml-2 ${
                      m.enabled
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-white/5 text-[var(--rpix-muted-fg)]'
                    }`}
                  >
                    {m.enabled ? 'On' : 'Off'}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {rail === 'settings' && (
          <>
            <p className="admin-section-title">Settings</p>
            <div className="px-3 pb-4 space-y-4">
              <div className="admin-field !px-0">
                <label>Site name</label>
                <input type="text" defaultValue="RPIX" />
              </div>
              <div className="admin-field !px-0">
                <label>Tagline</label>
                <input type="text" defaultValue="Crafted Light. Timeless Image." />
              </div>
              <div className="admin-field !px-0">
                <label>Contact email</label>
                <input type="email" defaultValue="studio@rpix.studio" />
              </div>
              <div className="admin-field !px-0">
                <label>Default locale</label>
                <select defaultValue="en">
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
              <hr className="border-white/5" />
              <button
                type="button"
                onClick={() => {
                  const json = customizer.exportJSON();
                  const blob = new Blob([json], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'rpix-theme.json';
                  a.click();
                  flash('Theme exported');
                }}
                className="w-full py-2 rounded-lg border border-white/10 text-[11px] hover:border-white/20"
              >
                Export Theme JSON
              </button>
              <button
                type="button"
                onClick={resetTheme}
                className="w-full py-2 rounded-lg border border-red-500/30 text-[11px] text-red-400 hover:bg-red-500/10"
              >
                Reset Theme Defaults
              </button>
              <div className="text-[10px] text-[var(--rpix-muted-fg)] leading-relaxed pt-2">
                <p>Theme v{theme.version}</p>
                <p>History entries: {customizer.getHistory().length}</p>
                <p>Versions: {history.getVersions().length}</p>
              </div>
            </div>
          </>
        )}
      </aside>

      {/* CANVAS — live preview */}
      <section className="admin-canvas">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#0a0a0a]">
          <div className="flex items-center gap-2 text-[11px] text-[var(--rpix-muted-fg)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
            Live Preview
            <span className="opacity-40">·</span>
            <span>{page.path}</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="text-[10px] text-[var(--rpix-muted-fg)] hover:text-white lg:hidden"
              onClick={() => setPanelOpen((v) => !v)}
            >
              Panel
            </button>
            <button
              type="button"
              className="text-[10px] text-[var(--rpix-muted-fg)] hover:text-white lg:hidden"
              onClick={() => setInspectorOpen((v) => !v)}
            >
              Inspector
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto flex justify-center bg-[#050505] p-4 md:p-8">
          <div
            className="bg-[var(--rpix-bg)] border border-white/10 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 origin-top"
            style={{
              width: deviceWidth,
              maxWidth: '100%',
              minHeight: device === 'mobile' ? 720 : 560,
            }}
          >
            {/* Simulated site chrome + live token preview */}
            <PreviewCanvas
              theme={theme}
              pageLabel={page.label}
              selected={selectedComponent}
              onSelect={setSelectedComponent}
            />
          </div>
        </div>
      </section>

      {/* INSPECTOR */}
      <aside className={`admin-inspector ${inspectorOpen ? 'is-open' : ''}`}>
        {rail === 'customizer' ? (
          <CustomizerInspector section={section} theme={theme} customizer={customizer} />
        ) : (
          <ComponentInspector
            selected={selectedComponent}
            theme={theme}
            onSelect={setSelectedComponent}
          />
        )}

        {/* History panel */}
        <div className="border-t border-white/5 mt-auto">
          <p className="admin-section-title">History</p>
          <div className="px-3 pb-4 max-h-40 overflow-y-auto space-y-1">
            {[...customizer.getHistory()].reverse().slice(0, 12).map((h, i, arr) => {
              const realIndex = customizer.getHistory().length - 1 - i;
              const active = realIndex === customizer.getHistoryIndex();
              return (
                <div
                  key={h.id}
                  className={`text-[10px] px-2 py-1.5 rounded ${
                    active
                      ? 'bg-[rgba(201,168,76,0.12)] text-[var(--rpix-gold)]'
                      : 'text-[var(--rpix-muted-fg)]'
                  }`}
                >
                  <span className="opacity-50 mr-1">
                    {new Date(h.timestamp).toLocaleTimeString()}
                  </span>
                  {h.label}
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ─── Preview Canvas ─── */

function PreviewCanvas({
  theme,
  pageLabel,
  selected,
  onSelect,
}: {
  theme: ThemeConfig;
  pageLabel: string;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const c = theme.colors;
  const selectable = (id: string) =>
    `cursor-pointer outline-offset-2 transition-all ${
      selected === id ? 'outline outline-1 outline-[var(--rpix-gold)]' : 'hover:outline hover:outline-1 hover:outline-white/20'
    }`;

  return (
    <div
      className="min-h-full"
      style={{
        background: c.background,
        color: c.foreground,
        fontFamily: theme.typography.body,
      }}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-6 h-14 border-b ${selectable('header')}`}
        style={{ borderColor: c.border }}
        onClick={() => onSelect('header')}
      >
        <span
          className="tracking-[0.3em] text-sm font-medium"
          style={{ fontFamily: theme.typography.display }}
        >
          RPIX
        </span>
        <div className="hidden sm:flex gap-4 text-[11px]" style={{ color: c.mutedForeground }}>
          <span>Work</span>
          <span>Learn</span>
          <span>Store</span>
          <span>About</span>
        </div>
        <span
          className="text-[10px] px-3 py-1.5 rounded-full"
          style={{ background: c.foreground, color: c.background }}
        >
          Contact
        </span>
      </div>

      {/* Hero */}
      <div
        className={`px-6 py-16 md:py-24 relative overflow-hidden ${selectable('hero')}`}
        onClick={() => onSelect('hero')}
      >
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 70% 40%, ${c.gold}22, transparent 55%)`,
          }}
        />
        <p
          className="text-[10px] uppercase tracking-[0.2em] mb-4"
          style={{ color: c.gold }}
        >
          {pageLabel}
        </p>
        <h1
          className="text-4xl md:text-6xl leading-[0.95] tracking-tight mb-6 max-w-lg"
          style={{ fontFamily: theme.typography.display, fontWeight: 500 }}
        >
          Crafted light.
          <br />
          <span style={{ color: c.gold }}>Timeless image.</span>
        </h1>
        <p className="text-sm max-w-sm mb-8" style={{ color: c.mutedForeground }}>
          Live visual preview — edits in the customizer apply instantly across the design system.
        </p>
        <div className="flex gap-3">
          <span
            className="text-[11px] px-4 py-2.5 rounded-full"
            style={{ background: c.foreground, color: c.background }}
          >
            Explore Work
          </span>
          <span
            className="text-[11px] px-4 py-2.5 rounded-full border"
            style={{ borderColor: c.border, color: c.foreground }}
          >
            The Studio
          </span>
        </div>
      </div>

      {/* Cards */}
      <div
        className={`px-6 pb-12 grid grid-cols-3 gap-3 ${selectable('cards')}`}
        onClick={() => onSelect('cards')}
      >
        {['Photography', 'Videography', 'Color'].map((label) => (
          <div
            key={label}
            className="aspect-[3/4] rounded-lg p-4 flex flex-col justify-end border"
            style={{
              background: c.card,
              borderColor: c.border,
              borderRadius: theme.radius.lg,
            }}
          >
            <div
              className="flex-1 mb-3 rounded"
              style={{
                background: `linear-gradient(145deg, ${c.secondary}, ${c.background})`,
              }}
            />
            <p className="text-[11px] font-medium">{label}</p>
            <p className="text-[9px]" style={{ color: c.mutedForeground }}>
              Discipline
            </p>
          </div>
        ))}
      </div>

      {/* Glass demo */}
      <div className="px-6 pb-12" onClick={() => onSelect('glass')}>
        <div
          className={`relative rounded-xl p-6 overflow-hidden ${selectable('glass')}`}
          style={{
            background: `rgba(255,255,255,${theme.glass.opacity})`,
            backdropFilter: `blur(${theme.glass.blur}px) saturate(${theme.glass.saturation})`,
            border: `1px solid rgba(245,242,235,${theme.glass.borderOpacity})`,
          }}
        >
          <div
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-40"
            style={{ background: c.gold }}
          />
          <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: c.gold }}>
            Glass surface
          </p>
          <p className="text-sm relative">Blur {theme.glass.blur}px · Opacity {theme.glass.opacity}</p>
        </div>
      </div>

      {/* Footer strip */}
      <div
        className={`px-6 py-8 border-t text-[10px] flex justify-between ${selectable('footer')}`}
        style={{ borderColor: c.border, color: c.mutedForeground }}
        onClick={() => onSelect('footer')}
      >
        <span className="tracking-[0.3em]" style={{ color: c.foreground }}>
          RPIX
        </span>
        <span>© Studio</span>
      </div>
    </div>
  );
}

/* ─── Customizer Inspector ─── */

function CustomizerInspector({
  section,
  theme,
  customizer,
}: {
  section: CustomizerSection;
  theme: ThemeConfig;
  customizer: ReturnType<typeof getCustomizer>;
}) {
  const colorKeys = Object.keys(theme.colors) as (keyof ThemeConfig['colors'])[];

  return (
    <div className="flex-1 overflow-y-auto">
      <p className="admin-section-title">{section}</p>

      {section === 'colors' && (
        <div className="pb-4">
          {colorKeys.map((key) => (
            <div key={key} className="admin-field">
              <label>{key}</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={normalizeHex(theme.colors[key])}
                  onChange={(e) => customizer.updateColor(key, e.target.value)}
                  className="!w-10 !h-8 shrink-0"
                />
                <input
                  type="text"
                  value={theme.colors[key]}
                  onChange={(e) => customizer.updateColor(key, e.target.value)}
                  className="flex-1 font-mono text-[11px]"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {section === 'typography' && (
        <div className="pb-4">
          <div className="admin-field">
            <label>Display font stack</label>
            <textarea
              rows={2}
              value={theme.typography.display}
              onChange={(e) =>
                customizer.updateNested('typography.display', e.target.value, 'Display font')
              }
            />
          </div>
          <div className="admin-field">
            <label>Body font stack</label>
            <textarea
              rows={2}
              value={theme.typography.body}
              onChange={(e) =>
                customizer.updateNested('typography.body', e.target.value, 'Body font')
              }
            />
          </div>
          <div className="admin-field">
            <label>Mono font stack</label>
            <textarea
              rows={2}
              value={theme.typography.mono}
              onChange={(e) =>
                customizer.updateNested('typography.mono', e.target.value, 'Mono font')
              }
            />
          </div>
          <p className="px-4 text-[10px] text-[var(--rpix-muted-fg)] mt-2">
            {theme.typography.scales.length} type scales defined (hero → label)
          </p>
        </div>
      )}

      {section === 'glass' && (
        <div className="pb-4">
          <SliderField
            label="Blur"
            value={theme.glass.blur}
            min={0}
            max={60}
            step={1}
            unit="px"
            onChange={(v) => customizer.updateNested('glass.blur', v, 'Glass blur')}
          />
          <SliderField
            label="Opacity"
            value={theme.glass.opacity}
            min={0}
            max={0.4}
            step={0.01}
            onChange={(v) => customizer.updateNested('glass.opacity', v, 'Glass opacity')}
          />
          <SliderField
            label="Border opacity"
            value={theme.glass.borderOpacity}
            min={0}
            max={0.4}
            step={0.01}
            onChange={(v) =>
              customizer.updateNested('glass.borderOpacity', v, 'Glass border')
            }
          />
          <SliderField
            label="Saturation"
            value={theme.glass.saturation}
            min={0.5}
            max={2}
            step={0.05}
            onChange={(v) =>
              customizer.updateNested('glass.saturation', v, 'Glass saturation')
            }
          />
        </div>
      )}

      {section === 'cursor' && (
        <div className="pb-4">
          <ToggleField
            label="Enabled"
            value={theme.cursor.enabled}
            onChange={(v) => customizer.updateNested('cursor.enabled', v, 'Cursor enabled')}
          />
          <SliderField
            label="Size"
            value={theme.cursor.size}
            min={8}
            max={48}
            step={1}
            unit="px"
            onChange={(v) => customizer.updateNested('cursor.size', v, 'Cursor size')}
          />
          <div className="admin-field">
            <label>Color</label>
            <input
              type="color"
              value={normalizeHex(theme.cursor.color)}
              onChange={(e) => customizer.updateNested('cursor.color', e.target.value, 'Cursor color')}
            />
          </div>
          <ToggleField
            label="Trail"
            value={theme.cursor.trail}
            onChange={(v) => customizer.updateNested('cursor.trail', v, 'Cursor trail')}
          />
          <ToggleField
            label="Magnetic"
            value={theme.cursor.magnetic}
            onChange={(v) => customizer.updateNested('cursor.magnetic', v, 'Cursor magnetic')}
          />
        </div>
      )}

      {section === 'particles' && (
        <div className="pb-4">
          <ToggleField
            label="Enabled"
            value={theme.particles.enabled}
            onChange={(v) => customizer.updateNested('particles.enabled', v)}
          />
          <SliderField
            label="Count"
            value={theme.particles.count}
            min={10}
            max={300}
            step={10}
            onChange={(v) => customizer.updateNested('particles.count', v)}
          />
          <SliderField
            label="Speed"
            value={theme.particles.speed}
            min={0.05}
            max={2}
            step={0.05}
            onChange={(v) => customizer.updateNested('particles.speed', v)}
          />
          <div className="admin-field">
            <label>Color</label>
            <input
              type="color"
              value={normalizeHex(theme.particles.color)}
              onChange={(e) => customizer.updateNested('particles.color', e.target.value)}
            />
          </div>
        </div>
      )}

      {section === 'lighting' && (
        <div className="pb-4">
          {(['ambient', 'key', 'fill', 'rim'] as const).map((k) => (
            <div key={k} className="admin-field">
              <label>{k}</label>
              <input
                type="color"
                value={normalizeHex(theme.lighting[k])}
                onChange={(e) => customizer.updateNested(`lighting.${k}`, e.target.value)}
              />
            </div>
          ))}
          <SliderField
            label="Intensity"
            value={theme.lighting.intensity}
            min={0}
            max={3}
            step={0.1}
            onChange={(v) => customizer.updateNested('lighting.intensity', v)}
          />
        </div>
      )}

      {section === 'effects' && (
        <div className="pb-4">
          {(['grain', 'vignette', 'scanlines', 'bloom', 'parallax'] as const).map((k) => (
            <ToggleField
              key={k}
              label={k}
              value={theme.effects[k]}
              onChange={(v) => customizer.updateNested(`effects.${k}`, v, `Effect ${k}`)}
            />
          ))}
        </div>
      )}

      {section === 'animation' && (
        <div className="pb-4">
          <SliderField
            label="Global speed"
            value={theme.animationSpeed}
            min={0.3}
            max={2}
            step={0.05}
            onChange={(v) => customizer.update('animationSpeed', v, 'Animation speed')}
          />
        </div>
      )}

      {section === 'transitions' && (
        <div className="pb-4">
          <div className="admin-field">
            <label>Type</label>
            <select
              value={theme.transitions.type}
              onChange={(e) =>
                customizer.updateNested('transitions.type', e.target.value, 'Transition type')
              }
            >
              {['fade', 'slide', 'morph', 'curtain', 'reveal', 'glitch', 'cinematic'].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <SliderField
            label="Duration"
            value={theme.transitions.duration}
            min={0.2}
            max={3}
            step={0.1}
            unit="s"
            onChange={(v) => customizer.updateNested('transitions.duration', v)}
          />
        </div>
      )}

      {section === 'navigation' && (
        <div className="pb-4">
          <div className="admin-field">
            <label>Style</label>
            <select
              value={theme.navigation.style}
              onChange={(e) => customizer.updateNested('navigation.style', e.target.value)}
            >
              {['minimal', 'expanded', 'sidebar', 'fullscreen'].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <ToggleField
            label="Blur"
            value={theme.navigation.blur}
            onChange={(v) => customizer.updateNested('navigation.blur', v)}
          />
        </div>
      )}

      {section === 'header' && (
        <div className="pb-4">
          <SliderField
            label="Height"
            value={theme.header.height}
            min={48}
            max={120}
            step={4}
            unit="px"
            onChange={(v) => customizer.updateNested('header.height', v)}
          />
          <ToggleField
            label="Transparent"
            value={theme.header.transparent}
            onChange={(v) => customizer.updateNested('header.transparent', v)}
          />
          <ToggleField
            label="Show CTA"
            value={theme.header.showCta}
            onChange={(v) => customizer.updateNested('header.showCta', v)}
          />
        </div>
      )}

      {section === 'footer' && (
        <div className="pb-4">
          <div className="admin-field">
            <label>Style</label>
            <select
              value={theme.footer.style}
              onChange={(e) => customizer.updateNested('footer.style', e.target.value)}
            >
              {['minimal', 'expanded', 'mega'].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <ToggleField
            label="Newsletter"
            value={theme.footer.showNewsletter}
            onChange={(v) => customizer.updateNested('footer.showNewsletter', v)}
          />
          <ToggleField
            label="Social"
            value={theme.footer.showSocial}
            onChange={(v) => customizer.updateNested('footer.showSocial', v)}
          />
        </div>
      )}

      {(section === 'blog' || section === 'portfolio' || section === 'store') && (
        <div className="pb-4">
          <div className="admin-field">
            <label>{section} layout</label>
            <select
              value={theme.layouts[section]}
              onChange={(e) =>
                customizer.updateNested(`layouts.${section}`, e.target.value, `${section} layout`)
              }
            >
              {(section === 'blog'
                ? ['magazine', 'list', 'grid', 'editorial']
                : section === 'portfolio'
                  ? ['masonry', 'grid', 'cinematic', 'horizontal', 'stack']
                  : ['grid', 'list', 'featured']
              ).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {['buttons', 'cards', 'gallery', 'backgrounds', 'three', 'spacing'].includes(section) && (
        <div className="px-4 pb-6 text-[11px] text-[var(--rpix-muted-fg)] leading-relaxed">
          <p className="mb-3">
            <strong className="text-white capitalize">{section}</strong> controls are wired to the
            design token system. Adjust colors, glass, and effects to influence this surface.
          </p>
          {section === 'spacing' && (
            <div className="space-y-2 font-mono text-[10px]">
              {Object.entries(theme.spacing)
                .slice(0, 12)
                .map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span>{k}</span>
                    <span>{v}</span>
                  </div>
                ))}
            </div>
          )}
          {section === 'three' && (
            <ul className="space-y-1 list-disc pl-4">
              <li>Hero particle field</li>
              <li>Torus knot metal material</li>
              <li>Key / fill / rim lights</li>
              <li>Mouse parallax camera</li>
            </ul>
          )}
          <button
            type="button"
            className="mt-4 w-full py-2 rounded-lg border border-white/10 text-[11px] hover:border-[var(--rpix-gold)]/40"
            onClick={() => customizer.update('version', theme.version + 1, `Touch ${section}`)}
          >
            Apply {section} preset
          </button>
        </div>
      )}
    </div>
  );
}

function ComponentInspector({
  selected,
  theme,
  onSelect,
}: {
  selected: string | null;
  theme: ThemeConfig;
  onSelect: (id: string) => void;
}) {
  const components = ['header', 'hero', 'cards', 'glass', 'footer'];
  return (
    <div className="flex-1 overflow-y-auto">
      <p className="admin-section-title">Inspector</p>
      <div className="px-3 pb-3 flex flex-wrap gap-1">
        {components.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onSelect(c)}
            className={`px-2 py-1 rounded text-[10px] capitalize ${
              selected === c
                ? 'bg-[rgba(201,168,76,0.15)] text-[var(--rpix-gold)]'
                : 'text-[var(--rpix-muted-fg)] border border-white/10'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="admin-field">
        <label>Selected</label>
        <input type="text" readOnly value={selected ?? '—'} />
      </div>
      <div className="admin-field">
        <label>Theme</label>
        <input type="text" readOnly value={theme.name} />
      </div>
      <div className="admin-field">
        <label>Version</label>
        <input type="text" readOnly value={String(theme.version)} />
      </div>
      <div className="px-4 py-2 text-[11px] text-[var(--rpix-muted-fg)] leading-relaxed">
        Click any region in the live preview to inspect. Use the Customizer rail for full token
        control. Changes support undo/redo and version publish.
      </div>
      <div className="admin-field">
        <label>Accent preview</label>
        <div
          className="h-10 rounded-md border border-white/10"
          style={{ background: theme.colors.accent }}
        />
      </div>
    </div>
  );
}

/* ─── Field primitives ─── */

function SliderField({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="admin-field">
      <label className="flex justify-between">
        <span>{label}</span>
        <span className="text-white/50 tabular-nums">
          {typeof value === 'number' ? Number(value.toFixed(2)) : value}
          {unit}
        </span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function ToggleField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="admin-field flex items-center justify-between">
      <label className="!mb-0 capitalize">{label}</label>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`w-9 h-5 rounded-full relative transition-colors ${
          value ? 'bg-[var(--rpix-gold)]' : 'bg-white/15'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
            value ? 'translate-x-4' : ''
          }`}
        />
      </button>
    </div>
  );
}

function normalizeHex(color: string): string {
  if (color.startsWith('#') && (color.length === 7 || color.length === 4)) return color.slice(0, 7);
  // rgba or named — fallback gold/ink for color input
  if (color.includes('245') || color.includes('F5')) return '#F5F2EB';
  if (color.includes('201') || color.includes('C9')) return '#C9A84C';
  if (color.includes('5, 5, 5') || color === '#050505') return '#050505';
  return '#888888';
}
