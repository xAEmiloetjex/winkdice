import { fMap } from '../index.js';
import { type Database } from './types.js'
export class InMemoryDatabase implements Database {
  public data = fMap.trueMap<string, any>();
  private parseKey(key: string): string[] {
    return key.split(".");
  }
  has(key: string) {
    const parts = this.parseKey(key);
    let current = this.data;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current.has(part)) {
        return undefined;
      }

      current = current.get(part);
    }
    return current.has(parts[parts.length - 1]);
  }
  get(key: string): any {
    const parts = this.parseKey(key);
    let current = this.data;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current.has(part)) {
        return undefined;
      }

      current = current.get(part);
    }
    return current.get(parts[parts.length - 1]);
  }
  set(key: string, value: any): void {
    const parts = this.parseKey(key);
    let current = this.data;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      console.log(part, current)
      if (!current.has(part)) {
        current.set(part, new Map());
      }
      current = current.get(part);
    }
    current.set(parts[parts.length - 1], value);
  }
  delete(key: string): void {
    const parts = this.parseKey(key);
    let current = this.data;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current.has(part)) {
        return;
      }
      current = current.get(part);
    }
    current.delete(parts[parts.length - 1]);
  }
}
