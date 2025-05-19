// @ts-nocheck
// Simple implementation of clone-deep to avoid the webpack issues

/**
 * Deep clone an object or array
 */
export function cloneDeep(value: any): any {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(item => cloneDeep(item));
  }

  if (value instanceof Date) {
    return new Date(value);
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }

  if (value instanceof Map) {
    const map = new Map();
    value.forEach((val, key) => {
      map.set(key, cloneDeep(val));
    });
    return map;
  }

  if (value instanceof Set) {
    const set = new Set();
    value.forEach(val => {
      set.add(cloneDeep(val));
    });
    return set;
  }

  // Handle plain objects
  const result = {};
  Object.keys(value).forEach(key => {
    result[key] = cloneDeep(value[key]);
  });
  return result;
}

export default cloneDeep;
