import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    loadComponent: () => import('./pages/landing.component').then(m => m.LandingComponent),
    title: 'Vizitro | Home'
  },
  {
    path: 'documentation',
    loadComponent: () => import('./pages/documentation.component').then(m => m.DocumentationComponent),
    title: 'Vizitro | Documentation'
  },
  
  // Auth routes
  {
    path: 'login',
    loadComponent: () => import('./pages/login.component').then(m => m.LoginComponent),
    title: 'Vizitro | Login'
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register.component').then(m => m.RegisterComponent),
    title: 'Vizitro | Register'
  },
//    {
//     path: 'paypal',
//     loadComponent: () => import('./paypal.component').then(m => m.PaymentComponent),
//     title: 'Vizitro | Register'
//   },
  
  // Dashboard routes (protected)
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Vizitro | dashboard',
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () => import('./pages/dashboard/overview.component').then(m => m.OverviewComponent)
      },
      {
        path: 'api-keys',
        loadComponent: () => import('./pages/dashboard/api-keys.component').then(m => m.ApiKeysComponent)
      },
      {
        path: 'visitors',
        loadComponent: () => import('./pages/dashboard/visitors.component').then(m => m.VisitorsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/dashboard/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },
  
  // Fallback
  { path: '**', redirectTo: '' }
];