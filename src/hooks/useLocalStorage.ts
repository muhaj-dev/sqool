/* eslint-disable @typescript-eslint/prefer-for-of */
interface LocalStorageProps<T> {
  key: string;
  data?: T | null;
}
export default function useLocalStorage() {
  function saveToLocalStorage({ data, key }: { key: string; data: object }) {
    window.localStorage.setItem(key, JSON.stringify(data));
  }

  function getLocalItemFromStorage(key: string) {
    const item = window.localStorage.getItem(key);
    return item;
  }

  function getAllFromLocalStorage(keys: string[]) {
    const allItems = [];
    for (let i = 0; i < keys.length; i++) {
      allItems.push(window.localStorage.getItem(keys[i]));
    }
  }

  function getKeysFromLocalStorage() {
    const keys = [];
    const length = localStorage.length;
    for (let i = 0; i < length; i++) {
      const key = localStorage.key(i);
      keys.push(key);
    }
    return keys;
  }

  function clearItemFromStorage(keys: string[]) {
    for (let i = 0; i < keys.length; i++) {
      localStorage.removeItem(keys[i]);
    }
  }
  return {
    saveToLocalStorage,
    getLocalItemFromStorage,
    getAllFromLocalStorage,
    clearItemFromStorage,
  };
}
