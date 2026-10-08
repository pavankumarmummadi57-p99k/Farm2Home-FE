import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly messages = signal<ToastMessage[]>([]);
  private nextId = 1;

  success(message: string): void {
    this.push('success', message);
  }

  error(message: string): void {
    this.push('error', message);
  }

  info(message: string): void {
    this.push('info', message);
  }

  remove(id: number): void {
    this.messages.update(items => items.filter(item => item.id !== id));
  }

  private push(type: ToastMessage['type'], message: string): void {
    const id = this.nextId++;
    this.messages.update(items => [...items, { id, type, message }]);
    window.setTimeout(() => this.remove(id), 4200);
  }
}
