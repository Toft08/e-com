import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProductListComponent } from './components/products/product-list.component';
import { UserProfileComponent } from './components/profile/user-profile.component';
import { SellerDashboardComponent } from './components/seller/seller-dashboard.component';
import { authGuard } from './guards/auth.guard';
import { sellerGuard } from './guards/role.guard';

export const routes: Routes = [
  // Public routes
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductListComponent },

  // Protected routes - require authentication
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [authGuard],
  },

  // Seller-only routes - require authentication + seller role
  {
    path: 'seller/dashboard',
    component: SellerDashboardComponent,
    canActivate: [sellerGuard],
  },

  // Wildcard - redirect to home
  { path: '**', redirectTo: '' },
];
