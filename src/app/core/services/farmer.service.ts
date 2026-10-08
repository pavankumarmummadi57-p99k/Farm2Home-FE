import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/app.constants';
import {
  ApiResponse,
  FarmerRegistrationRequest,
  UpdateFarmerProfileRequest
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class FarmerService {
  constructor(private readonly http: HttpClient) {}

  register(payload: FarmerRegistrationRequest): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${API_BASE}/farmer/register`, payload);
  }

  profile(): Observable<ApiResponse<unknown>> {
    return this.http.get<ApiResponse<unknown>>(`${API_BASE}/farmer/my-profile`);
  }

  updateProfile(payload: UpdateFarmerProfileRequest): Observable<ApiResponse<unknown>> {
    return this.http.put<ApiResponse<unknown>>(`${API_BASE}/farmer/update-profile`, payload);
  }

  verificationStatus(): Observable<ApiResponse<unknown>> {
    return this.http.get<ApiResponse<unknown>>(`${API_BASE}/farmer/verification/status`);
  }

  uploadGovernmentId(frontImage: File, backImage: File): Observable<ApiResponse<unknown>> {
    const formData = new FormData();
    formData.append('frontImage', frontImage);
    formData.append('backImage', backImage);
    return this.http.post<ApiResponse<unknown>>(
      `${API_BASE}/farmer/verification/upload-government-id`,
      formData
    );
  }

  uploadFarmPhoto(file: File): Observable<ApiResponse<unknown>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<unknown>>(
      `${API_BASE}/farmer/verification/upload-farm-photo`,
      formData
    );
  }
}
