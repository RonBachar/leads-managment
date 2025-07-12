import { Injectable, signal, computed, Signal } from '@angular/core';
import { UtilsService } from './utils.service';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BaseService<T extends BaseEntity> {
  readonly items: Signal<T[]>;
  readonly itemsCount: Signal<number>;

  getById(id: string): T | undefined;
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T;
  update(
    id: string,
    updates: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
  ): T | null;
  delete(id: string): boolean;
}

@Injectable()
export abstract class BaseServiceClass<T extends BaseEntity>
  implements BaseService<T>
{
  protected readonly _items = signal<T[]>([]);
  protected readonly utils = new UtilsService();

  // Public signals
  public readonly items = this._items.asReadonly();
  public readonly itemsCount = computed(() => this._items().length);

  /**
   * Get item by ID
   */
  getById(id: string): T | undefined {
    return this._items().find((item) => item.id === id);
  }

  /**
   * Create new item
   */
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T {
    const newItem: T = {
      ...data,
      id: this.utils.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as T;

    this._items.update((items) => [...items, newItem]);
    return newItem;
  }

  /**
   * Update existing item
   */
  update(
    id: string,
    updates: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
  ): T | null {
    const currentItems = this._items();
    const itemIndex = currentItems.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return null;
    }

    const updatedItem: T = {
      ...currentItems[itemIndex],
      ...updates,
      updatedAt: new Date(),
    } as T;

    this._items.update((items) =>
      items.map((item) => (item.id === id ? updatedItem : item))
    );

    return updatedItem;
  }

  /**
   * Delete item by ID
   */
  delete(id: string): boolean {
    const currentItems = this._items();
    const itemExists = currentItems.some((item) => item.id === id);

    if (!itemExists) {
      return false;
    }

    this._items.update((items) => items.filter((item) => item.id !== id));
    return true;
  }

  /**
   * Initialize with mock data
   */
  protected abstract initializeMockData(): void;
}
