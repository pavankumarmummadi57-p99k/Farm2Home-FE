import { computed, Injectable, signal } from '@angular/core';
import { CART_KEY } from '../config/app.constants';
import { CartItem } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsState = signal<CartItem[]>(this.restore());

  readonly items = this.itemsState.asReadonly();
  readonly count = computed(() => this.itemsState().reduce((sum, item) => sum + 1, 0));
  readonly total = computed(() =>
    this.itemsState().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  add(item: CartItem): void {
    this.itemsState.update(items => {
      const index = items.findIndex(existing => existing.productId === item.productId);
      if (index < 0) return [...items, item];
      return items.map((existing, i) =>
        i === index
          ? { ...existing, quantity: existing.quantity + item.quantity }
          : existing
      );
    });
    this.persist();
  }

  updateQuantity(productId: number, quantity: number): void {
    this.itemsState.update(items =>
      items.map(item =>
        item.productId === productId
          ? { ...item, quantity: Math.max(item.minimumOrderQuantity || 1, quantity) }
          : item
      )
    );
    this.persist();
  }

  remove(productId: number): void {
    this.itemsState.update(items => items.filter(item => item.productId !== productId));
    this.persist();
  }

  clear(): void {
    this.itemsState.set([]);
    this.persist();
  }

  private persist(): void {
    localStorage.setItem(CART_KEY, JSON.stringify(this.itemsState()));
  }

  private restore(): CartItem[] {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) as CartItem[] : [];
    } catch {
      return [];
    }
  }
}
