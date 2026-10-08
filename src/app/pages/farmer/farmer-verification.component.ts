import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FarmerService } from '../../core/services/farmer.service';
import { ToastService } from '../../core/services/toast.service';
import { JsonRecord } from '../../core/models/api.models';
import { errorMessage, pickString, recordFromResponse, statusClass } from '../../core/utils/api.util';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './farmer-verification.component.html'
})
export class FarmerVerificationComponent {
  readonly status = signal<JsonRecord>({});
  readonly loading = signal(true);
  readonly idUploading = signal(false);
  readonly farmUploading = signal(false);
  readonly statusClass = statusClass;

  frontImage: File | null = null;
  backImage: File | null = null;
  farmPhoto: File | null = null;

  constructor(
    private readonly farmer: FarmerService,
    private readonly toast: ToastService
  ) {
    this.refresh();
  }

  statusText(): string {
    return pickString(this.status(), 'status', 'verificationStatus', 'farmerStatus') || 'NOT_SUBMITTED';
  }

  remarks(): string {
    return pickString(this.status(), 'remarks', 'rejectionRemarks', 'adminRemarks', 'message');
  }

  fileChanged(kind: 'front' | 'back' | 'farm', event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    if (kind === 'front') this.frontImage = file;
    if (kind === 'back') this.backImage = file;
    if (kind === 'farm') this.farmPhoto = file;
  }

  uploadId(): void {
    if (!this.frontImage || !this.backImage || this.idUploading()) {
      this.toast.info('Choose both front and back government ID images.');
      return;
    }
    this.idUploading.set(true);
    this.farmer.uploadGovernmentId(this.frontImage, this.backImage).subscribe({
      next: response => {
        this.idUploading.set(false);
        response.success
          ? this.toast.success(response.message || 'Government ID uploaded.')
          : this.toast.error(response.message || 'Government ID upload failed.');
        if (response.success) this.refresh();
      },
      error: error => {
        this.idUploading.set(false);
        this.toast.error(errorMessage(error));
      }
    });
  }

  uploadFarm(): void {
    if (!this.farmPhoto || this.farmUploading()) {
      this.toast.info('Choose a farm photo first.');
      return;
    }
    this.farmUploading.set(true);
    this.farmer.uploadFarmPhoto(this.farmPhoto).subscribe({
      next: response => {
        this.farmUploading.set(false);
        response.success
          ? this.toast.success(response.message || 'Farm photo uploaded.')
          : this.toast.error(response.message || 'Farm photo upload failed.');
        if (response.success) this.refresh();
      },
      error: error => {
        this.farmUploading.set(false);
        this.toast.error(errorMessage(error));
      }
    });
  }

  refresh(): void {
    this.loading.set(true);
    this.farmer.verificationStatus().subscribe({
      next: response => {
        this.status.set(recordFromResponse<JsonRecord>(response, ['verification', 'status']));
        this.loading.set(false);
      },
      error: () => {
        this.status.set({});
        this.loading.set(false);
      }
    });
  }
}
