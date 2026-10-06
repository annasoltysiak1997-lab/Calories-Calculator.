import { describe, expect, it } from 'vitest';
import { LEGACY_STORAGE_KEY, STORAGE_KEY, migrateStorageKey } from '../store';

function memoryStorage(entries: Record<string, string> = {}) {
  const data = new Map(Object.entries(entries));
  return {
    data,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => { data.set(k, v); },
    removeItem: (k: string) => { data.delete(k); },
  };
}

describe('migrateStorageKey', () => {
  it('moves saved state from the old key to the Bitewise key unchanged', () => {
    const saved = JSON.stringify({ customFoods: { 'user-1': { id: 'user-1' } }, recent: [] });
    const s = memoryStorage({ [LEGACY_STORAGE_KEY]: saved });
    migrateStorageKey(s);
    expect(s.data.get(STORAGE_KEY)).toBe(saved);
    expect(s.data.has(LEGACY_STORAGE_KEY)).toBe(false);
  });

  it('keeps the Bitewise key when both exist', () => {
    const s = memoryStorage({ [LEGACY_STORAGE_KEY]: 'old', [STORAGE_KEY]: 'new' });
    migrateStorageKey(s);
    expect(s.data.get(STORAGE_KEY)).toBe('new');
    expect(s.data.has(LEGACY_STORAGE_KEY)).toBe(false);
  });

  it('does nothing when there is no old key', () => {
    const s = memoryStorage({ [STORAGE_KEY]: 'new' });
    migrateStorageKey(s);
    expect([...s.data]).toEqual([[STORAGE_KEY, 'new']]);
  });

  it('keeps the old key if the copy cannot be written', () => {
    const s = memoryStorage({ [LEGACY_STORAGE_KEY]: 'old' });
    s.setItem = () => { throw new Error('QuotaExceededError'); };
    expect(() => migrateStorageKey(s)).toThrow();
    expect(s.data.get(LEGACY_STORAGE_KEY)).toBe('old');
  });
});
