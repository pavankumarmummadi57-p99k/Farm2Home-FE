import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CustomerAddressService } from '../../core/services/customer-address.service';
import { ToastService } from '../../core/services/toast.service';
import {
  CustomerAddressRequest,
  CustomerAddressResponse
} from '../../core/models/api.models';
import { errorMessage } from '../../core/utils/api.util';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './customer-profile.component.html'
})
export class CustomerProfileComponent {

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly addressExists = signal(false);
  readonly editing = signal(false);

  address: CustomerAddressResponse | null = null;

  form: CustomerAddressRequest = {
    addressLine1: '',
    addressLine2: '',
    village: '',
    mandal: '',
    district: '',
    state: '',
    pincode: '',
    landmark: ''
  };

  constructor(
    private readonly addressApi: CustomerAddressService,
    private readonly toast: ToastService
  ) {
    this.loadAddress();
  }

  loadAddress(): void {

    this.loading.set(true);

    this.addressApi.getMyAddress().subscribe({

      next: response => {

        this.loading.set(false);

        if (!response.success) {
          this.toast.error(
            response.message || 'Unable to load address.'
          );
          return;
        }

        if (!response.data) {

          this.addressExists.set(false);
          this.address = null;
          return;
        }

        this.addressExists.set(true);
        this.address = response.data;

        this.form = {
          addressLine1:
            response.data.addressLine1 || '',

          addressLine2:
            response.data.addressLine2 || '',

          village:
            response.data.village || '',

          mandal:
            response.data.mandal || '',

          district:
            response.data.district || '',

          state:
            response.data.state || '',

          pincode:
            response.data.pincode || '',

          landmark:
            response.data.landmark || ''
        };
      },

      error: error => {

        this.loading.set(false);

        this.toast.error(
          errorMessage(error)
        );
      }
    });
  }

  startAdd(): void {

    this.editing.set(true);

    this.form = {
      addressLine1: '',
      addressLine2: '',
      village: '',
      mandal: '',
      district: '',
      state: '',
      pincode: '',
      landmark: ''
    };
  }

  startEdit(): void {

    this.editing.set(true);
  }

  cancelEdit(): void {

    this.editing.set(false);

    if (this.address) {

      this.form = {
        addressLine1:
          this.address.addressLine1 || '',

        addressLine2:
          this.address.addressLine2 || '',

        village:
          this.address.village || '',

        mandal:
          this.address.mandal || '',

        district:
          this.address.district || '',

        state:
          this.address.state || '',

        pincode:
          this.address.pincode || '',

        landmark:
          this.address.landmark || ''
      };
    }
  }

  saveAddress(): void {

    if (!this.validate()) {
      return;
    }

    this.saving.set(true);

    const payload: CustomerAddressRequest = {

      addressLine1:
        this.form.addressLine1.trim(),

      addressLine2:
        this.form.addressLine2?.trim(),

      village:
        this.form.village.trim(),

      mandal:
        this.form.mandal.trim(),

      district:
        this.form.district.trim(),

      state:
        this.form.state.trim(),

      pincode:
        this.form.pincode.trim(),

      landmark:
        this.form.landmark?.trim()
    };

    const request$ =
      this.addressExists()
        ? this.addressApi.updateAddress(payload)
        : this.addressApi.saveAddress(payload);

    request$.subscribe({

      next: response => {

        this.saving.set(false);

        if (!response.success) {

          this.toast.error(
            response.message ||
            'Unable to save address.'
          );

          return;
        }

        this.toast.success(
          response.message ||
          'Delivery address saved.'
        );

        this.editing.set(false);

        this.loadAddress();
      },

      error: error => {

        this.saving.set(false);

        this.toast.error(
          errorMessage(error)
        );
      }
    });
  }

  private validate(): boolean {

    if (!this.form.addressLine1.trim()) {
      this.toast.error(
        'Enter house / door number.'
      );
      return false;
    }

    if (!this.form.village.trim()) {
      this.toast.error(
        'Enter village or locality.'
      );
      return false;
    }

    if (!this.form.mandal.trim()) {
      this.toast.error(
        'Enter mandal or city.'
      );
      return false;
    }

    if (!this.form.district.trim()) {
      this.toast.error(
        'Enter district.'
      );
      return false;
    }

    if (!this.form.state.trim()) {
      this.toast.error(
        'Enter state.'
      );
      return false;
    }

    if (!/^\d{6}$/.test(
      this.form.pincode.trim()
    )) {

      this.toast.error(
        'Pincode must be exactly 6 digits.'
      );

      return false;
    }

    return true;
  }
}