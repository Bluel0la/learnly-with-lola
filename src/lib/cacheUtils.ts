
/**
 * Utility functions for localStorage-based caching.
 */

type CacheKey = string;

/**
 * Sets a value in localStorage with a key and optional TTL (in ms)
 */
export function setCache<T>(key: CacheKey, value: T, ttlMs?: number) {
  const expiresAt = ttlMs ? Date.now() + ttlMs : null;
  const payload = JSON.stringify({ value, expiresAt });
  localStorage.setItem(key, payload);
}

/**
 * Gets a value from localStorage, returns null if expired or not present.
 */
export function getCache<T>(key: CacheKey): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    const { value, expiresAt } = JSON.parse(raw);
    if (expiresAt && Date.now() > expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    return value as T;
  } catch {
    return null;
  }
}

/**
 * Removes cache key.
 */
export function removeCache(key: CacheKey) {
  localStorage.removeItem(key);
}
