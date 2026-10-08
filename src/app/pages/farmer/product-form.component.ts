// import { Component, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// import { switchMap, of } from 'rxjs';
// import { ProductService } from '../../core/services/product.service';
// import { CategoryService } from '../../core/services/category.service';
// import { ToastService } from '../../core/services/toast.service';
// import { JsonRecord } from '../../core/models/api.models';
// import { apiData, entityId, errorMessage, listFromResponse, pickBoolean, pickNumber, pickString, recordFromResponse } from '../../core/utils/api.util';

// @Component({
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, RouterLink],
//   templateUrl: './product-form.component.html'
// })
// export class ProductFormComponent {
//   readonly productId: number | null;
//   readonly editing: boolean;
//   readonly loading = signal(false);
//   readonly pageLoading = signal(false);
//   readonly categories = signal<JsonRecord[]>([]);
//   selectedImages: File[] = [];

//   readonly form;

//   constructor(
//     fb: FormBuilder,
//     route: ActivatedRoute,
//     private readonly products: ProductService,
//     private readonly categoriesApi: CategoryService,
//     private readonly toast: ToastService,
//     private readonly router: Router
//   ) {
//     const routeId = Number(route.snapshot.paramMap.get('id'));
//     this.productId = routeId || null;
//     this.editing = !!this.productId;

//     this.form = fb.nonNullable.group({
//       categoryId: [0, this.editing ? [] : [Validators.required, Validators.min(1)]],
//       productName: ['', this.editing ? [] : Validators.required],
//       description: [''],
//       price: [0, [Validators.required, Validators.min(0.01)]],
//       unit: ['', this.editing ? [] : Validators.required],
//       availableQuantity: [0, [Validators.required, Validators.min(0.01)]],
//       minimumOrderQuantity: [1, [Validators.required, Validators.min(0.01)]],
//       isAvailable: [true]
//     });

//     this.categoriesApi.all().subscribe({
//       next: response => this.categories.set(listFromResponse<JsonRecord>(response, ['categories'])),
//       error: () => this.categories.set([])
//     });

//     if (this.productId) this.loadProduct(this.productId);
//   }

//   categoryId(category: JsonRecord): number {
//     return entityId(category);
//   }

//   categoryName(category: JsonRecord): string {
//     return pickString(category, 'name', 'categoryName') || `Category ${entityId(category)}`;
//   }

//   filesChanged(event: Event): void {
//     this.selectedImages = Array.from((event.target as HTMLInputElement).files ?? []);
//   }

//   submit(): void {
//     if (this.form.invalid || this.loading()) {
//       this.form.markAllAsTouched();
//       return;
//     }

//     this.loading.set(true);
//     const value = this.form.getRawValue();

//     if (this.editing && this.productId) {
//       const payload = {
//         description: value.description,
//         price: value.price,
//         availableQuantity: value.availableQuantity,
//         minimumOrderQuantity: value.minimumOrderQuantity,
//         isAvailable: value.isAvailable
//       };
//       this.products.update(this.productId, payload).pipe(
//         switchMap(response => {
//           if (!response.success) throw new Error(response.message || 'Product update failed.');
//           if (this.selectedImages.length) {
//             return this.products.uploadImages(this.productId!, this.selectedImages);
//           }
//           return of(response);
//         })
//       ).subscribe({
//         next: response => {
//           this.loading.set(false);
//           if (!response.success) {
//             this.toast.error(response.message || 'Product image upload failed.');
//             return;
//           }
//           this.toast.success(response.message || 'Product updated.');
//           void this.router.navigate(['/farmer/products']);
//         },
//         error: error => {
//           this.loading.set(false);
//           this.toast.error(errorMessage(error));
//         }
//       });
//       return;
//     }

//     const payload = {
//       categoryId: value.categoryId,
//       productName: value.productName,
//       description: value.description,
//       price: value.price,
//       unit: value.unit,
//       availableQuantity: value.availableQuantity,
//       minimumOrderQuantity: value.minimumOrderQuantity
//     };

//     this.products.add(payload).pipe(
//       switchMap(response => {
//         if (!response.success) throw new Error(response.message || 'Product creation failed.');
//         const data = apiData<any>(response);
//         const createdId = Number(
//           data?.productId ?? data?.id ?? data?.product?.productId ?? data?.product?.id ?? 0
//         );
//         if (createdId && this.selectedImages.length) {
//           return this.products.uploadImages(createdId, this.selectedImages);
//         }
//         if (this.selectedImages.length && !createdId) {
//           this.toast.info('Product created, but Swagger does not define the created product id response; upload images from edit after the product appears.');
//         }
//         return of(response);
//       })
//     ).subscribe({
//       next: response => {
//         this.loading.set(false);
//         if (!response.success) {
//           this.toast.error(response.message || 'Product image upload failed.');
//           return;
//         }
//         this.toast.success(response.message || 'Product saved.');
//         void this.router.navigate(['/farmer/products']);
//       },
//       error: error => {
//         this.loading.set(false);
//         this.toast.error(errorMessage(error));
//       }
//     });
//   }

