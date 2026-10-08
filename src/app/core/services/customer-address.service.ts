import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE } from '../config/app.constants';
import {
  ApiResponse,
  CustomerAddressRequest,
  CustomerAddressResponse
} from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class CustomerAddressService {

  constructor(
    private readonly http: HttpClient
  ) {}

  getMyAddress():
    Observable<ApiResponse<CustomerAddressResponse | null>> {

    return this.http.get<
      ApiResponse<CustomerAddressResponse | null>
    >(`${API_BASE}/customer/address`);
  }

  saveAddress(
    payload: CustomerAddressRequest
  ): Observable<ApiResponse<CustomerAddressResponse>> {

    return this.http.post<
      ApiResponse<CustomerAddressResponse>
    >(
      `${API_BASE}/customer/address`,
      payload
    );
  }

  updateAddress(
    payload: CustomerAddressRequest
  ): Observable<ApiResponse<CustomerAddressResponse>> {

    return this.http.put<
      ApiResponse<CustomerAddressResponse>
    >(
      `${API_BASE}/customer/address`,
      payload
    );
  }
}