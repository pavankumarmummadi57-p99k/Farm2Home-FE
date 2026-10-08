// 

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/app.constants';
import { ApiResponse, PlaceOrderRequest, UpdateOrderStatusRequest } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private readonly http: HttpClient) {}

  place(payload: PlaceOrderRequest): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${API_BASE}/orders`, payload);
  }

  myOrders(): Observable<ApiResponse<unknown>> {
    return this.http.get<ApiResponse<unknown>>(`${API_BASE}/orders/my-orders`);
  }

  farmerOrders(): Observable<ApiResponse<unknown>> {
    return this.http.get<ApiResponse<unknown>>(`${API_BASE}/orders/farmer-orders`);
  }

  updateStatus(orderId: number, payload: UpdateOrderStatusRequest): Observable<ApiResponse<unknown>> {
    return this.http.put<ApiResponse<unknown>>(`${API_BASE}/orders/${orderId}/status`, payload);
  }
}
