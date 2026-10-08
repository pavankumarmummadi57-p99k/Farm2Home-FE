import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';

import { JsonRecord } from '../../core/models/api.models';

import {
  entityId,
  errorMessage,
  listFromResponse,
  pickString
} from '../../core/utils/api.util';

import {
  productAvailable,
  productAvailableQuantity,
  productCategoryName,
  productId,
  productImage,
  productMinimumOrder,
  productName,
  productPrice,
  productUnit
} from '../../core/utils/product.util';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent {

  readonly products = signal<JsonRecord[]>([]);
  readonly categories = signal<JsonRecord[]>([]);
  readonly loading = signal(true);
  readonly searchLoading = signal(false);
  readonly activeCategory = signal<number | null>(null);
  readonly callingProductId = signal<number | null>(null);

  keyword = '';

  readonly productId = productId;
  readonly productName = productName;
  readonly productImage = productImage;
  readonly productPrice = productPrice;
  readonly productUnit = productUnit;
  readonly productCategoryName = productCategoryName;
  readonly productAvailable = productAvailable;
  readonly productAvailableQuantity = productAvailableQuantity;

  constructor(
    private readonly productsApi: ProductService,
    private readonly categoriesApi: CategoryService,
    readonly auth: AuthService,
    private readonly cart: CartService,
    private readonly toast: ToastService,
    private readonly router: Router
  ) {
    this.loadInitial();
  }

  categoryId(category: JsonRecord): number {
    return entityId(category);
  }

  categoryName(category: JsonRecord): string {
    return (
      pickString(category, 'name', 'categoryName')
      || `Category ${this.categoryId(category)}`
    );
  }

  loadInitial(): void {
    this.loading.set(true);

    this.productsApi.browse().subscribe({
      next: response => {
        this.products.set(
          listFromResponse<JsonRecord>(response, ['products'])
        );
        this.loading.set(false);
      },
      error: error => {
        this.loading.set(false);
        this.toast.error(errorMessage(error));
      }
    });

    this.categoriesApi.all().subscribe({
      next: response => {
        this.categories.set(
          listFromResponse<JsonRecord>(response, ['categories'])
        );
      },
      error: () => this.categories.set([])
    });
  }

  search(): void {
    const keyword = this.keyword.trim();

    this.activeCategory.set(null);

    if (!keyword) {
      this.loadProducts();
      return;
    }

    this.searchLoading.set(true);

    this.productsApi.search(keyword).subscribe({
      next: response => {
        this.products.set(
          listFromResponse<JsonRecord>(response, ['products'])
        );
        this.searchLoading.set(false);
      },
      error: error => {
        this.searchLoading.set(false);
        this.toast.error(errorMessage(error));
      }
    });
  }

  filterCategory(id: number | null): void {
    this.activeCategory.set(id);
    this.keyword = '';

    if (id === null) {
      this.loadProducts();
      return;
    }

    this.loading.set(true);

    this.productsApi.byCategory(id).subscribe({
      next: response => {
        this.products.set(
          listFromResponse<JsonRecord>(response, ['products'])
        );
        this.loading.set(false);
      },
      error: error => {
        this.loading.set(false);
        this.toast.error(errorMessage(error));
      }
    });
  }

  addToCart(product: JsonRecord): void {
    if (!productAvailable(product)) {
      this.toast.info(
        'This product is currently unavailable.'
      );
      return;
    }

    if (!this.auth.isAuthenticated()) {
      void this.router.navigate(
        ['/login'],
        {
          queryParams: {
            returnUrl: '/'
          }
        }
      );
      return;
    }

    if (this.auth.role() !== 'CUSTOMER') {
      this.toast.info(
        'Cart and ordering are available to customer accounts.'
      );
      return;
    }

    const id = productId(product);

    if (!id) {
      this.toast.error(
        'This product response does not include a product id.'
      );
      return;
    }

    this.cart.add({
      productId: id,
      productName: productName(product),
      price: productPrice(product),
      unit: productUnit(product),
      quantity: productMinimumOrder(product),
      minimumOrderQuantity: productMinimumOrder(product),
      image: productImage(product)
    });

    this.toast.success(
      'Added to cart.'
    );
  }

  callFarmer(product: JsonRecord): void {
    if (!this.auth.isAuthenticated()) {
      void this.router.navigate(
        ['/login'],
        {
          queryParams: {
            returnUrl: '/'
          }
        }
      );
      return;
    }

    const role = this.auth.role();

    if (
      role !== 'CUSTOMER'
      && role !== 'FARMER'
    ) {
      this.toast.info(
        'Farmer calling is available to customer and farmer accounts.'
      );
      return;
    }

    const id = productId(product);

    if (!id) {
      this.toast.error(
        'Unable to identify this product.'
      );
      return;
    }

    if (this.callingProductId() === id) {
      return;
    }

    this.callingProductId.set(id);

    this.productsApi.farmerContact(id).subscribe({
      next: response => {
        this.callingProductId.set(null);

        if (!response.success) {
          this.toast.error(
            response.message
            || 'Farmer contact is not available.'
          );
          return;
        }

        const contact =
          (response.data ?? {}) as JsonRecord;

        const phoneNumber =
          pickString(
            contact,
            'phoneNumber',
            'farmerPhoneNumber'
          );

        this.openDialer(phoneNumber);
      },
      error: error => {
        this.callingProductId.set(null);
        this.toast.error(
          errorMessage(error)
        );
      }
    });
  }

  private openDialer(phoneNumber: string): void {
    const dialNumber = phoneNumber
      .trim()
      .replace(/[^0-9+]/g, '');

    if (!dialNumber) {
      this.toast.error(
        'Farmer phone number is not available.'
      );
      return;
    }

    window.location.href =
      `tel:${dialNumber}`;
  }

  private loadProducts(): void {
    this.loading.set(true);

    this.productsApi.browse().subscribe({
      next: response => {
        this.products.set(
          listFromResponse<JsonRecord>(response, ['products'])
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
}
