import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_BASE, SESSION_KEY } from '../config/app.constants';
import {
  ApiResponse,
  LoginData,
  LoginRequest,
  RegisterRequest,
  SendOtpRequest,
  Session,
  UserRole,
  VerifyOtpRequest
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly sessionState = signal<Session | null>(this.restoreSession());

  readonly session = this.sessionState.asReadonly();
  readonly isAuthenticated = computed(() => !!this.sessionState() && !this.tokenExpired());
  readonly role = computed<UserRole | null>(() => this.sessionState()?.role ?? null);

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  login(payload: LoginRequest): Observable<ApiResponse<LoginData>> {
    return this.http.post<ApiResponse<LoginData>>(`${API_BASE}/auth/login`, payload).pipe(
      tap(response => {
        if (response.success && response.data?.token) {
          const session: Session = {
            phoneNumber: response.data.phoneNumber,
            role: response.data.role,
            token: response.data.token
          };
          this.sessionState.set(session);
          localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        }
      })
    );
  }

  register(payload: RegisterRequest): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${API_BASE}/auth/register`, payload);
  }

  sendOtp(payload: SendOtpRequest): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${API_BASE}/auth/send-otp`, payload);
  }

  resendOtp(payload: SendOtpRequest): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${API_BASE}/auth/resend-otp`, payload);
  }

  verifyOtp(payload: VerifyOtpRequest): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${API_BASE}/auth/verify-otp`, payload);
  }

  token(): string | null {
    const session = this.sessionState();
    if (!session || this.tokenExpired(session.token)) return null;
    return session.token;
  }

  hasRole(...roles: UserRole[]): boolean {
    const role = this.role();
    return !!role && roles.includes(role);
  }

  logout(redirect = true): void {
    localStorage.removeItem(SESSION_KEY);
    this.sessionState.set(null);
    if (redirect) void this.router.navigate(['/login']);
  }

  redirectForRole(): string {
    switch (this.role()) {
      case 'FARMER': return '/farmer/dashboard';
      case 'ADMIN': return '/admin/dashboard';
      default: return '/';
    }
  }

  tokenExpired(token = this.sessionState()?.token): boolean {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1] ?? '')) as { exp?: number };
      return !payload.exp || payload.exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }

  private restoreSession(): Session | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw) as Session;
      if (!session?.token || !session?.role || !session?.phoneNumber) return null;
      return session;
    } catch {
      return null;
    }
  }
}
