// export type UserRole = 'CUSTOMER' | 'FARMER' | 'ADMIN';

// export interface ApiResponse<T = unknown> {
//   success: boolean;
//   message: string;
//   data: T;
// }

// export interface LoginRequest {
//   phoneNumber: string;
//   password: string;
// }

// export interface LoginData {
//   phoneNumber: string;
//   role: UserRole;
//   token: string;
// }

// export interface RegisterRequest {
//   fullName: string;
//   phoneNumber: string;
//   password: string;
//   confirmPassword: string;
// }

// export interface SendOtpRequest {
//   phoneNumber: string;
// }

// export interface VerifyOtpRequest {
//   phoneNumber: string;
//   otp: string;
// }

// export interface AddProductRequest {
//   categoryId: number;
//   productName: string;
//   description?: string;
//   price: number;
//   unit: string;
//   availableQuantity: number;
//   minimumOrderQuantity: number;
// }

// export interface UpdateProductRequest {
//   description?: string;
//   price?: number;
//   availableQuantity?: number;
//   minimumOrderQuantity?: number;
//   isAvailable?: boolean;
// }

// export interface PlaceOrderRequest {
//   productId: number;
//   quantity: number;
// }

// export interface FarmerRegistrationRequest {
//   farmerName: string;
//   farmName: string;
//   farmAddress: string;
//   village: string;
//   mandal: string;
//   district: string;
//   state: string;
//   pincode?: string;
//   farmArea: number;
//   governmentIdType: 'AADHAAR' | 'VOTER_ID' | 'DRIVING_LICENSE' | 'PAN';
//   governmentIdNumber: string;
// }

// export type UpdateFarmerProfileRequest = FarmerRegistrationRequest;

// export interface AddCategoryRequest {
//   name: string;
//   description?: string;
// }

// export interface RejectFarmerRequest {
//   remarks?: string;
// }

// export interface Session {
//   phoneNumber: string;
//   role: UserRole;
//   token: string;
// }

// export interface CartItem {
//   productId: number;
//   productName: string;
//   price: number;
//   unit: string;
//   quantity: number;
//   minimumOrderQuantity: number;
//   image?: string;
// }

// export type JsonRecord = Record<string, unknown>;
// export type ProductView = JsonRecord;
// export type CategoryView = JsonRecord;
// export type OrderView = JsonRecord;
// export type FarmerView = JsonRecord;



export type UserRole = 'CUSTOMER' | 'FARMER' | 'ADMIN';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface LoginData {
  phoneNumber: string;
  role: UserRole;
  token: string;
}

export interface RegisterRequest {
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface SendOtpRequest {
  phoneNumber: string;
}

export interface VerifyOtpRequest {
  phoneNumber: string;
  otp: string;
}

export interface AddProductRequest {
  categoryId: number;
  productName: string;
  description?: string;
  price: number;
  unit: string;
  availableQuantity: number;
  minimumOrderQuantity: number;
}

export interface UpdateProductRequest {
  description?: string;
  price?: number;
  availableQuantity?: number;
  minimumOrderQuantity?: number;
  isAvailable?: boolean;
}

export interface PlaceOrderRequest {
  productId: number;
  quantity: number;
}

export interface CustomerAddressRequest {
  addressLine1: string;
  addressLine2?: string;
  village: string;
  mandal: string;
  district: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface CustomerAddressResponse {
  addressId: number;
  addressLine1: string;
  addressLine2?: string;
  village: string;
  mandal: string;
  district: string;
  state: string;
  pincode: string;
  landmark?: string;
}




export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface UpdateOrderStatusRequest {
  status: 'ACCEPTED' | 'REJECTED';
  rejectionReason?: string;
}

export interface FarmerRegistrationRequest {
  farmerName: string;
  farmName: string;
  farmAddress: string;
  village: string;
  mandal: string;
  district: string;
  state: string;
  pincode?: string;
  farmArea: number;
  governmentIdType: 'AADHAAR' | 'VOTER_ID' | 'DRIVING_LICENSE' | 'PAN';
  governmentIdNumber: string;
}

export type UpdateFarmerProfileRequest = FarmerRegistrationRequest;

export interface AddCategoryRequest {
  name: string;
  description?: string;
}

export interface RejectFarmerRequest {
  remarks?: string;
}

export interface Session {
  phoneNumber: string;
  role: UserRole;
  token: string;
}

export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  unit: string;
  quantity: number;
  minimumOrderQuantity: number;
  image?: string;
}

export type JsonRecord = Record<string, unknown>;
export type ProductView = JsonRecord;
export type CategoryView = JsonRecord;
export type OrderView = JsonRecord;
export type FarmerView = JsonRecord;
