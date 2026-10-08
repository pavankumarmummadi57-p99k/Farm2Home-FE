// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { API_BASE } from '../config/app.constants';
// import { AddProductRequest, ApiResponse, UpdateProductRequest } from '../models/api.models';

// @Injectable({ providedIn: 'root' })
// export class ProductService {
//   constructor(private readonly http: HttpClient) {}

//   browse(): Observable<ApiResponse<unknown>> {
//     return this.http.get<ApiResponse<unknown>>(`${API_BASE}/products`);
//   }

//   details(productId: number): Observable<ApiResponse<unknown>> {
//     return this.http.get<ApiResponse<unknown>>(`${API_BASE}/products/${productId}`);
//   }

//   search(keyword: string): Observable<ApiResponse<unknown>> {
//     const params = new HttpParams().set('keyword', keyword);
//     return this.http.get<ApiResponse<unknown>>(`${API_BASE}/products/search`, { params });
//   }

//   byCategory(categoryId: number): Observable<ApiResponse<unknown>> {
//     return this.http.get<ApiResponse<unknown>>(`${API_BASE}/products/category/${categoryId}`);
//   }

//   myProducts(): Observable<ApiResponse<unknown>> {
//     return this.http.get<ApiResponse<unknown>>(`${API_BASE}/products/my-products`);
//   }

//   add(payload: AddProductRequest): Observable<ApiResponse<unknown>> {
//     return this.http.post<ApiResponse<unknown>>(`${API_BASE}/products`, payload);
//   }

//   update(productId: number, payload: UpdateProductRequest): Observable<ApiResponse<unknown>> {
//     return this.http.put<ApiResponse<unknown>>(`${API_BASE}/products/${productId}`, payload);
//   }

//   delete(productId: number): Observable<ApiResponse<unknown>> {
//     return this.http.delete<ApiResponse<unknown>>(`${API_BASE}/products/${productId}`);
//   }

//   uploadImages(productId: number, images: File[]): Observable<ApiResponse<unknown>> {
//     const formData = new FormData();
//     images.forEach(image => formData.append('images', image));
//     return this.http.post<ApiResponse<unknown>>(`${API_BASE}/products/${productId}/images`, formData);
//   }
// }



import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/app.constants';
import { AddProductRequest, ApiResponse, UpdateProductRequest } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private readonly http: HttpClient) {}

  browse(): Observable<ApiResponse<unknown>> {
    return this.http.get<ApiResponse<unknown>>(`${API_BASE}/products`);
  }

  details(productId: number): Observable<ApiResponse<unknown>> {
    return this.http.get<ApiResponse<unknown>>(`${API_BASE}/products/${productId}`);
  }

  farmerContact(productId: number): Observable<ApiResponse<unknown>> {
    return this.http.get<ApiResponse<unknown>>(
      `${API_BASE}/products/${productId}/farmer-contact`
    );
  }

  search(keyword: string): Observable<ApiResponse<unknown>> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<ApiResponse<unknown>>(`${API_BASE}/products/search`, { params });
  }

  byCategory(categoryId: number): Observable<ApiResponse<unknown>> {
    return this.http.get<ApiResponse<unknown>>(`${API_BASE}/products/category/${categoryId}`);
  }

  myProducts(): Observable<ApiResponse<unknown>> {
    return this.http.get<ApiResponse<unknown>>(`${API_BASE}/products/my-products`);
  }

  add(payload: AddProductRequest): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${API_BASE}/products`, payload);
  }

  update(productId: number, payload: UpdateProductRequest): Observable<ApiResponse<unknown>> {
    return this.http.put<ApiResponse<unknown>>(`${API_BASE}/products/${productId}`, payload);
  }

  delete(productId: number): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(`${API_BASE}/products/${productId}`);
  }

  uploadImages(productId: number, images: File[]): Observable<ApiResponse<unknown>> {
    const formData = new FormData();
    images.forEach(image => formData.append('images', image));
    return this.http.post<ApiResponse<unknown>>(`${API_BASE}/products/${productId}/images`, formData);
  }
}
