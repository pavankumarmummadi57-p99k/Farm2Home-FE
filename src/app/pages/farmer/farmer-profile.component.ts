import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FarmerService } from '../../core/services/farmer.service';
import { ToastService } from '../../core/services/toast.service';
import { errorMessage, pickNumber, pickString, recordFromResponse } from '../../core/utils/api.util';
import { JsonRecord } from '../../core/models/api.models';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './farmer-profile.component.html'
})
export class FarmerProfileComponent {
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly form;

  constructor(
    fb: FormBuilder,
    private readonly farmer: FarmerService,
    private readonly toast: ToastService
  ) {
    this.form = fb.nonNullable.group({
      farmerName: ['', Validators.required],
      farmName: ['', Validators.required],
      farmAddress: ['', Validators.required],
      village: ['', Validators.required],
      mandal: ['', Validators.required],
      district: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', Validators.pattern(/^\d{6}$/)],
      farmArea: [0, [Validators.required, Validators.min(0.01)]],
      governmentIdType: ['AADHAAR' as const, Validators.required],
      governmentIdNumber: ['', Validators.required]
    });
    this.load();
  }

  save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.farmer.updateProfile(this.form.getRawValue()).subscribe({
      next: response => {
        this.saving.set(false);
        response.success
          ? this.toast.success(response.message || 'Farmer profile updated.')
          : this.toast.error(response.message || 'Profile update failed.');
      },
      error: error => {
        this.saving.set(false);
        this.toast.error(errorMessage(error));
      }
    });
  }

  private load(): void {
    this.farmer.profile().subscribe({
      next: response => {
        const p = recordFromResponse<JsonRecord>(response, ['farmer', 'profile']);
        this.form.patchValue({
          farmerName: pickString(p, 'farmerName'),
          farmName: pickString(p, 'farmName'),
          farmAddress: pickString(p, 'farmAddress'),
          village: pickString(p, 'village'),
          mandal: pickString(p, 'mandal'),
          district: pickString(p, 'district'),
          state: pickString(p, 'state'),
          pincode: pickString(p, 'pincode'),
          farmArea: pickNumber(p, 'farmArea'),
          governmentIdType: (pickString(p, 'governmentIdType') as any) || 'AADHAAR',
          governmentIdNumber: pickString(p, 'governmentIdNumber')
        });
        this.loading.set(false);
      },
      error: error => {
        this.loading.set(false);
        this.toast.error(errorMessage(error));
      }
    });
  }
}
