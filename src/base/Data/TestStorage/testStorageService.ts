import { env } from '@/base/Core/Config';

export interface StoredEntry {
  item: Record<string, unknown>;
  context: Record<string, unknown>;
}

/**
 * Test-mode localStorage store.
 *
 * Each repository gets its own namespace (constructor name). Items are stored
 * with a "context" — the flat params map used during create/update. Index calls
 * filter stored items by checking that every index param key/value exists in the
 * stored context, so e.g. `index({classification_id:1, parent_id:5})` only returns
 * items created under that same classification+parent.
 *
 * Only active when VITE_APP_ENV=test (env.useStaticData === true).
 */
class TestStorageService {
  private static _instance: TestStorageService;
  private readonly prefix = 'orbit_test:';

  static get instance(): TestStorageService {
    if (!this._instance) this._instance = new TestStorageService();
    return this._instance;
  }

  private storageKey(repoName: string): string {
    return `${this.prefix}${repoName}`;
  }

  getAllEntries(repoName: string): StoredEntry[] {
    try {
      const raw = localStorage.getItem(this.storageKey(repoName));
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveEntries(repoName: string, entries: StoredEntry[]): void {
    localStorage.setItem(this.storageKey(repoName), JSON.stringify(entries));
  }

  /**
   * Return stored items whose context contains every key/value in `filter`.
   * An empty filter returns all items.
   */
  getMatchingItems(repoName: string, filter: Record<string, unknown>): Record<string, unknown>[] {
    const entries = this.getAllEntries(repoName);
    const filterEntries = Object.entries(filter).filter(([, v]) => v !== undefined);

    if (filterEntries.length === 0) return entries.map((e) => e.item);

    return entries
      .filter((e) =>
        filterEntries.every(([k, v]) => {
          const cv = e.context[k];
          if (v === null || v === undefined) return cv === null || cv === undefined;
          return cv === v;
        }),
      )
      .map((e) => e.item);
  }

  addItem(
    repoName: string,
    item: Record<string, unknown>,
    context: Record<string, unknown>,
  ): void {
    const entries = this.getAllEntries(repoName);
    entries.push({ item, context });
    this.saveEntries(repoName, entries);
    if (env.isLoggingEnabled) {
      console.log(`[TestStorage] add ${repoName}`, item);
    }
  }

  updateItem(
    repoName: string,
    idField: string,
    idValue: unknown,
    updatedItem: Record<string, unknown>,
    context: Record<string, unknown>,
  ): void {
    const entries = this.getAllEntries(repoName);
    const idx = entries.findIndex((e) => e.item[idField] === idValue);
    if (idx >= 0) {
      entries[idx] = { item: { ...entries[idx].item, ...updatedItem }, context };
    } else {
      entries.push({ item: updatedItem, context });
    }
    this.saveEntries(repoName, entries);
  }

  removeItem(repoName: string, idField: string, idValue: unknown): void {
    const entries = this.getAllEntries(repoName);
    this.saveEntries(
      repoName,
      entries.filter((e) => e.item[idField] !== idValue),
    );
  }

  clear(repoName: string): void {
    localStorage.removeItem(this.storageKey(repoName));
  }

  clearAll(): void {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(this.prefix))
      .forEach((k) => localStorage.removeItem(k));
  }
}

export const testStorage = TestStorageService.instance;
