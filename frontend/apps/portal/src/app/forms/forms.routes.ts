import { Routes } from '@angular/router';
import { GenericFormComponent } from './generic-form/generic-form.component';

/**
 * Complete routing configuration for all 62 forms + Auth
 * - Phase 1&2: Individual components (11 forms)
 * - Phase 3+: Generic form component (51 forms)
 * - Auth: Login & Signup
 */
export const FORMS_ROUTES: Routes = [
  // Forms Directory/List Page
  {
    path: '',
    loadComponent: () =>
      import('./forms-list/forms-list.component').then(m => m.FormsListComponent),
    title: 'ComplyCrafter - Forms'
  },

  // ==================== AUTH PAGES ====================
  
  // Login page
  {
    path: 'login',
    loadComponent: () =>
      import('../auth/login/login.component').then(m => m.LoginComponent),
    title: 'Login - ComplyCrafter'
  },

  // Signup page
  {
    path: 'signup',
    loadComponent: () =>
      import('../auth/signup/signup.component').then(m => m.SignupComponent),
    title: 'Signup - ComplyCrafter'
  },

  // ==================== PHASE 1 & 2 FORMS (Individual Components) ====================
  
  {
    path: 'adt1',
    loadComponent: () =>
      import('./adt1/adt1.component').then(m => m.Adt1Component),
    title: 'ADT-1 Form'
  },
  {
    path: 'ben2',
    loadComponent: () =>
      import('./ben2/ben2.component').then(m => m.Ben2Component),
    title: 'BEN-2 Form'
  },
  {
    path: 'pas3',
    loadComponent: () =>
      import('./pas3/pas3.component').then(m => m.Pas3Component),
    title: 'PAS-3 Form'
  },
  {
    path: 'dpt3',
    loadComponent: () =>
      import('./dpt3/dpt3.component').then(m => m.Dpt3Component),
    title: 'DPT-3 Form'
  },

  // JSON-based forms (Phase 1&2 with generic handling)
  {
    path: 'aoc4',
    component: GenericFormComponent,
    title: 'AOC-4 Form'
  },
  {
    path: 'aoc4cfs',
    component: GenericFormComponent,
    title: 'AOC-4 CFS Form'
  },
  {
    path: 'mgt7a',
    component: GenericFormComponent,
    title: 'MGT-7A Form'
  },
  {
    path: 'msme',
    component: GenericFormComponent,
    title: 'MSME Form-I'
  },
  {
    path: 'msme1',
    component: GenericFormComponent,
    title: 'MSME-1 Form'
  },
  {
    path: 'ndh1',
    component: GenericFormComponent,
    title: 'NDH-1 Form'
  },
  {
    path: 'ndh2',
    component: GenericFormComponent,
    title: 'NDH-2 Form'
  },

  // ==================== PHASE 3+ FORMS (Generic Component) ====================
  
  // Board Report
  {
    path: 'boardreport',
    component: GenericFormComponent,
    title: 'Board Report'
  },

  // Charge Forms
  {
    path: 'charge',
    component: GenericFormComponent,
    title: 'CHARGE Form'
  },
  {
    path: 'chg1',
    component: GenericFormComponent,
    title: 'CHG-1 Form'
  },
  {
    path: 'chg4',
    component: GenericFormComponent,
    title: 'CHG-4 Form'
  },
  {
    path: 'chg6',
    component: GenericFormComponent,
    title: 'CHG-6 Form'
  },
  {
    path: 'chg8',
    component: GenericFormComponent,
    title: 'CHG-8 Form'
  },
  {
    path: 'chg9',
    component: GenericFormComponent,
    title: 'CHG-9 Form'
  },

  // Director Forms
  {
    path: 'dir3',
    component: GenericFormComponent,
    title: 'DIR-3 Form'
  },
  {
    path: 'dir5',
    component: GenericFormComponent,
    title: 'DIR-5 Form'
  },
  {
    path: 'dir6',
    component: GenericFormComponent,
    title: 'DIR-6 Form'
  },
  {
    path: 'dir9',
    component: GenericFormComponent,
    title: 'DIR-9 Form'
  },
  {
    path: 'dir11',
    component: GenericFormComponent,
    title: 'DIR-11 Form'
  },
  {
    path: 'dir12',
    component: GenericFormComponent,
    title: 'DIR-12 Form'
  },

  // DPT-4
  {
    path: 'dpt4',
    component: GenericFormComponent,
    title: 'DPT-4 Form'
  },

  // Form Series
  {
    path: 'form3',
    component: GenericFormComponent,
    title: 'FORM-3'
  },
  {
    path: 'form4',
    component: GenericFormComponent,
    title: 'FORM-4'
  },
  {
    path: 'form5',
    component: GenericFormComponent,
    title: 'FORM-5'
  },
  {
    path: 'form11',
    component: GenericFormComponent,
    title: 'FORM-11'
  },
  {
    path: 'form12',
    component: GenericFormComponent,
    title: 'FORM-12'
  },
  {
    path: 'form15',
    component: GenericFormComponent,
    title: 'FORM-15'
  },
  {
    path: 'form22',
    component: GenericFormComponent,
    title: 'FORM-22'
  },
  {
    path: 'form23',
    component: GenericFormComponent,
    title: 'FORM-23'
  },
  {
    path: 'form24',
    component: GenericFormComponent,
    title: 'FORM-24'
  },
  {
    path: 'form28',
    component: GenericFormComponent,
    title: 'FORM-28'
  },

  // GNL Forms
  {
    path: 'gnl1',
    component: GenericFormComponent,
    title: 'GNL-1 Form'
  },
  {
    path: 'gnl2',
    component: GenericFormComponent,
    title: 'GNL-2 Form'
  },
  {
    path: 'gnl3',
    component: GenericFormComponent,
    title: 'GNL-3 Form'
  },

  // IEPF Forms
  {
    path: 'iepf2',
    component: GenericFormComponent,
    title: 'IEPF-2 Form'
  },
  {
    path: 'iepf5',
    component: GenericFormComponent,
    title: 'IEPF-5 Form'
  },

  // INC Forms
  {
    path: 'inc4',
    component: GenericFormComponent,
    title: 'INC-4 Form'
  },
  {
    path: 'inc12',
    component: GenericFormComponent,
    title: 'INC-12 Form'
  },
  {
    path: 'inc20a',
    component: GenericFormComponent,
    title: 'INC-20A Form'
  },
  {
    path: 'inc22',
    component: GenericFormComponent,
    title: 'INC-22 Form'
  },
  {
    path: 'inc23',
    component: GenericFormComponent,
    title: 'INC-23 Form'
  },
  {
    path: 'inc24',
    component: GenericFormComponent,
    title: 'INC-24 Form'
  },
  {
    path: 'inc28',
    component: GenericFormComponent,
    title: 'INC-28 Form'
  },

  // MGT Forms
  {
    path: 'mgt6',
    component: GenericFormComponent,
    title: 'MGT-6 Form'
  },
  {
    path: 'mgt8',
    component: GenericFormComponent,
    title: 'MGT-8 Form'
  },
  {
    path: 'mgt9',
    component: GenericFormComponent,
    title: 'MGT-9 Form'
  },
  {
    path: 'mgt14',
    component: GenericFormComponent,
    title: 'MGT-14 Form'
  },

  // MR1
  {
    path: 'mr1',
    component: GenericFormComponent,
    title: 'MR-1 Form'
  },

  // MSC3
  {
    path: 'msc3',
    component: GenericFormComponent,
    title: 'MSC-3 Form'
  },

  // PAS Forms
  {
    path: 'pas2',
    component: GenericFormComponent,
    title: 'PAS-2 Form'
  },
  {
    path: 'pas6',
    component: GenericFormComponent,
    title: 'PAS-6 Form'
  },

  // RUN Forms
  {
    path: 'run',
    component: GenericFormComponent,
    title: 'RUN Form'
  },
  {
    path: 'runllp',
    component: GenericFormComponent,
    title: 'RUN-LLP Form'
  },

  // SH Forms
  {
    path: 'sh7',
    component: GenericFormComponent,
    title: 'SH-7 Form'
  },
  {
    path: 'sh8',
    component: GenericFormComponent,
    title: 'SH-8 Form'
  },
  {
    path: 'sh9',
    component: GenericFormComponent,
    title: 'SH-9 Form'
  },
  {
    path: 'sh11',
    component: GenericFormComponent,
    title: 'SH-11 Form'
  },

  // STK2
  {
    path: 'stk2',
    component: GenericFormComponent,
    title: 'STK-2 Form'
  },

  // Catch-all for dynamic form routing
  {
    path: ':code',
    component: GenericFormComponent,
    title: 'Form'
  }
];
