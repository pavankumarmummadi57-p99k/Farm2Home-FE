// // import { Component, signal } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { OrderService } from '../../core/services/order.service';
// // import { ToastService } from '../../core/services/toast.service';
// // import { JsonRecord } from '../../core/models/api.models';
// // import { errorMessage, listFromResponse, pickNumber, pickString, statusClass } from '../../core/utils/api.util';

// // @Component({
// //   standalone: true,
// //   imports: [CommonModule],
// //   templateUrl: './farmer-orders.component.html'
// // })
// // export class FarmerOrdersComponent {
// //   readonly orders = signal<JsonRecord[]>([]);
// //   readonly loading = signal(true);
// //   readonly statusClass = statusClass;

// //   constructor(api: OrderService, toast: ToastService) {
// //     api.farmerOrders().subscribe({
// //       next: response => {
// //         this.orders.set(listFromResponse<JsonRecord>(response, ['orders']));
// //         this.loading.set(false);
// //       },
// //       error: error => {
// //         this.loading.set(false);
// //         toast.error(errorMessage(error));
// //       }
// //     });
// //   }

// //   id(o: JsonRecord): string { return pickString(o, 'orderId', 'id') || '—'; }
// //   product(o: JsonRecord): string { return pickString(o, 'productName') || pickString(o['product'], 'productName', 'name') || 'Product'; }
// //   customer(o: JsonRecord): string { return pickString(o, 'customerName', 'buyerName', 'customerPhoneNumber', 'phoneNumber') || 'Customer'; }
// //   quantity(o: JsonRecord): string { return pickString(o, 'quantity', 'orderedQuantity') || '—'; }
// //   amount(o: JsonRecord): number { return pickNumber(o, 'totalAmount', 'totalPrice', 'amount'); }
// //   status(o: JsonRecord): string { return pickString(o, 'status', 'orderStatus') || 'PLACED'; }
// // }


// import { Component, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { OrderService } from '../../core/services/order.service';
// import { ToastService } from '../../core/services/toast.service';
// import { JsonRecord } from '../../core/models/api.models';
// import { errorMessage, listFromResponse, pickNumber, pickString, statusClass } from '../../core/utils/api.util';

// @Component({
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './farmer-orders.component.html'
// })
// export class FarmerOrdersComponent {
//   readonly orders = signal<JsonRecord[]>([]);
//   readonly loading = signal(true);
//   readonly updatingOrderId = signal<number | null>(null);
//   readonly rejectingOrderId = signal<number | null>(null);
//   readonly statusClass = statusClass;

//   rejectionReason = '';

//   constructor(
//     private readonly api: OrderService,
//     private readonly toast: ToastService
//   ) {
//     this.loadOrders();
//   }

//   loadOrders(): void {
//     this.loading.set(true);
//     this.api.farmerOrders().subscribe({
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

//   id(o: JsonRecord): string { return pickString(o, 'orderId', 'id') || '—'; }
//   idNumber(o: JsonRecord): number { return pickNumber(o, 'orderId', 'id'); }
//   product(o: JsonRecord): string { return pickString(o, 'productName') || pickString(o['product'], 'productName', 'name') || 'Product'; }
//   customer(o: JsonRecord): string { return pickString(o, 'customerName', 'buyerName', 'customerPhoneNumber', 'phoneNumber') || 'Customer'; }
//   customerPhone(o: JsonRecord): string { return pickString(o, 'customerPhoneNumber', 'phoneNumber'); }
//   quantity(o: JsonRecord): string { return pickString(o, 'quantity', 'orderedQuantity') || '—'; }
//   amount(o: JsonRecord): number { return pickNumber(o, 'totalAmount', 'totalPrice', 'amount'); }
//   status(o: JsonRecord): string { return (pickString(o, 'status', 'orderStatus') || 'PENDING').toUpperCase(); }

//   accept(order: JsonRecord): void {
//     const orderId = this.idNumber(order);
//     if (!orderId || this.status(order) !== 'PENDING') return;

