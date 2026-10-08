import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { concatMap, from, toArray } from 'rxjs';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';
import { errorMessage } from '../../core/utils/api.util';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html'
})
export class CartComponent {
  readonly checkingOut = signal(false);

  constructor(
    readonly cart: CartService,
    private readonly orders: OrderService,
    private readonly toast: ToastService,
    private readonly router: Router
  ) {}

  quantityChanged(productId: number, event: Event): void {
    const quantity = Number((event.target as HTMLInputElement).value);
    this.cart.updateQuantity(productId, quantity);
  }

  checkout(): void {
    const items = this.cart.items();
    if (!items.length || this.checkingOut()) return;

    this.checkingOut.set(true);
    from(items).pipe(
      concatMap(item => this.orders.place({
        productId: item.productId,
        quantity: item.quantity
      })),
      toArray()
    ).subscribe({
      next: responses => {
        this.checkingOut.set(false);
        const failed = responses.find(response => !response.success);
        if (failed) {
          this.toast.error(failed.message || 'One or more orders could not be placed.');
          return;
        }
        this.cart.clear();
        this.toast.success('All cart items were ordered successfully.');
        void this.router.navigate(['/my-orders']);
      },
      error: error => {
        this.checkingOut.set(false);
        this.toast.error(errorMessage(error));
      }
    });
  }
}
