import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { JsonRecord } from '../../core/models/api.models';
import { listFromResponse } from '../../core/utils/api.util';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent {
  readonly loading = signal(true);
  readonly pendingCount = signal(0);

  constructor(admin: AdminService) {
    admin.pendingFarmers().subscribe({
      next: response => {
        this.pendingCount.set(listFromResponse<JsonRecord>(response, ['farmers']).length);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
