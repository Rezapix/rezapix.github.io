/**
 * RPIX Customizer — Theme State & Persistence
 * The most advanced website customizer: every visual property is live-editable.
 */

import { RPIX_THEME } from '@/lib/design-system/tokens';
import type { ThemeConfig, CustomizerSection, HistoryEntry } from '@/types';
import { nanoid } from 'nanoid';

const STORAGE_KEY = 'rpix-theme-v1';
const HISTORY_LIMIT = 50;

type Listener = (theme: ThemeConfig) => void;

class CustomizerStore {
  private theme: ThemeConfig;
  private listeners = new Set<Listener>();
  private history: HistoryEntry[] = [];
  private historyIndex = -1;
  private draft = true;

  constructor() {
    this.theme = this.load() ?? structuredClone(RPIX_THEME);
    this.pushHistory('init', 'Initial theme');
  }

  getTheme(): ThemeConfig {
    return this.theme;
  }

  isDraft(): boolean {
    return this.draft;
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit() {
    this.listeners.forEach((fn) => fn(this.theme));
    this.applyToDOM();
  }

  private pushHistory(action: string, label: string) {
    // Truncate forward history on new action
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push({
      id: nanoid(8),
      timestamp: Date.now(),
      action,
      label,
      snapshot: structuredClone(this.theme),
    });
    if (this.history.length > HISTORY_LIMIT) {
      this.history.shift();
    }
    this.historyIndex = this.history.length - 1;
  }

  canUndo(): boolean {
    return this.historyIndex > 0;
  }

  canRedo(): boolean {
    return this.historyIndex < this.history.length - 1;
  }

  undo() {
    if (!this.canUndo()) return;
    this.historyIndex -= 1;
    this.theme = structuredClone(this.history[this.historyIndex].snapshot) as ThemeConfig;
    this.draft = true;
    this.emit();
  }

  redo() {
    if (!this.canRedo()) return;
    this.historyIndex += 1;
    this.theme = structuredClone(this.history[this.historyIndex].snapshot) as ThemeConfig;
    this.draft = true;
    this.emit();
  }

  getHistory(): HistoryEntry[] {
    return this.history;
  }

  getHistoryIndex(): number {
    return this.historyIndex;
  }

  update<K extends keyof ThemeConfig>(
    key: K,
    value: ThemeConfig[K],
    label?: string,
  ) {
    this.theme = { ...this.theme, [key]: value, version: this.theme.version + 1 };
    this.draft = true;
    this.pushHistory(`update:${String(key)}`, label ?? `Update ${String(key)}`);
    this.emit();
  }

  updateNested(path: string, value: unknown, label?: string) {
    const keys = path.split('.');
    const next = structuredClone(this.theme) as Record<string, unknown>;
    let cursor: Record<string, unknown> = next;
    for (let i = 0; i < keys.length - 1; i++) {
      cursor = cursor[keys[i]] as Record<string, unknown>;
    }
    cursor[keys[keys.length - 1]] = value;
    this.theme = next as unknown as ThemeConfig;
    this.theme.version += 1;
    this.draft = true;
    this.pushHistory(`nested:${path}`, label ?? `Update ${path}`);
    this.emit();
  }

  updateColor(colorKey: keyof ThemeConfig['colors'], value: string) {
    this.updateNested(`colors.${colorKey}`, value, `Color · ${colorKey}`);
  }

  reset() {
    this.theme = structuredClone(RPIX_THEME);
    this.draft = true;
    this.pushHistory('reset', 'Reset to defaults');
    this.emit();
  }

  /** Persist as published */
  publish() {
    this.draft = false;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.theme));
      localStorage.setItem(`${STORAGE_KEY}-published`, JSON.stringify(this.theme));
    } catch {
      /* ignore */
    }
    this.pushHistory('publish', 'Published theme');
    this.emit();
  }

  /** Save draft without publishing */
  saveDraft() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.theme));
    } catch {
      /* ignore */
    }
    this.pushHistory('draft', 'Saved draft');
  }

  private load(): ThemeConfig | null {
    if (typeof localStorage === 'undefined') return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as ThemeConfig;
    } catch {
      return null;
    }
  }

  /** Apply CSS variables to document root */
  applyToDOM() {
    if (typeof document === 'undefined') return;
    const t = this.theme;
    const r = document.documentElement;

    r.style.setProperty('--rpix-bg', t.colors.background);
    r.style.setProperty('--rpix-fg', t.colors.foreground);
    r.style.setProperty('--rpix-muted', t.colors.muted);
    r.style.setProperty('--rpix-muted-fg', t.colors.mutedForeground);
    r.style.setProperty('--rpix-accent', t.colors.accent);
    r.style.setProperty('--rpix-accent-fg', t.colors.accentForeground);
    r.style.setProperty('--rpix-secondary', t.colors.secondary);
    r.style.setProperty('--rpix-secondary-fg', t.colors.secondaryForeground);
    r.style.setProperty('--rpix-border', t.colors.border);
    r.style.setProperty('--rpix-ring', t.colors.ring);
    r.style.setProperty('--rpix-card', t.colors.card);
    r.style.setProperty('--rpix-gold', t.colors.gold);
    r.style.setProperty('--rpix-platinum', t.colors.platinum);

    r.style.setProperty('--rpix-glass-blur', `${t.glass.blur}px`);
    r.style.setProperty('--rpix-glass-opacity', String(t.glass.opacity));
    r.style.setProperty('--rpix-glass-border', String(t.glass.borderOpacity));
    r.style.setProperty('--rpix-glass-sat', String(t.glass.saturation));

    r.style.setProperty('--rpix-anim-speed', String(t.animationSpeed));
    r.style.setProperty('--rpix-cursor-size', `${t.cursor.size}px`);
    r.style.setProperty('--rpix-cursor-color', t.cursor.color);
    r.style.setProperty('--rpix-grain-opacity', t.effects.grain ? '0.035' : '0');
    r.style.setProperty('--rpix-vignette-opacity', t.effects.vignette ? '0.45' : '0');

    r.classList.toggle('grain', t.effects.grain);
    r.classList.toggle('vignette', t.effects.vignette);
  }

  exportJSON(): string {
    return JSON.stringify(this.theme, null, 2);
  }

  importJSON(json: string) {
    try {
      const parsed = JSON.parse(json) as ThemeConfig;
      this.theme = parsed;
      this.draft = true;
      this.pushHistory('import', 'Imported theme');
      this.emit();
      return true;
    } catch {
      return false;
    }
  }
}