//     this.updatingOrderId.set(orderId);
//     this.api.updateStatus(orderId, { status: 'ACCEPTED' }).subscribe({
//       next: response => {
//         this.updatingOrderId.set(null);
//         if (!response.success) {
//           this.toast.error(response.message || 'Unable to accept order.');
//           return;
//         }
//         this.toast.success(response.message || 'Order accepted successfully.');
//         this.loadOrders();
//       },
//       error: error => {
//         this.updatingOrderId.set(null);
//         this.toast.error(errorMessage(error));
//       }
//     });
//   }

//   openReject(order: JsonRecord): void {
//     const orderId = this.idNumber(order);
//     if (!orderId || this.status(order) !== 'PENDING') return;
//     this.rejectionReason = '';
//     this.rejectingOrderId.set(orderId);
//   }

//   cancelReject(): void {
//     this.rejectingOrderId.set(null);
//     this.rejectionReason = '';
//   }

//   confirmReject(): void {
//     const orderId = this.rejectingOrderId();
//     const reason = this.rejectionReason.trim();

//     if (!orderId) return;
//     if (!reason) {
//       this.toast.error('Please enter a rejection reason.');
//       return;
//     }

//     this.updatingOrderId.set(orderId);
//     this.api.updateStatus(orderId, {
//       status: 'REJECTED',
//       rejectionReason: reason
//     }).subscribe({
//       next: response => {
//         this.updatingOrderId.set(null);
//         if (!response.success) {
//           this.toast.error(response.message || 'Unable to reject order.');
//           return;
//         }
//         this.toast.success(response.message || 'Order rejected successfully.');
//         this.cancelReject();
//         this.loadOrders();
//       },
//       error: error => {
//         this.updatingOrderId.set(null);
//         this.toast.error(errorMessage(error));
//       }
//     });
//   }
// }


import {
  Component,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  OrderService
} from '../../core/services/order.service';

import {
  ToastService
} from '../../core/services/toast.service';

import {
  JsonRecord
} from '../../core/models/api.models';

import {
  errorMessage,
  listFromResponse,
  pickNumber,
  pickString,
  statusClass
} from '../../core/utils/api.util';

@Component({
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './farmer-orders.component.html'
})
export class FarmerOrdersComponent {

  readonly orders =
    signal<JsonRecord[]>([]);

  readonly loading =
    signal(true);

  readonly updatingOrderId =
    signal<number | null>(null);

  readonly rejectingOrderId =
    signal<number | null>(null);

  /*
   * Order selected when farmer
   * clicks product name.
   */
  readonly selectedOrder =
    signal<JsonRecord | null>(null);

  readonly statusClass =
    statusClass;

  rejectionReason = '';

  constructor(
    private readonly api:
      OrderService,

    private readonly toast:
      ToastService
  ) {

    this.loadOrders();
  }

  loadOrders(): void {

    this.loading.set(true);

    this.api
      .farmerOrders()
      .subscribe({

        next: response => {

          this.orders.set(
            listFromResponse<JsonRecord>(
              response,
              ['orders']
            )
          );

          this.loading.set(false);
        },

        error: error => {

          this.loading.set(false);

          this.toast.error(
            errorMessage(error)
          );
        }
      });
  }

  id(o: JsonRecord): string {

    return pickString(
      o,
      'orderId',
      'id'
    ) || '—';
  }

  idNumber(o: JsonRecord): number {

    return pickNumber(
      o,
      'orderId',
      'id'
    );
  }

  product(o: JsonRecord): string {

    return (
      pickString(
        o,
        'productName'
      )
      ||
      pickString(
        o['product'],
        'productName',
        'name'
      )
      ||
      'Product'
    );
  }

  customer(o: JsonRecord): string {

    return (
      pickString(
        o,
        'customerName',
        'buyerName',
        'customerPhoneNumber',
        'phoneNumber'
      )
      ||
      'Customer'
    );
  }

  customerPhone(
    o: JsonRecord
  ): string {

    return pickString(
      o,
      'customerPhoneNumber',
      'phoneNumber'
    );
  }

