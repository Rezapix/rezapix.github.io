/**
 * RPIX Editor — Undo / Redo / Version Control
 */

import { nanoid } from 'nanoid';
import type { HistoryEntry, Version, Draft } from '@/types';

const HISTORY_LIMIT = 100;

export class EditorHistory {
  private stack: HistoryEntry[] = [];
  private index = -1;
  private versions: Version[] = [];
  private drafts = new Map<string, Draft>();

  push(action: string, label: string, snapshot: unknown) {
    this.stack = this.stack.slice(0, this.index + 1);
    this.stack.push({
      id: nanoid(10),
      timestamp: Date.now(),
      action,
      label,
      snapshot: structuredClone(snapshot),
    });
    if (this.stack.length > HISTORY_LIMIT) this.stack.shift();
    this.index = this.stack.length - 1;
  }

  canUndo() {
    return this.index > 0;
  }

  canRedo() {
    return this.index < this.stack.length - 1;
  }

  undo(): HistoryEntry | null {
    if (!this.canUndo()) return null;
    this.index -= 1;
    return this.stack[this.index];
  }

  redo(): HistoryEntry | null {
    if (!this.canRedo()) return null;
    this.index += 1;
    return this.stack[this.index];
  }

  current(): HistoryEntry | null {
    return this.stack[this.index] ?? null;
  }

  list(): HistoryEntry[] {
    return this.stack;
  }

  getIndex() {
    return this.index;
  }

  /** Create a named version snapshot */
  createVersion(label: string, snapshot: unknown, authorId: string): Version {
    const version: Version = {
      id: nanoid(12),
      number: this.versions.length + 1,
      label,
      createdAt: new Date().toISOString(),
      authorId,
      snapshot: structuredClone(snapshot),
      published: false,
    };
    this.versions.push(version);
    return version;
  }

  publishVersion(versionId: string): Version | null {
    const v = this.versions.find((x) => x.id === versionId);
    if (!v) return null;
    this.versions.forEach((x) => {
      x.published = x.id === versionId;
    });
    return v;
  }

  getVersions(): Version[] {
    return this.versions;
  }

  restoreVersion(versionId: string): unknown | null {
    const v = this.versions.find((x) => x.id === versionId);
    if (!v) return null;
    this.push('restore', `Restore v${v.number}: ${v.label}`, v.snapshot);
    return structuredClone(v.snapshot);
  }

  /** Draft management */
  saveDraft(contentId: string, contentType: string, data: unknown, autoSaved = false): Draft {
    const draft: Draft = {
      id: nanoid(10),
      contentId,
      contentType,
      data: structuredClone(data),
      updatedAt: new Date().toISOString(),
      autoSaved,
    };
    this.drafts.set(contentId, draft);

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(`rpix-draft-${contentId}`, JSON.stringify(draft));
      } catch {
        /* ignore */
      }
    }
    return draft;
  }

  getDraft(contentId: string): Draft | null {
    if (this.drafts.has(contentId)) return this.drafts.get(contentId)!;
    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(`rpix-draft-${contentId}`);
        if (raw) {
          const d = JSON.parse(raw) as Draft;
          this.drafts.set(contentId, d);
          return d;
        }
      } catch {
        /* ignore */
      }
    }
    return null;
  }

  clearDraft(contentId: string) {
    this.drafts.delete(contentId);
    try {
      localStorage.removeItem(`rpix-draft-${contentId}`);
    } catch {
      /* ignore */
    }
  }
}

let editorHistory: EditorHistory | null = null;

export function getEditorHistory(): EditorHistory {
  if (!editorHistory) editorHistory = new EditorHistory();
  return editorHistory;
}
