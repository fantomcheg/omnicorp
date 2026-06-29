export interface StorageDriver {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function createWebStorage(namespace: string): StorageDriver {
  const prefix = `${namespace}:`;

  return {
    getItem(key: string) {
      try {
        return window.localStorage.getItem(prefix + key);
      } catch {
        return null;
      }
    },
    setItem(key: string, value: string) {
      try {
        window.localStorage.setItem(prefix + key, value);
      } catch {
        return;
      }
    },
  };
}

