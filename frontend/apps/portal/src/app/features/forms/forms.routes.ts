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
  },
  {
    path: 'aoc4',
    loadComponent: () =>
      import('./generic-form/phase3-form.component').then((m) => m.Phase3FormComponent),
    data: { formKey: 'aoc4' }
  },
  {
    path: 'aoc4cfs',
    loadComponent: () =>
      import('./generic-form/phase3-form.component').then((m) => m.Phase3FormComponent),
    data: { formKey: 'aoc4cfs' }
  },
  {
    path: 'mgt7a',
    loadComponent: () =>
      import('./generic-form/phase3-form.component').then((m) => m.Phase3FormComponent),
    data: { formKey: 'mgt7a' }
  },
  {
    path: 'msme',
    loadComponent: () =>
      import('./generic-form/phase3-form.component').then((m) => m.Phase3FormComponent),
    data: { formKey: 'msme' }
  },
  {
    path: 'msme1',
    loadComponent: () =>
      import('./generic-form/phase3-form.component').then((m) => m.Phase3FormComponent),
    data: { formKey: 'msme1' }
  },
  {
    path: 'ndh1',
    loadComponent: () =>
      import('./generic-form/phase3-form.component').then((m) => m.Phase3FormComponent),
    data: { formKey: 'ndh1' }
  },
  {
    path: 'ndh2',
    loadComponent: () =>
      import('./generic-form/phase3-form.component').then((m) => m.Phase3FormComponent),
    data: { formKey: 'ndh2' }
  }
];