// Singleton
let store: CustomizerStore | null = null;

export function getCustomizer(): CustomizerStore {
  if (!store) {
    store = new CustomizerStore();
    if (typeof window !== 'undefined') {
      store.applyToDOM();
    }
  }
  return store;
}

export const CUSTOMIZER_SECTIONS: {
  id: CustomizerSection;
  label: string;
  icon: string;
}[] = [
  { id: 'colors', label: 'Colors', icon: '◉' },
  { id: 'typography', label: 'Typography', icon: 'Aa' },
  { id: 'spacing', label: 'Spacing', icon: ' intern' },
  { id: 'glass', label: 'Glass', icon: '◇' },
  { id: 'cursor', label: 'Cursor', icon: '✦' },
  { id: 'buttons', label: 'Buttons', icon: '▣' },
  { id: 'cards', label: 'Cards', icon: '▢' },
  { id: 'gallery', label: 'Gallery', icon: '▦' },
  { id: 'backgrounds', label: 'Backgrounds', icon: '◈' },
  { id: 'lighting', label: 'Lighting', icon: '☀' },
  { id: 'particles', label: 'Particles', icon: '·' },
  { id: 'three', label: 'Three.js', icon: '◻' },
  { id: 'transitions', label: 'Transitions', icon: '⇄' },
  { id: 'animation', label: 'Animation', icon: '↻' },
  { id: 'effects', label: 'Effects', icon: '✧' },
  { id: 'navigation', label: 'Navigation', icon: '☰' },
  { id: 'header', label: 'Header', icon: '▔' },
  { id: 'footer', label: 'Footer', icon: '▁' },
  { id: 'blog', label: 'Blog Layout', icon: '¶' },
  { id: 'portfolio', label: 'Portfolio', icon: '▣' },
  { id: 'store', label: 'Store', icon: '◇' },
];
