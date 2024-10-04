let cache = {};

export function cacheData(key, data, ttl) {
  cache[key] = {
    data,
    expiry: Date.now() + ttl * 1000
  };
}

export function getCachedData(key) {
  const item = cache[key];
  if (!item) return null;
  if (Date.now() > item.expiry) {
    delete cache[key];
    return null;
  }
  return item.data;
}
