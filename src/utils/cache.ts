const CACHE_PREFIX = '@sqlsync_cache_';

let AsyncStorage: any = null;

// Lazy load AsyncStorage — graceful degradation if not installed
async function getStorage() {
  if (AsyncStorage) return AsyncStorage;
  try {
    const mod = await import('@react-native-async-storage/async-storage');
    AsyncStorage = mod.default;
    return AsyncStorage;
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, data: any, ttl: number): Promise<void> {
  const storage = await getStorage();
  if (!storage) return;

  try {
    const entry = {
      data,
      expiresAt: Date.now() + ttl,
    };
    await storage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch { }
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const storage = await getStorage();
  if (!storage) return null;

  try {
    const raw = await storage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    const entry = JSON.parse(raw);
    if (Date.now() > entry.expiresAt) {
      await storage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return entry.data as T;
  } catch {
    return null;
  }
}

export async function cacheClear(prefix?: string): Promise<void> {
  const storage = await getStorage();
  if (!storage) return;

  try {
    const keys: string[] = await storage.getAllKeys();
    const target = keys.filter((k: string) =>
      k.startsWith(CACHE_PREFIX + (prefix ?? ''))
    );
    if (target.length > 0) {
      await storage.multiRemove(target);
    }
  } catch { }
}
