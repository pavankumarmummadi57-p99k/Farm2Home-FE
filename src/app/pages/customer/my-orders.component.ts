// import { Component, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { OrderService } from '../../core/services/order.service';
// import { ToastService } from '../../core/services/toast.service';
// import { JsonRecord } from '../../core/models/api.models';
// import { errorMessage, listFromResponse, pickNumber, pickString, statusClass } from '../../core/utils/api.util';

// @Component({
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './my-orders.component.html'
// })
// export class MyOrdersComponent {
//   readonly orders = signal<JsonRecord[]>([]);
//   readonly loading = signal(true);
//   readonly statusClass = statusClass;

//   constructor(
//     private readonly api: OrderService,
//     private readonly toast: ToastService
//   ) {
//     this.api.myOrders().subscribe({
//       next: response => {
//         this.orders.set(listFromResponse<JsonRecord>(response, ['orders']));
//         this.loading.set(false);
//       },
//       error: error => {
//         this.loading.set(false);
//         this.toast.error(errorMessage(error));
//       }
//     });
//   }

//   id(order: JsonRecord): string {
//     return pickString(order, 'orderId', 'id') || '—';
//   }
//   product(order: JsonRecord): string {
//     return pickString(order, 'productName', 'name') || pickString(order['product'], 'productName', 'name') || 'Product';
//   }
//   quantity(order: JsonRecord): string {
//     return pickString(order, 'quantity', 'orderedQuantity') || '—';
//   }
//   amount(order: JsonRecord): number {
//     return pickNumber(order, 'totalAmount', 'totalPrice', 'amount');
//   }
//   status(order: JsonRecord): string {
//     return pickString(order, 'status', 'orderStatus') || 'PLACED';
//   }
//   date(order: JsonRecord): string {
//     return pickString(order, 'createdAt', 'orderDate', 'createdDate', 'placedAt');
//   }
// }


import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';
import { JsonRecord } from '../../core/models/api.models';
import { errorMessage, listFromResponse, pickNumber, pickString, statusClass } from '../../core/utils/api.util';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-orders.component.html'
})
export class MyOrdersComponent {
  readonly orders = signal<JsonRecord[]>([]);
  readonly loading = signal(true);
  readonly statusClass = statusClass;

  constructor(
    private readonly api: OrderService,
    private readonly toast: ToastService
  ) {
    this.api.myOrders().subscribe({
      next: response => {
        this.orders.set(listFromResponse<JsonRecord>(response, ['orders']));
        this.loading.set(false);
      },
      error: error => {
        this.loading.set(false);
        this.toast.error(errorMessage(error));
      }
    });
  }

  id(order: JsonRecord): string {
    return pickString(order, 'orderId', 'id') || '—';
  }
  product(order: JsonRecord): string {
    return pickString(order, 'productName', 'name') || pickString(order['product'], 'productName', 'name') || 'Product';
  }
  quantity(order: JsonRecord): string {
    return pickString(order, 'quantity', 'orderedQuantity') || '—';
  }
  amount(order: JsonRecord): number {
    return pickNumber(order, 'totalAmount', 'totalPrice', 'amount');
  }
  status(order: JsonRecord): string {
    return (pickString(order, 'status', 'orderStatus') || 'PENDING').toUpperCase();
  }
  rejectionReason(order: JsonRecord): string {
    return pickString(order, 'rejectionReason', 'reason', 'remarks');
  }
  date(order: JsonRecord): string {
    return pickString(order, 'createdAt', 'orderDate', 'createdDate', 'placedAt');
  }
}
