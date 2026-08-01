import { describe, it, expect } from 'vitest';
import { createUserScopedStorage, markActiveUser } from '@/store/user-storage';

const BASE = 'aifoundations-progress';

function createFakeStorage(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear: () => {
      store.clear();
    },
    getItem: (key: string) => store.get(key) ?? null,
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    removeItem: (key: string) => {
      store.delete(key);
    },
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
  };
}

function payload(userId: string | null, extra: Record<string, unknown> = {}): string {
  return JSON.stringify({ state: { userId, ...extra }, version: 0 });
}

describe('createUserScopedStorage', () => {
  it('reads and writes to the active user key', () => {
    const storage = createFakeStorage();
    const adapter = createUserScopedStorage(storage);

    adapter.setItem(BASE, payload('user-a', { completedModules: ['1'] }));
    expect(storage.getItem(`${BASE}:user-a`)).toBe(payload('user-a', { completedModules: ['1'] }));
    expect(storage.getItem(`${BASE}:active-user`)).toBe(JSON.stringify({ userId: 'user-a' }));

    adapter.setItem(BASE, payload('user-b', { completedModules: ['2'] }));
    expect(adapter.getItem(BASE)).toBe(payload('user-b', { completedModules: ['2'] }));
  });

  it('keeps each user state fully isolated when switching users', () => {
    const storage = createFakeStorage();
    const adapter = createUserScopedStorage(storage);

    adapter.setItem(BASE, payload('user-a', { completedModules: ['1'] }));
    adapter.setItem(BASE, payload('user-b', { completedModules: ['2'] }));

    markActiveUser(BASE, 'user-a', storage);
    expect(adapter.getItem(BASE)).toBe(payload('user-a', { completedModules: ['1'] }));

    markActiveUser(BASE, 'user-b', storage);
    expect(adapter.getItem(BASE)).toBe(payload('user-b', { completedModules: ['2'] }));
  });

  it('migrates the legacy single-key payload on first read', () => {
    const storage = createFakeStorage();
    const legacy = payload('user-a', { completedModules: ['1'] });
    storage.setItem(BASE, legacy);
    const adapter = createUserScopedStorage(storage);

    const result = adapter.getItem(BASE);

    expect(result).toBe(legacy);
    expect(storage.getItem(BASE)).toBeNull();
    expect(storage.getItem(`${BASE}:user-a`)).toBe(legacy);
    expect(storage.getItem(`${BASE}:active-user`)).toBe(JSON.stringify({ userId: 'user-a' }));
  });

  it('falls back to the guest key when no active user is set', () => {
    const storage = createFakeStorage();
    const adapter = createUserScopedStorage(storage);

    expect(adapter.getItem(BASE)).toBeNull();
    adapter.setItem(BASE, payload(null, { completedModules: ['3'] }));
    expect(adapter.getItem(BASE)).toBe(payload(null, { completedModules: ['3'] }));
    expect(storage.getItem(`${BASE}:guest`)).toBe(payload(null, { completedModules: ['3'] }));
  });

  it('removeItem removes only the active user key', () => {
    const storage = createFakeStorage();
    const adapter = createUserScopedStorage(storage);

    adapter.setItem(BASE, payload('user-a', { completedModules: ['1'] }));
    adapter.setItem(BASE, payload('user-b', { completedModules: ['2'] }));
    adapter.removeItem(BASE);

    expect(storage.getItem(`${BASE}:user-b`)).toBeNull();
    expect(storage.getItem(`${BASE}:user-a`)).toBe(payload('user-a', { completedModules: ['1'] }));
  });
});
