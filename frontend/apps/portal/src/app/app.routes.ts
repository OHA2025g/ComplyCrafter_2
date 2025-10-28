import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'forms',
    loadChildren: () => import('./forms/forms.routes').then((m) => m.FORMS_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
