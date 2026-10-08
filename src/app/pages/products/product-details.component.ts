import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../core/services/product.service';
import { OrderService } from '../../core/services/order.service';
import { CustomerAddressService } from '../../core/services/customer-address.service';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';

import {
  CustomerAddressRequest,
  JsonRecord,
  PlaceOrderRequest
} from '../../core/models/api.models';

import {
  errorMessage,
  pickString,
  recordFromResponse
} from '../../core/utils/api.util';

import {
  productAvailable,
  productAvailableQuantity,
  productCategoryName,
  productDescription,
  productFarmerName,
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
  templateUrl: './product-details.component.html'
})
export class ProductDetailsComponent {

  readonly product = signal<JsonRecord>({});
  readonly loading = signal(true);
  readonly ordering = signal(false);
  readonly callingFarmer = signal(false);

  readonly addressModalOpen = signal(false);
  readonly savingAddress = signal(false);

  quantity = 1;

  private pendingOrder: PlaceOrderRequest | null = null;

  addressForm: CustomerAddressRequest = {
    addressLine1: '',
    addressLine2: '',
    village: '',
    mandal: '',
    district: '',
    state: '',
    pincode: '',
    landmark: ''
  };

  readonly productId = productId;
  readonly productName = productName;
  readonly productImage = productImage;
  readonly productPrice = productPrice;
  readonly productUnit = productUnit;
  readonly productDescription = productDescription;
  readonly productCategoryName = productCategoryName;
  readonly productFarmerName = productFarmerName;
  readonly productAvailable = productAvailable;
  readonly productAvailableQuantity =
    productAvailableQuantity;
  readonly productMinimumOrder =
    productMinimumOrder;

