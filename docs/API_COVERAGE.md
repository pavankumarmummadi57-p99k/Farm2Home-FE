# API Coverage

| Method | Endpoint | Operation | Frontend use |
|---|---|---|---|
| GET | `/api/products/{productId}` | `getProductDetails` | Product details; edit-product preload |
| PUT | `/api/products/{productId}` | `updateProduct` | Farmer edit product |
| DELETE | `/api/products/{productId}` | `deleteProduct` | Farmer delete product |
| PUT | `/api/farmer/update-profile` | `updateMyProfile` | Farmer profile edit |
| PUT | `/api/admin/farmer/reject/{farmerId}` | `rejectFarmer` | Admin farmer rejection |
| PUT | `/api/admin/farmer/approve/{farmerId}` | `approveFarmer` | Admin farmer approval |
| GET | `/api/products` | `browseProducts` | Marketplace product grid |
| POST | `/api/products` | `addProduct` | Farmer add product |
| POST | `/api/products/{productId}/images` | `uploadProductImages` | Farmer product image upload |
| POST | `/api/orders` | `placeOrder` | Buy now and cart checkout |
| POST | `/api/farmer/verification/upload-government-id` | `uploadGovernmentId` | Farmer government ID upload |
| POST | `/api/farmer/verification/upload-farm-photo` | `uploadFarmPhoto` | Farmer farm photo upload |
| POST | `/api/farmer/register` | `registerFarmer` | Farmer registration |
| GET | `/api/categories` | `getAllCategories` | Marketplace filters + product form + admin categories |
| POST | `/api/categories` | `addCategory` | Admin add category |
| POST | `/api/auth/verify-otp` | `verifyOtp` | OTP verification |
| POST | `/api/auth/send-otp` | `sendOtp` | Send OTP |
| POST | `/api/auth/resend-otp` | `resendOtp` | Resend OTP |
| POST | `/api/auth/register` | `register` | Customer registration |
| POST | `/api/auth/login` | `login` | JWT login and role routing |
| GET | `/api/test` | `test` | Not surfaced (development/test endpoint) |
| GET | `/api/products/search` | `searchProducts` | Marketplace keyword search |
| GET | `/api/products/my-products` | `getMyProducts` | Farmer product management/dashboard |
| GET | `/api/products/category/{categoryId}` | `browseProductsByCategory` | Marketplace category filter |
| GET | `/api/orders/my-orders` | `getMyOrders` | Customer order history |
| GET | `/api/orders/farmer-orders` | `getFarmerOrders` | Farmer orders/dashboard |
| GET | `/api/farmer/verification/status` | `getVerificationStatus` | Farmer verification page/dashboard |
| GET | `/api/farmer/my-profile` | `getMyProfile` | Farmer profile/dashboard |
| GET | `/api/admin/farmers/pending` | `getPendingFarmers` | Admin dashboard/review queue |
| GET | `/api/admin/farmer/{farmerId}` | `getFarmerDetails` | Admin farmer detail |
