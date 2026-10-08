import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'verify-otp',
    loadComponent: () => import('./pages/auth/otp.component').then(m => m.OtpComponent)
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./pages/products/product-details.component').then(m => m.ProductDetailsComponent)
  },
  {
    path: 'cart',
    canActivate: [authGuard, roleGuard(['CUSTOMER'])],
    loadComponent: () => import('./pages/customer/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'my-orders',
    canActivate: [authGuard, roleGuard(['CUSTOMER'])],
    loadComponent: () => import('./pages/customer/my-orders.component').then(m => m.MyOrdersComponent)
  },
  {
  path: 'profile',
  canActivate: [authGuard, roleGuard(['CUSTOMER'])],
  loadComponent: () =>
    import('./pages/customer/customer-profile.component')
      .then(m => m.CustomerProfileComponent)
},
  {
    path: 'farmer/register',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/farmer/farmer-register.component').then(m => m.FarmerRegisterComponent)
  },
  {
    path: 'farmer/dashboard',
    canActivate: [authGuard, roleGuard(['FARMER'])],
    loadComponent: () => import('./pages/farmer/farmer-dashboard.component').then(m => m.FarmerDashboardComponent)
  },
  {
    path: 'farmer/products',
    canActivate: [authGuard, roleGuard(['FARMER'])],
    loadComponent: () => import('./pages/farmer/farmer-products.component').then(m => m.FarmerProductsComponent)
  },
  {
    path: 'farmer/products/new',
    canActivate: [authGuard, roleGuard(['FARMER'])],
    loadComponent: () => import('./pages/farmer/product-form.component').then(m => m.ProductFormComponent)
  },
  {
    path: 'farmer/products/:id/edit',
    canActivate: [authGuard, roleGuard(['FARMER'])],
    loadComponent: () => import('./pages/farmer/product-form.component').then(m => m.ProductFormComponent)
  },
  {
    path: 'farmer/orders',
    canActivate: [authGuard, roleGuard(['FARMER'])],
    loadComponent: () => import('./pages/farmer/farmer-orders.component').then(m => m.FarmerOrdersComponent)
  },
  {
    path: 'farmer/verification',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/farmer/farmer-verification.component').then(m => m.FarmerVerificationComponent)
  },
  {
    path: 'farmer/profile',
    canActivate: [authGuard, roleGuard(['FARMER'])],
    loadComponent: () => import('./pages/farmer/farmer-profile.component').then(m => m.FarmerProfileComponent)
  },
  {
    path: 'admin/dashboard',
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    loadComponent: () => import('./pages/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'admin/farmers',
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    loadComponent: () => import('./pages/admin/admin-farmers.component').then(m => m.AdminFarmersComponent)
  },
  {
    path: 'admin/farmers/:id',
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    loadComponent: () => import('./pages/admin/admin-farmer-detail.component').then(m => m.AdminFarmerDetailComponent)
  },
  {
    path: 'admin/categories',
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    loadComponent: () => import('./pages/admin/admin-categories.component').then(m => m.AdminCategoriesComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found.component').then(m => m.NotFoundComponent)
  }
];
