import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FarmerService } from '../../core/services/farmer.service';
import { ToastService } from '../../core/services/toast.service';
import { errorMessage } from '../../core/utils/api.util';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './farmer-register.component.html'
})
export class FarmerRegisterComponent {
  readonly loading = signal(false);
  readonly form;

  constructor(
    fb: FormBuilder,
    private readonly farmer: FarmerService,
    private readonly toast: ToastService,
    private readonly router: Router
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
  }

  submit(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.farmer.register(this.form.getRawValue()).subscribe({
      next: response => {
        this.loading.set(false);
        if (!response.success) {
          this.toast.error(response.message || 'Farmer registration failed.');
          return;
        }
        this.toast.success(response.message || 'Farmer profile registered. Complete document verification next.');
        void this.router.navigate(['/farmer/verification']);
      },
      error: error => {
        this.loading.set(false);
        this.toast.error(errorMessage(error));
      }
    });
  }
}
