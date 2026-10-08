import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { ToastService } from '../../core/services/toast.service';
import { JsonRecord } from '../../core/models/api.models';
import { deepPickString, errorMessage, recordFromResponse, statusClass } from '../../core/utils/api.util';
import { resolveAssetUrl } from '../../core/utils/product.util';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-farmer-detail.component.html'
})
export class AdminFarmerDetailComponent {
  readonly farmer = signal<JsonRecord>({});
  readonly loading = signal(true);
  readonly actionLoading = signal(false);
  readonly statusClass = statusClass;
  readonly farmerId: number;
  readonly rejectForm;

  constructor(
    route: ActivatedRoute,
    fb: FormBuilder,
    private readonly admin: AdminService,
    private readonly toast: ToastService,
    private readonly router: Router
  ) {
    this.farmerId = Number(route.snapshot.paramMap.get('id'));
    this.rejectForm = fb.nonNullable.group({ remarks: [''] });
    this.load();
  }

  value(...keys: string[]): string {
    return deepPickString(this.farmer(), ...keys) || '—';
  }

  status(): string {
    return deepPickString(this.farmer(), 'status', 'verificationStatus', 'farmerStatus') || 'PENDING';
  }

  asset(...keys: string[]): string {
    const path = deepPickString(this.farmer(), ...keys);
    return path ? resolveAssetUrl(path) : '';
  }

  approve(): void {
    if (!this.farmerId || this.actionLoading()) return;
    this.actionLoading.set(true);
    this.admin.approveFarmer(this.farmerId).subscribe({
      next: response => {
        this.actionLoading.set(false);
        if (!response.success) {
          this.toast.error(response.message || 'Approval failed.');
          return;
        }
        this.toast.success(response.message || 'Farmer approved.');
        void this.router.navigate(['/admin/farmers']);
      },
      error: error => {
        this.actionLoading.set(false);
        this.toast.error(errorMessage(error));
      }
    });
  }

  reject(): void {
    if (!this.farmerId || this.actionLoading()) return;
    this.actionLoading.set(true);
    this.admin.rejectFarmer(this.farmerId, this.rejectForm.getRawValue()).subscribe({
      next: response => {
        this.actionLoading.set(false);
        if (!response.success) {
          this.toast.error(response.message || 'Rejection failed.');
          return;
        }
        this.toast.success(response.message || 'Farmer rejected.');
        void this.router.navigate(['/admin/farmers']);
      },
      error: error => {
        this.actionLoading.set(false);
        this.toast.error(errorMessage(error));
      }
    });
  }

  private load(): void {
    if (!this.farmerId) {
      this.loading.set(false);
      return;
    }
    this.admin.farmerDetails(this.farmerId).subscribe({
      next: response => {
        this.farmer.set(recordFromResponse<JsonRecord>(response));
        this.loading.set(false);
      },
      error: error => {
        this.loading.set(false);
        this.toast.error(errorMessage(error));
      }
    });
  }
}
