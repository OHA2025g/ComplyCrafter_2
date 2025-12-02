import { Routes } from '@angular/router';
import { FORMS_ROUTES } from './forms/forms.routes';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { subscriptionGuard } from './guards/subscription.guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Dashboard - ComplyCrafter',
    canActivate: [subscriptionGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
    title: 'Login - ComplyCrafter',
    canActivate: [guestGuard]  // Redirect to dashboard if already logged in
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    title: 'Forgot Password - ComplyCrafter',
    canActivate: [guestGuard]
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
    title: 'Reset Password - ComplyCrafter',
    canActivate: [guestGuard]
  },
  {
    path: 'signup',
    loadComponent: () => import('./auth/signup/signup.component').then(m => m.SignupComponent),
    title: 'Signup - ComplyCrafter',
    canActivate: [guestGuard]  // Redirect to dashboard if already logged in
  },
  {
    path: 'company-search',
    loadComponent: () => import('./company/company-search.component').then(m => m.CompanySearchComponent),
    title: 'Company Search - ComplyCrafter',
    canActivate: [subscriptionGuard]
  },
  // Masters Routes (Protected)
  {
    path: 'masters/company',
    loadComponent: () => import('./masters/company.component').then(m => m.CompanyMasterComponent),
    title: 'Company Master - ComplyCrafter',
    canActivate: [subscriptionGuard]
  },
  {
    path: 'masters/directors',
    loadComponent: () => import('./masters/directors.component').then(m => m.DirectorsMasterComponent),
    title: 'Directors / KMP - ComplyCrafter',
    canActivate: [subscriptionGuard]
  },
  {
    path: 'masters/shareholder',
    loadComponent: () => import('./masters/shareholder.component').then(m => m.ShareholderMasterComponent),
    title: 'Shareholder Master - ComplyCrafter',
    canActivate: [subscriptionGuard]
  },
  {
    path: 'masters/share-certificate',
    loadComponent: () => import('./masters/share-certificate.component').then(m => m.ShareCertificateComponent),
    title: 'Share Certificate - ComplyCrafter',
    canActivate: [subscriptionGuard]
  },
  {
    path: 'masters/debenture-holder',
    loadComponent: () => import('./masters/debenture-holder.component').then(m => m.DebentureHolderComponent),
    title: 'Debenture Holder - ComplyCrafter',
    canActivate: [subscriptionGuard]
  },
  {
    path: 'masters/auditor',
    loadComponent: () => import('./masters/auditor.component').then(m => m.AuditorComponent),
    title: 'Auditor - ComplyCrafter',
    canActivate: [subscriptionGuard]
  },
  {
    path: 'masters/agendas',
    loadComponent: () => import('./masters/agendas.component').then(m => m.AgendasComponent),
    title: 'Agendas - ComplyCrafter',
    canActivate: [subscriptionGuard]
  },
  {
    path: 'masters/shareholder-management',
    loadComponent: () => import('./masters/shareholder-management.component').then(m => m.ShareholderManagementComponent),
    title: 'Shareholder Management - ComplyCrafter',
    canActivate: [subscriptionGuard]
  },
  {
    path: 'masters/capital/authorized',
    loadComponent: () => import('./masters/capital/authorized-capital.component').then(m => m.AuthorizedCapitalComponent),
    title: 'Authorized Capital - ComplyCrafter',
    canActivate: [subscriptionGuard]
  },
  {
    path: 'masters/capital/paid-up',
    loadComponent: () => import('./masters/capital/paid-up-capital.component').then(m => m.PaidUpCapitalComponent),
    title: 'Paid-up Capital - ComplyCrafter',
    canActivate: [subscriptionGuard]
  },
  {
    path: 'masters/capital/share',
    loadComponent: () => import('./masters/capital/share-capital.component').then(m => m.ShareCapitalComponent),
    title: 'Share Capital - ComplyCrafter',
    canActivate: [subscriptionGuard]
  },
  {
    path: 'masters/:type',
    loadComponent: () => import('./shared/placeholder.component').then(m => m.PlaceholderComponent),
    title: 'Masters - ComplyCrafter',
    canActivate: [subscriptionGuard]
  },
  // Meeting Routes (Protected)
  {
    path: 'meetings/board',
    loadComponent: () => import('./meetings/board-meeting.component').then(m => m.BoardMeetingComponent),
    title: 'Board Meeting - ComplyCrafter',
    canActivate: [subscriptionGuard]
  },
  {
    path: 'meetings/agm',
    loadComponent: () => import('./meetings/agm.component').then(m => m.AGMComponent),
    title: 'Annual General Meeting - ComplyCrafter',
    canActivate: [subscriptionGuard]
  },
  {
    path: 'meetings/egm',
    loadComponent: () => import('./meetings/egm.component').then(m => m.EGMComponent),
    title: 'Extra Ordinary General Meeting - ComplyCrafter',
    canActivate: [subscriptionGuard]
  },
  {
    path: 'meetings/committee',
    loadComponent: () => import('./meetings/committee-meeting.component').then(m => m.CommitteeMeetingComponent),
    title: 'Committee Meeting - ComplyCrafter',
    canActivate: [subscriptionGuard]
  },
  {
    path: 'meetings/:type',
    loadComponent: () => import('./shared/placeholder.component').then(m => m.PlaceholderComponent),
    title: 'Meetings - ComplyCrafter',
    canActivate: [subscriptionGuard]
  },
  {
    path: 'forms',
    children: FORMS_ROUTES,
    canActivate: [subscriptionGuard]
  },
  {
    path: 'subscription',
    loadComponent: () => import('./subscription/subscription.component').then(m => m.SubscriptionComponent),
    title: 'Subscription - ComplyCrafter',
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent),
    title: 'User Profile - ComplyCrafter',
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
