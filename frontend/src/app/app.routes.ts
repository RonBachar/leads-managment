import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { authGuard } from './core/services/auth.guard';
import { loginRedirectGuard } from './core/services/login-redirect.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
    canActivate: [loginRedirectGuard],
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/signup/signup.component').then(
        (m) => m.SignupComponent
      ),
  },
  {
    path: 'clients',
    loadComponent: () =>
      import('./features/clients/clients.component').then(
        (m) => m.ClientsComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'clients/new',
    loadComponent: () =>
      import('./features/clients/client-form/client-form.component').then(
        (m) => m.ClientFormComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'clients/edit/:id',
    loadComponent: () =>
      import('./features/clients/client-form/client-form.component').then(
        (m) => m.ClientFormComponent
      ),
    canActivate: [authGuard],
  },
];
