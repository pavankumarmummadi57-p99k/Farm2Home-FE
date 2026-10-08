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
  templateUrl: './otp.component.html'
})
export class OtpComponent {
  readonly loading = signal(false);
  readonly sending = signal(false);
  readonly form;

  constructor(
    fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly toast: ToastService,
    private readonly router: Router,
    route: ActivatedRoute
  ) {
    this.form = fb.nonNullable.group({
      phoneNumber: [
        route.snapshot.queryParamMap.get('phoneNumber') ?? '',
        [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]
      ],
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  send(resend = false): void {
    const phoneNumber = this.form.controls.phoneNumber.value;
    if (!/^[6-9]\d{9}$/.test(phoneNumber) || this.sending()) {
      this.form.controls.phoneNumber.markAsTouched();
      return;
    }

    this.sending.set(true);
    const request$ = resend
      ? this.auth.resendOtp({ phoneNumber })
      : this.auth.sendOtp({ phoneNumber });

    request$.subscribe({
      next: response => {
        this.sending.set(false);
        response.success
          ? this.toast.success(response.message || (resend ? 'OTP resent.' : 'OTP sent.'))
          : this.toast.error(response.message || 'Unable to send OTP.');
      },
      error: error => {
        this.sending.set(false);
        this.toast.error(errorMessage(error));
      }
    });
  }

  verify(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.auth.verifyOtp(this.form.getRawValue()).subscribe({
      next: response => {
        this.loading.set(false);
        if (!response.success) {
          this.toast.error(response.message || 'OTP verification failed.');
          return;
        }
        this.toast.success(response.message || 'Phone number verified.');
        void this.router.navigate(['/login']);
      },
      error: error => {
        this.loading.set(false);
        this.toast.error(errorMessage(error));
      }
    });
  }
}
