import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { ToastService } from '../../core/services/toast.service';
import { JsonRecord } from '../../core/models/api.models';
import { entityId, errorMessage, listFromResponse, pickString, statusClass } from '../../core/utils/api.util';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-farmers.component.html'
})
export class AdminFarmersComponent {
  readonly farmers = signal<JsonRecord[]>([]);
  readonly loading = signal(true);
  readonly statusClass = statusClass;

  constructor(
    private readonly admin: AdminService,
    private readonly toast: ToastService
  ) {
    this.load();
  }

  farmerId(f: JsonRecord): number { return entityId(f); }
  farmerName(f: JsonRecord): string { return pickString(f, 'farmerName', 'name', 'fullName') || 'Farmer'; }
  farmName(f: JsonRecord): string { return pickString(f, 'farmName') || '—'; }
  location(f: JsonRecord): string {
    return [pickString(f, 'village'), pickString(f, 'district'), pickString(f, 'state')].filter(Boolean).join(', ') || '—';
  }
  status(f: JsonRecord): string { return pickString(f, 'status', 'verificationStatus', 'farmerStatus') || 'PENDING'; }

  load(): void {
    this.loading.set(true);
    this.admin.pendingFarmers().subscribe({
      next: response => {
        this.farmers.set(listFromResponse<JsonRecord>(response, ['farmers']));
        this.loading.set(false);
      },
      error: error => {
        this.loading.set(false);
        this.toast.error(errorMessage(error));
      }
    });
  }
}
