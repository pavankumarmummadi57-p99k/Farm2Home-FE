import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { ToastService } from '../../core/services/toast.service';
import { JsonRecord } from '../../core/models/api.models';
import { errorMessage, listFromResponse } from '../../core/utils/api.util';
import {
  productAvailable,
  productAvailableQuantity,
  productId,
  productImage,
  productName,
  productPrice,
  productUnit
} from '../../core/utils/product.util';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './farmer-products.component.html'
})
export class FarmerProductsComponent {
  readonly products = signal<JsonRecord[]>([]);
  readonly loading = signal(true);
  readonly deletingId = signal<number | null>(null);

  readonly productId = productId;
  readonly productName = productName;
  readonly productImage = productImage;
  readonly productPrice = productPrice;
  readonly productUnit = productUnit;
  readonly productAvailableQuantity = productAvailableQuantity;
  readonly productAvailable = productAvailable;

  constructor(
    private readonly api: ProductService,
    private readonly toast: ToastService
  ) {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api.myProducts().subscribe({
      next: response => {
        this.products.set(listFromResponse<JsonRecord>(response, ['products']));
        this.loading.set(false);
      },
      error: error => {
        this.loading.set(false);
        this.toast.error(errorMessage(error));
      }
    });
  }

  remove(product: JsonRecord): void {
    const id = productId(product);
    if (!id || !confirm(`Delete "${productName(product)}"?`)) return;

    this.deletingId.set(id);
    this.api.delete(id).subscribe({
      next: response => {
        this.deletingId.set(null);
        if (!response.success) {
          this.toast.error(response.message || 'Delete failed.');
          return;
        }
        this.toast.success(response.message || 'Product deleted.');
        this.products.update(items => items.filter(item => productId(item) !== id));
      },
      error: error => {
        this.deletingId.set(null);
        this.toast.error(errorMessage(error));
      }
    });
  }
}
