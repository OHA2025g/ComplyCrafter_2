import { Routes } from '@angular/router';

export const FORMS_ROUTES: Routes = [
  {
    path: 'adt1',
    loadComponent: () => import('./adt1/adt1.component').then((m) => m.Adt1Component)
  },
  {
    path: 'ben2',
    loadComponent: () => import('./ben2/ben2.component').then((m) => m.Ben2Component)
  },
  {
    path: 'pas3',
    loadComponent: () => import('./pas3/pas3.component').then((m) => m.Pas3Component)
  },
  {
    path: 'dpt3',
    loadComponent: () => import('./dpt3/dpt3.component').then((m) => m.Dpt3Component)
  }
];
