// storage.ts

enum StorageType {
  l = 'localStorage',
  s = 'sessionStorage',
}

class MyStorage {
  storage: Storage;

  constructor(type: StorageType) {
    this.storage =
      type === StorageType.l ? window.localStorage : window.sessionStorage;
  }

  set(key: string, value: unknown) {
    const data = JSON.stringify(value);
    this.storage.setItem(key, data);
  }

  get(key: string) {
    const value = this.storage.getItem(key);
    if (value) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(value);
    }
  }

  delete(key: string) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }
}

const LStorage = new MyStorage(StorageType.l);
const SStorage = new MyStorage(StorageType.s);

export { LStorage, SStorage };