  quantity(
    o: JsonRecord
  ): string {

    return pickString(
      o,
      'quantity',
      'orderedQuantity'
    ) || '—';
  }

  amount(
    o: JsonRecord
  ): number {

    return pickNumber(
      o,
      'totalAmount',
      'totalPrice',
      'amount'
    );
  }

  status(
    o: JsonRecord
  ): string {

    return (
      pickString(
        o,
        'status',
        'orderStatus'
      )
      ||
      'PENDING'
    ).toUpperCase();
  }

  addressLine1(
    o: JsonRecord
  ): string {

    return pickString(
      o,
      'deliveryAddressLine1'
    );
  }

  addressLine2(
    o: JsonRecord
  ): string {

    return pickString(
      o,
      'deliveryAddressLine2'
    );
  }

  village(
    o: JsonRecord
  ): string {

    return pickString(
      o,
      'deliveryVillage'
    );
  }

  mandal(
    o: JsonRecord
  ): string {

    return pickString(
      o,
      'deliveryMandal'
    );
  }

  district(
    o: JsonRecord
  ): string {

    return pickString(
      o,
      'deliveryDistrict'
    );
  }

  state(
    o: JsonRecord
  ): string {

    return pickString(
      o,
      'deliveryState'
    );
  }

  pincode(
    o: JsonRecord
  ): string {

    return pickString(
      o,
      'deliveryPincode'
    );
  }

  landmark(
    o: JsonRecord
  ): string {

    return pickString(
      o,
      'deliveryLandmark'
    );
  }

  openOrderDetails(
    order: JsonRecord
  ): void {

    this.selectedOrder.set(order);
  }

  closeOrderDetails(): void {

    this.selectedOrder.set(null);
  }

  accept(
    order: JsonRecord
  ): void {

    const orderId =
      this.idNumber(order);

    if (!orderId
        || this.status(order)
        !== 'PENDING') {
      return;
    }

    this.updatingOrderId.set(
      orderId
    );

    this.api
      .updateStatus(
        orderId,
        {
          status: 'ACCEPTED'
        }
      )
      .subscribe({

        next: response => {

          this.updatingOrderId.set(
            null
          );

          if (!response.success) {

            this.toast.error(
              response.message ||
              'Unable to accept order.'
            );

            return;
          }

          this.toast.success(
            response.message ||
            'Order accepted successfully.'
          );

          this.loadOrders();
        },

        error: error => {

          this.updatingOrderId.set(
            null
          );

          this.toast.error(
            errorMessage(error)
          );
        }
      });
  }

  openReject(
    order: JsonRecord
  ): void {

    const orderId =
      this.idNumber(order);

    if (!orderId
        || this.status(order)
        !== 'PENDING') {
      return;
    }

    this.rejectionReason = '';

    this.rejectingOrderId.set(
      orderId
    );
  }

  cancelReject(): void {

    this.rejectingOrderId.set(
      null
    );

    this.rejectionReason = '';
  }

  confirmReject(): void {

    const orderId =
      this.rejectingOrderId();

    const reason =
      this.rejectionReason.trim();

    if (!orderId) {
      return;
    }

    if (!reason) {

      this.toast.error(
        'Please enter a rejection reason.'
      );

      return;
    }

    this.updatingOrderId.set(
      orderId
    );

    this.api
      .updateStatus(
        orderId,
        {
          status: 'REJECTED',
          rejectionReason: reason
        }
      )
      .subscribe({

        next: response => {

          this.updatingOrderId.set(
            null
          );

          if (!response.success) {

            this.toast.error(
              response.message ||
              'Unable to reject order.'
            );

            return;
          }

          this.toast.success(
            response.message ||
            'Order rejected successfully.'
          );

          this.cancelReject();

          this.loadOrders();
        },

        error: error => {

          this.updatingOrderId.set(
            null
          );

          this.toast.error(
            errorMessage(error)
          );
        }
      });
  }
}