import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/app.constants';
import { AddCategoryRequest, ApiResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private readonly http: HttpClient) {}

  all(): Observable<ApiResponse<unknown>> {
    return this.http.get<ApiResponse<unknown>>(`${API_BASE}/categories`);
  }

  add(payload: AddCategoryRequest): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${API_BASE}/categories`, payload);
  }
}