//   private loadProduct(id: number): void {
//     this.pageLoading.set(true);
//     this.products.details(id).subscribe({
//       next: response => {
//         const p = recordFromResponse<JsonRecord>(response, ['product']);
//         this.form.patchValue({
//           categoryId: pickNumber(p, 'categoryId'),
//           productName: pickString(p, 'productName', 'name'),
//           description: pickString(p, 'description'),
//           price: pickNumber(p, 'price'),
//           unit: pickString(p, 'unit'),
//           availableQuantity: pickNumber(p, 'availableQuantity', 'quantityAvailable', 'stock'),
//           minimumOrderQuantity: pickNumber(p, 'minimumOrderQuantity', 'minOrderQuantity') || 1,
//           isAvailable: pickBoolean(p, 'isAvailable', 'available') ?? true
//         });
//         this.pageLoading.set(false);
//       },
//       error: error => {
//         this.pageLoading.set(false);
//         this.toast.error(errorMessage(error));
//       }
//     });
//   }
// }



import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap, of } from 'rxjs';

import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { ToastService } from '../../core/services/toast.service';
import { JsonRecord } from '../../core/models/api.models';

import {
  apiData,
  entityId,
  errorMessage,
  listFromResponse,
  pickBoolean,
  pickNumber,
  pickString,
  recordFromResponse
} from '../../core/utils/api.util';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent {

  readonly productId: number | null;
  readonly editing: boolean;

  readonly loading = signal(false);
  readonly pageLoading = signal(false);
  readonly categories = signal<JsonRecord[]>([]);

  readonly categoryModalOpen = signal(false);
  readonly savingCategory = signal(false);

  selectedImages: File[] = [];

  readonly form;
  readonly categoryForm;

  constructor(
    fb: FormBuilder,
    route: ActivatedRoute,
    private readonly products: ProductService,
    private readonly categoriesApi: CategoryService,
    private readonly toast: ToastService,
    private readonly router: Router
  ) {

    const routeId = Number(route.snapshot.paramMap.get('id'));

    this.productId = routeId || null;
    this.editing = !!this.productId;

    this.form = fb.nonNullable.group({
      categoryId: [
        0,
        this.editing
          ? []
          : [Validators.required, Validators.min(1)]
      ],
      productName: [
        '',
        this.editing ? [] : Validators.required
      ],
      description: [''],
      price: [
        0,
        [Validators.required, Validators.min(0.01)]
      ],
      unit: [
        '',
        this.editing ? [] : Validators.required
      ],
      availableQuantity: [
        0,
        [Validators.required, Validators.min(0.01)]
      ],
      minimumOrderQuantity: [
        1,
        [Validators.required, Validators.min(0.01)]
      ],
      isAvailable: [true]
    });

    this.categoryForm = fb.nonNullable.group({
      name: [
        '',
        [Validators.required, Validators.maxLength(100)]
      ],
      description: [
        '',
        Validators.maxLength(255)
      ]
    });

    this.loadCategories();

    if (this.productId) {
      this.loadProduct(this.productId);
    }
  }

  categoryId(category: JsonRecord): number {
    return entityId(category);
  }

  categoryName(category: JsonRecord): string {
    return (
      pickString(category, 'name', 'categoryName')
      || `Category ${entityId(category)}`
    );
  }

  filesChanged(event: Event): void {
    this.selectedImages =
      Array.from(
        (event.target as HTMLInputElement).files ?? []
      );
  }

  openCategoryModal(): void {
    this.categoryForm.reset({
      name: '',
      description: ''
    });

    this.categoryModalOpen.set(true);
  }

  closeCategoryModal(): void {
    if (this.savingCategory()) return;

    this.categoryModalOpen.set(false);
  }

  saveCategory(): void {
    if (
      this.categoryForm.invalid
      || this.savingCategory()
    ) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const value = this.categoryForm.getRawValue();
    const name = value.name.trim();
    const description = value.description.trim();

    if (!name) {
      this.categoryForm.controls.name.setErrors({
        required: true
      });
      return;
    }

    this.savingCategory.set(true);

    this.categoriesApi
      .add({
        name,
        description
      })
      .subscribe({
        next: response => {
          this.savingCategory.set(false);

          if (!response.success) {
            this.toast.error(
              response.message
              || 'Category creation failed.'
            );
            return;
          }

          this.toast.success(
            response.message
            || 'Category created.'
          );

          this.categoryModalOpen.set(false);

          // Reload categories and auto-select the new category.
          this.loadCategories(name);
        },
        error: error => {
          this.savingCategory.set(false);
          this.toast.error(errorMessage(error));
        }
      });
  }

  submit(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const value = this.form.getRawValue();

    if (this.editing && this.productId) {
      const payload = {
        description: value.description,
        price: value.price,
        availableQuantity: value.availableQuantity,
        minimumOrderQuantity: value.minimumOrderQuantity,
        isAvailable: value.isAvailable
      };

      this.products.update(this.productId, payload).pipe(
        switchMap(response => {
          if (!response.success) {
            throw new Error(
              response.message || 'Product update failed.'
            );
          }

          if (this.selectedImages.length) {
            return this.products.uploadImages(
              this.productId!,
              this.selectedImages
            );
          }

          return of(response);
        })
      ).subscribe({
        next: response => {
          this.loading.set(false);

          if (!response.success) {
            this.toast.error(
              response.message || 'Product image upload failed.'
            );
            return;
          }

          this.toast.success(
            response.message || 'Product updated.'
          );

          void this.router.navigate(['/farmer/products']);
        },
        error: error => {
          this.loading.set(false);
          this.toast.error(errorMessage(error));
        }
      });

      return;
    }

    const payload = {
      categoryId: value.categoryId,
      productName: value.productName,
      description: value.description,
      price: value.price,
      unit: value.unit,
      availableQuantity: value.availableQuantity,
      minimumOrderQuantity: value.minimumOrderQuantity
    };

    this.products.add(payload).pipe(
      switchMap(response => {
        if (!response.success) {
          throw new Error(
            response.message || 'Product creation failed.'
          );
        }

        const data = apiData<any>(response);

        const createdId = Number(
          data?.productId
          ?? data?.id
          ?? data?.product?.productId
          ?? data?.product?.id
          ?? 0
        );

        if (createdId && this.selectedImages.length) {
          return this.products.uploadImages(
            createdId,
            this.selectedImages
          );
        }

        if (this.selectedImages.length && !createdId) {
          this.toast.info(
            'Product created, but the created product id was not returned; upload images from Edit after the product appears.'
          );
        }

        return of(response);
      })
    ).subscribe({
      next: response => {
        this.loading.set(false);

        if (!response.success) {
          this.toast.error(
            response.message || 'Product image upload failed.'
          );
          return;
        }

        this.toast.success(
          response.message || 'Product saved.'
        );

        void this.router.navigate(['/farmer/products']);
      },
      error: error => {
        this.loading.set(false);
        this.toast.error(errorMessage(error));
      }
    });
  }

  private loadCategories(selectCategoryName?: string): void {
    this.categoriesApi.all().subscribe({
      next: response => {
        const items =
          listFromResponse<JsonRecord>(
            response,
            ['categories']
          );

        this.categories.set(items);

        if (selectCategoryName) {
          const wanted =
            selectCategoryName
              .trim()
              .toLowerCase();

          const created =
            items.find(category =>
              this.categoryName(category)
                .trim()
                .toLowerCase()
              === wanted
            );

          if (created) {
            this.form.controls.categoryId.setValue(
              this.categoryId(created)
            );

            this.form.controls.categoryId.markAsTouched();
          }
        }
      },
      error: error => {
        this.categories.set([]);
        this.toast.error(errorMessage(error));
      }
    });
  }

  private loadProduct(id: number): void {
    this.pageLoading.set(true);

    this.products.details(id).subscribe({
      next: response => {
        const p =
          recordFromResponse<JsonRecord>(
            response,
            ['product']
          );

        this.form.patchValue({
          categoryId: pickNumber(p, 'categoryId'),
          productName: pickString(p, 'productName', 'name'),
          description: pickString(p, 'description'),
          price: pickNumber(p, 'price'),
          unit: pickString(p, 'unit'),
          availableQuantity: pickNumber(
            p,
            'availableQuantity',
            'quantityAvailable',
            'stock'
          ),
          minimumOrderQuantity: pickNumber(
            p,
            'minimumOrderQuantity',
            'minOrderQuantity'
          ) || 1,
          isAvailable: pickBoolean(
            p,
            'isAvailable',
            'available'
          ) ?? true
        });

        this.pageLoading.set(false);
      },
      error: error => {
        this.pageLoading.set(false);
        this.toast.error(errorMessage(error));
      }
    });
  }
}
