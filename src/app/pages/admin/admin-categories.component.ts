// import { Component, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { CategoryService } from '../../core/services/category.service';
// import { ToastService } from '../../core/services/toast.service';
// import { JsonRecord } from '../../core/models/api.models';
// import { entityId, errorMessage, listFromResponse, pickString } from '../../core/utils/api.util';

// @Component({
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './admin-categories.component.html'
// })
// export class AdminCategoriesComponent {
//   readonly categories = signal<JsonRecord[]>([]);
//   readonly loading = signal(true);
//   readonly saving = signal(false);
//   readonly form;

//   constructor(
//     fb: FormBuilder,
//     private readonly api: CategoryService,
//     private readonly toast: ToastService
//   ) {
//     this.form = fb.nonNullable.group({
//       name: ['', [Validators.required, Validators.maxLength(100)]],
//       description: ['', Validators.maxLength(255)]
//     });
//     this.load();
//   }

//   id(category: JsonRecord): number { return entityId(category); }
//   name(category: JsonRecord): string { return pickString(category, 'name', 'categoryName') || 'Category'; }
//   description(category: JsonRecord): string { return pickString(category, 'description') || '—'; }

//   add(): void {
//     if (this.form.invalid || this.saving()) {
//       this.form.markAllAsTouched();
//       return;
//     }
//     this.saving.set(true);
//     this.api.add(this.form.getRawValue()).subscribe({
//       next: response => {
//         this.saving.set(false);
//         if (!response.success) {
//           this.toast.error(response.message || 'Category creation failed.');
//           return;
//         }
//         this.toast.success(response.message || 'Category created.');
//         this.form.reset({ name: '', description: '' });
//         this.load();
//       },
//       error: error => {
//         this.saving.set(false);
//         this.toast.error(errorMessage(error));
//       }
//     });
//   }

//   private load(): void {
//     this.loading.set(true);
//     this.api.all().subscribe({
//       next: response => {
//         this.categories.set(listFromResponse<JsonRecord>(response, ['categories']));
//         this.loading.set(false);
//       },
//       error: error => {
//         this.loading.set(false);
//         this.toast.error(errorMessage(error));
//       }
//     });
//   }
// }

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryService } from '../../core/services/category.service';
import { ToastService } from '../../core/services/toast.service';
import { JsonRecord } from '../../core/models/api.models';
import {
  entityId,
  errorMessage,
  listFromResponse,
  pickString
} from '../../core/utils/api.util';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-categories.component.html'
})
export class AdminCategoriesComponent {

  readonly categories = signal<JsonRecord[]>([]);
  readonly loading = signal(true);

  constructor(
    private readonly api: CategoryService,
    private readonly toast: ToastService
  ) {
    this.load();
  }

  id(category: JsonRecord): number {
    return entityId(category);
  }

  name(category: JsonRecord): string {
    return pickString(category, 'name', 'categoryName') || 'Category';
  }

  description(category: JsonRecord): string {
    return pickString(category, 'description') || '—';
  }

  private load(): void {
    this.loading.set(true);

    this.api.all().subscribe({
      next: response => {
        this.categories.set(
          listFromResponse<JsonRecord>(response, ['categories'])
        );
        this.loading.set(false);
      },
      error: error => {
        this.loading.set(false);
        this.toast.error(errorMessage(error));
      }
    });
  }
}
