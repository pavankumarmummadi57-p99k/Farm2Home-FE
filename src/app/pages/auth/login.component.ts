import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { errorMessage } from '../../core/utils/api.util';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  readonly loading = signal(false);
  readonly form;

  constructor(
    fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly toast: ToastService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.form = fb.nonNullable.group({
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.auth.login(this.form.getRawValue()).subscribe({
      next: response => {
        this.loading.set(false);
        if (!response.success) {
          this.toast.error(response.message || 'Login failed.');
          return;
        }
        this.toast.success(response.message || 'Login successful.');
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        const target = returnUrl || this.auth.redirectForRole();
        void this.router.navigateByUrl(target);
      },
      error: error => {
        this.loading.set(false);
        this.toast.error(errorMessage(error));
      }
    });
  }
}
