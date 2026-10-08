import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/app.constants';
import { ApiResponse, RejectFarmerRequest } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private readonly http: HttpClient) {}

  pendingFarmers(): Observable<ApiResponse<unknown>> {
    return this.http.get<ApiResponse<unknown>>(`${API_BASE}/admin/farmers/pending`);
  }

  farmerDetails(farmerId: number): Observable<ApiResponse<unknown>> {
    return this.http.get<ApiResponse<unknown>>(`${API_BASE}/admin/farmer/${farmerId}`);
  }

  approveFarmer(farmerId: number): Observable<ApiResponse<unknown>> {
    return this.http.put<ApiResponse<unknown>>(`${API_BASE}/admin/farmer/approve/${farmerId}`, {});
  }

  rejectFarmer(farmerId: number, payload: RejectFarmerRequest): Observable<ApiResponse<unknown>> {
    return this.http.put<ApiResponse<unknown>>(`${API_BASE}/admin/farmer/reject/${farmerId}`, payload);
  }
}
