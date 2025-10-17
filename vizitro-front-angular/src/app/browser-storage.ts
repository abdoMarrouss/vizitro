export function getStorage(): Storage {
  if (typeof localStorage !== 'undefined') {
    return localStorage;
  }
  
  // Mock localStorage for SSR
  return {
    length: 0,
    clear: () => {},
    getItem: () => null,
    key: () => null,
    removeItem: () => {},
    setItem: () => {},
  } as Storage;
}