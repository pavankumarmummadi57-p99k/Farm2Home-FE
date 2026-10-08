import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { OrderService } from '../../core/services/order.service';
import { FarmerService } from '../../core/services/farmer.service';
import { JsonRecord } from '../../core/models/api.models';
import { listFromResponse, pickString, recordFromResponse, statusClass } from '../../core/utils/api.util';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './farmer-dashboard.component.html'
})
export class FarmerDashboardComponent {
  readonly loading = signal(true);
  readonly productCount = signal(0);
  readonly orderCount = signal(0);
  readonly profile = signal<JsonRecord>({});
  readonly verification = signal<JsonRecord>({});
  readonly statusClass = statusClass;

  constructor(
    products: ProductService,
    orders: OrderService,
    farmer: FarmerService
  ) {
    forkJoin({
      products: products.myProducts(),
      orders: orders.farmerOrders(),
      profile: farmer.profile(),
      verification: farmer.verificationStatus()
    }).subscribe({
      next: result => {
        this.productCount.set(listFromResponse(result.products, ['products']).length);
        this.orderCount.set(listFromResponse(result.orders, ['orders']).length);
        this.profile.set(recordFromResponse<JsonRecord>(result.profile, ['farmer', 'profile']));
        this.verification.set(recordFromResponse<JsonRecord>(result.verification, ['verification', 'status']));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  farmerName(): string {
    return pickString(this.profile(), 'farmerName', 'name', 'fullName') || 'Farmer';
  }

  farmName(): string {
    return pickString(this.profile(), 'farmName') || 'Your farm';
  }

  verificationStatus(): string {
    return pickString(this.verification(), 'status', 'verificationStatus', 'farmerStatus') || 'UNKNOWN';
  }
}
