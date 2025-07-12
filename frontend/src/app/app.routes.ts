import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'leads',
    loadComponent: () =>
      import('./features/leads/leads.component').then((m) => m.LeadsComponent),
  },
  {
    path: 'leads/new',
    loadComponent: () =>
      import('./features/leads/lead-form/lead-form.component').then(
        (m) => m.LeadFormComponent
      ),
  },
  {
    path: 'leads/edit/:id',
    loadComponent: () =>
      import('./features/leads/lead-form/lead-form.component').then(
        (m) => m.LeadFormComponent
      ),
  },
  {
    path: 'clients',
    loadComponent: () =>
      import('./features/clients/clients.component').then(
        (m) => m.ClientsComponent
      ),
  },
  {
    path: 'clients/new',
    loadComponent: () =>
      import('./features/clients/client-form/client-form.component').then(
        (m) => m.ClientFormComponent
      ),
  },
  {
    path: 'clients/edit/:id',
    loadComponent: () =>
      import('./features/clients/client-form/client-form.component').then(
        (m) => m.ClientFormComponent
      ),
  },
];