  constructor(
    route: ActivatedRoute,
    private readonly productsApi: ProductService,
    private readonly ordersApi: OrderService,
    private readonly addressApi: CustomerAddressService,
    readonly auth: AuthService,
    private readonly cart: CartService,
    private readonly toast: ToastService,
    private readonly router: Router
  ) {

    const id =
      Number(
        route.snapshot
          .paramMap
          .get('id')
      );

    if (!id) {
      this.loading.set(false);
      return;
    }

    this.productsApi
      .details(id)
      .subscribe({
        next: response => {
          const product =
            recordFromResponse<JsonRecord>(
              response,
              ['product']
            );

          this.product.set(product);

          this.quantity =
            productMinimumOrder(product);

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

  callFarmer(): void {

    if (!this.auth.isAuthenticated()) {
      void this.router.navigate(
        ['/login'],
        {
          queryParams: {
            returnUrl:
              this.router.url
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

    if (this.callingFarmer()) {
      return;
    }

    const id =
      productId(
        this.product()
      );

    if (!id) {
      this.toast.error(
        'Unable to identify this product.'
      );
      return;
    }

    this.callingFarmer.set(true);

    this.productsApi
      .farmerContact(id)
      .subscribe({
        next: response => {
          this.callingFarmer.set(false);

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
          this.callingFarmer.set(false);

          this.toast.error(
            errorMessage(error)
          );
        }
      });
  }

  addToCart(): void {

    if (
      !productAvailable(
        this.product()
      )
    ) {
      this.toast.info(
        'This product is currently unavailable.'
      );
      return;
    }

    if (!this.ensureCustomer()) {
      return;
    }

    const product =
      this.product();

    const id =
      productId(product);

    if (!id) {
      return;
    }

    this.cart.add({
      productId: id,
      productName:
        productName(product),
      price:
        productPrice(product),
      unit:
        productUnit(product),
      quantity:
        Math.max(
          productMinimumOrder(product),
          Number(this.quantity) || 1
        ),
      minimumOrderQuantity:
        productMinimumOrder(product),
      image:
        productImage(product)
    });

    this.toast.success(
      'Added to cart.'
    );
  }

  buyNow(): void {

    if (
      !productAvailable(
        this.product()
      )
    ) {
      this.toast.info(
        'This product is currently unavailable.'
      );
      return;
    }

    if (
      !this.ensureCustomer()
      || this.ordering()
    ) {
      return;
    }

    const id =
      productId(
        this.product()
      );

    if (!id) {
      return;
    }

    const payload: PlaceOrderRequest = {
      productId: id,
      quantity:
        Math.max(
          productMinimumOrder(
            this.product()
          ),
          Number(this.quantity) || 1
        )
    };

    this.pendingOrder = payload;

    this.ordering.set(true);

    this.addressApi
      .getMyAddress()
      .subscribe({
        next: response => {
          if (!response.success) {
            this.ordering.set(false);

            this.toast.error(
              response.message
              || 'Unable to check delivery address.'
            );
            return;
          }

          if (response.data) {
            this.placePendingOrder();
            return;
          }

          this.ordering.set(false);
          this.addressModalOpen.set(true);
        },
        error: error => {
          this.ordering.set(false);

          this.toast.error(
            errorMessage(error)
          );
        }
      });
  }

  saveAddressAndContinue(): void {

    if (this.savingAddress()) {
      return;
    }

    if (!this.validateAddress()) {
      return;
    }

    this.savingAddress.set(true);

    const payload: CustomerAddressRequest = {
      addressLine1:
        this.addressForm.addressLine1.trim(),
      addressLine2:
        this.addressForm.addressLine2?.trim(),
      village:
        this.addressForm.village.trim(),
      mandal:
        this.addressForm.mandal.trim(),
      district:
        this.addressForm.district.trim(),
      state:
        this.addressForm.state.trim(),
      pincode:
        this.addressForm.pincode.trim(),
      landmark:
        this.addressForm.landmark?.trim()
    };

    this.addressApi
      .saveAddress(payload)
      .subscribe({
        next: response => {
          this.savingAddress.set(false);

          if (!response.success) {
            this.toast.error(
              response.message
              || 'Unable to save delivery address.'
            );
            return;
          }

          this.toast.success(
            'Delivery address saved.'
          );

          this.addressModalOpen.set(false);

          this.placePendingOrder();
        },
        error: error => {
          this.savingAddress.set(false);

          this.toast.error(
            errorMessage(error)
          );
        }
      });
  }

  closeAddressModal(): void {

    if (this.savingAddress()) {
      return;
    }

    this.addressModalOpen.set(false);
    this.pendingOrder = null;
  }

  private placePendingOrder(): void {

    if (!this.pendingOrder) {
      this.ordering.set(false);
      return;
    }

    const payload =
      this.pendingOrder;

    this.ordering.set(true);

    this.ordersApi
      .place(payload)
      .subscribe({
        next: response => {
          this.ordering.set(false);

          if (!response.success) {
            this.toast.error(
              response.message
              || 'Order could not be placed.'
            );
            return;
          }

          this.pendingOrder = null;

          this.toast.success(
            response.message
            || 'Order placed successfully.'
          );

          void this.router.navigate([
            '/my-orders'
          ]);
        },
        error: error => {
          this.ordering.set(false);

          this.toast.error(
            errorMessage(error)
          );
        }
      });
  }

  private openDialer(phoneNumber: string): void {

    const dialNumber =
      phoneNumber
        .trim()
        .replace(
          /[^0-9+]/g,
          ''
        );

    if (!dialNumber) {
      this.toast.error(
        'Farmer phone number is not available.'
      );
      return;
    }

    window.location.href =
      `tel:${dialNumber}`;
  }

  private validateAddress(): boolean {

    if (!this.addressForm.addressLine1.trim()) {
      this.toast.error(
        'Please enter house / door number and address.'
      );
      return false;
    }

    if (!this.addressForm.village.trim()) {
      this.toast.error(
        'Please enter village or locality.'
      );
      return false;
    }

    if (!this.addressForm.mandal.trim()) {
      this.toast.error(
        'Please enter mandal or city.'
      );
      return false;
    }

    if (!this.addressForm.district.trim()) {
      this.toast.error(
        'Please enter district.'
      );
      return false;
    }

    if (!this.addressForm.state.trim()) {
      this.toast.error(
        'Please enter state.'
      );
      return false;
    }

    const pincode =
      this.addressForm.pincode.trim();

    if (!/^\d{6}$/.test(pincode)) {
      this.toast.error(
        'Pincode must contain exactly 6 digits.'
      );
      return false;
    }

    return true;
  }

  private ensureCustomer(): boolean {

    if (!this.auth.isAuthenticated()) {
      void this.router.navigate(
        ['/login'],
        {
          queryParams: {
            returnUrl:
              this.router.url
          }
        }
      );
      return false;
    }

    if (
      this.auth.role()
      !== 'CUSTOMER'
    ) {
      this.toast.info(
        'Ordering is available to customer accounts.'
      );
      return false;
    }

    return true;
  }
}
