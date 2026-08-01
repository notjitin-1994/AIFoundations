import type { StateStorage } from 'zustand/middleware';

const ACTIVE_USER_SUFFIX = ':active-user';
const GUEST_LABEL = 'guest';

class MemoryStorage implements Storage {
  private readonly store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

const memoryStorage: Storage = new MemoryStorage();

function defaultStorage(): Storage {
  if (typeof localStorage !== 'undefined') {
    return localStorage;
  }
  return memoryStorage;
}

function perUserKey(baseName: string, userId: string | null): string {
  return `${baseName}:${userId ?? GUEST_LABEL}`;
}

function activeUserKey(baseName: string): string {
  return `${baseName}${ACTIVE_USER_SUFFIX}`;
}

function readActiveUserId(storage: Storage, baseName: string): string | null {
  const raw = storage.getItem(activeUserKey(baseName));
  if (raw == null) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as { userId?: unknown };
    return typeof parsed.userId === 'string' ? parsed.userId : null;
  } catch (err) {
    console.error(`[user-storage] invalid active-user marker for "${baseName}":`, err);
    return null;
  }
}

export function markActiveUser(baseName: string, userId: string | null, storage: Storage = defaultStorage()): void {
  try {
    storage.setItem(activeUserKey(baseName), JSON.stringify({ userId }));
  } catch (err) {
    console.error(`[user-storage] failed to persist active-user marker for "${baseName}":`, err);
  }
}

export function clearMemoryStorage(): void {
  memoryStorage.clear();
}

export function readStoredState(baseName: string, userId: string | null, storage: Storage = defaultStorage()): string | null {
  return storage.getItem(perUserKey(baseName, userId));
}

function migrateLegacyPayload(storage: Storage, baseName: string): string | null {
  const raw = storage.getItem(baseName);
  if (raw == null) {
    return null;
  }
  let userId: string | null = null;
  try {
    const parsed = JSON.parse(raw) as { state?: { userId?: unknown } };
    userId = typeof parsed.state?.userId === 'string' ? parsed.state.userId : null;
  } catch (err) {
    console.error(`[user-storage] legacy payload for "${baseName}" is not valid JSON; serving as-is:`, err);
    return raw;
  }
  try {
    storage.setItem(perUserKey(baseName, userId), raw);
    storage.setItem(activeUserKey(baseName), JSON.stringify({ userId }));
    storage.removeItem(baseName);
  } catch (err) {
    console.error(`[user-storage] failed to migrate legacy payload for "${baseName}":`, err);
  }
  return raw;
}

export function createUserScopedStorage(storage: Storage = defaultStorage()): StateStorage {
  return {
    getItem: (name) => {
      const userId = readActiveUserId(storage, name);
      if (userId != null) {
        return storage.getItem(perUserKey(name, userId));
      }
      const legacy = storage.getItem(name);
      if (legacy != null) {
        return migrateLegacyPayload(storage, name);
      }
      return storage.getItem(perUserKey(name, null));
    },
    setItem: (name, value) => {
      let userId: string | null = null;
      try {
        const parsed = JSON.parse(value) as { state?: { userId?: unknown } };
        userId = typeof parsed.state?.userId === 'string' ? parsed.state.userId : null;
      } catch (err) {
        console.error(`[user-storage] persist payload for "${name}" is not valid JSON; writing under guest key:`, err);
      }
      try {
        storage.setItem(perUserKey(name, userId), value);
        storage.setItem(activeUserKey(name), JSON.stringify({ userId }));
      } catch (err) {
        console.error(`[user-storage] failed to persist state for "${name}":`, err);
      }
    },
    removeItem: (name) => {
      const userId = readActiveUserId(storage, name);
      if (userId == null) {
        return;
      }
      try {
        storage.removeItem(perUserKey(name, userId));
      } catch (err) {
        console.error(`[user-storage] failed to remove state for "${name}":`, err);
      }
    },
  };
}
