import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { LogoutModalComponent } from './shared/logout-modal/logout-modal.component';
import { AlertComponent } from './shared/alert/alert.component';
import { AuthService } from './services/auth.service';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent, LogoutModalComponent, AlertComponent],
  template: `
    <div class="app-layout" *ngIf="!isAuthPage(); else authLayout">
      <app-sidebar></app-sidebar>
      <div class="main-container">
        <header class="app-header">
          <div class="header-content">
            <div class="header-left">
              <h1>{{ getPageTitle() }}</h1>
            </div>
            <div class="header-right">
              <div class="user-menu-container">
                <button class="btn-user" (click)="toggleUserMenu()" title="User Menu">
                  <span class="user-icon">👤</span>
                  <span class="user-name">{{ getUserName() }}</span>
                  <span class="dropdown-arrow">{{ isUserMenuOpen ? '▲' : '▼' }}</span>
                </button>
                <div class="user-dropdown" *ngIf="isUserMenuOpen" (click)="$event.stopPropagation()">
                  <a class="dropdown-item" (click)="handleProfile()">
                    <span class="dropdown-icon">👤</span>
                    <span class="dropdown-text">Profile</span>
                  </a>
                  <a class="dropdown-item" (click)="showLogoutModal()">
                    <span class="dropdown-icon">🚪</span>
                    <span class="dropdown-text">Logout</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
      <app-alert></app-alert>
    </div>

    <ng-template #authLayout>
      <router-outlet></router-outlet>
      <app-alert></app-alert>
    </ng-template>

    <app-logout-modal 
      *ngIf="showModal" 
      [isLoading]="isLoggingOut"
      (confirm)="handleLogout()" 
      (cancel)="hideLogoutModal()">
    </app-logout-modal>
  `,
  styles: [`
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(10px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .app-layout {
      display: flex;
      min-height: 100vh;
      background: #f5f5f5;
    }
    .main-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .app-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.5rem 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      height: 60px;
      min-height: 60px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
    }
    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      width: 100%;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
    }
    .header-left h1 {
      color: white;
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }
    .header-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 1rem;
      animation: slideIn 0.4s ease-out;
      margin-left: auto;
      flex-shrink: 0;
    }
    .logo {
      width: 48px;
      height: 48px;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
      transition: transform 0.3s ease;
    }
    .logo:hover {
      transform: rotate(5deg) scale(1.05);
    }
    .user-menu-container {
      position: relative;
    }
    .btn-user {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 1.25rem;
      background: rgba(255, 255, 255, 0.15);
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 10px;
      color: white;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }
    .btn-user:hover {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    .btn-user:active {
      transform: translateY(0);
    }
    .user-icon {
      font-size: 1.2rem;
    }
    .user-name {
      color: white;
    }
    .dropdown-arrow {
      font-size: 0.75rem;
      transition: transform 0.3s ease;
      margin-left: 0.25rem;
    }
    .user-dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      min-width: 180px;
      overflow: hidden;
      z-index: 1000;
      animation: slideDown 0.2s ease-out;
    }
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.85rem 1.25rem;
      color: #333;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
      border-bottom: 1px solid #f0f0f0;
    }
    .dropdown-item:last-child {
      border-bottom: none;
    }
    .dropdown-item:hover {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
      color: #667eea;
    }
    .dropdown-icon {
      font-size: 1.1rem;
      width: 20px;
      text-align: center;
    }
    .dropdown-text {
      font-weight: 500;
      flex: 1;
    }
    .main-content {
      flex: 1;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
      }
      .header-right {
        width: 100%;
        justify-content: space-between;
      }
      .user-name {
        display: none;
      }
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);
  
  isUserMenuOpen = false;
  showModal = false;
  isLoggingOut = false;
  currentPageTitle = 'Dashboard';
  isAuthPageRoute = false;
  private routerSubscription?: Subscription;

  constructor() {
    // Close dropdown when clicking outside
    document.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        this.isUserMenuOpen = false;
      }
    });
  }

  ngOnInit(): void {
    // Set initial page title and auth page status
    this.updatePageTitle();
    this.updateAuthPageStatus();
    
    // Subscribe to route changes
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageTitle();
        this.updateAuthPageStatus();
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  updatePageTitle(): void {
    const url = this.router.url;
    this.currentPageTitle = this.getPageTitle();
    console.log(this.currentPageTitle);
  }

  getPageTitle(): string {
    const url = this.router.url;
    console.log('Current URL:', this.router.url);
    
    // Remove query params and hash
    const path = url.split('?')[0].split('#')[0];
    
    // Route to title mapping
    const routeMap: { [key: string]: string } = {
      '/dashboard': 'Dashboard',
      '/profile': 'Profile',
      '/company-search': 'Company Search',
      '/masters/company': 'Company Master',
      '/company': 'Company Master',
      '/masters': 'Master/Company',
      '/masters/directors': 'Directors / KMP',
      '/masters/shareholder': 'Shareholder Master',
      '/masters/share-certificate': 'Share Certificate',
      '/masters/debenture-holder': 'Debenture Holder',
      '/masters/auditor': 'Auditor',
      '/masters/agendas': 'Agendas',
      '/masters/capital-structure': 'Capital Structure',
      '/masters/shareholder-management': 'Shareholder Management',
      '/masters/capital/authorized': 'Authorized Capital',
      '/masters/capital/paid-up': 'Paid-up Capital',
      '/masters/capital/share': 'Share Capital',
      '/meetings': 'Meetings',
      '/meetings/board': 'Board Meeting',
      '/meetings/agm': 'Annual General Meeting',
      '/meetings/egm': 'Extra Ordinary General Meeting',
      '/meetings/committee': 'Committee Meeting',
      '/forms': 'Forms',
      '/access-control': 'Access Control'
    };

    // Check exact match first
    // if (routeMap[path]) {
    //   console.log('Exact route match found:', path);
    //   return routeMap[path];
    // }

    // Check for forms routes
    if (path.startsWith('/forms/')) {
      const formPath = path.replace('/forms/', '');
      if (formPath === '') {
        return 'Forms';
      }
      // Extract form code (e.g., 'adt1', 'ben2')
      const formCode = formPath.split('/')[0].toUpperCase();
      // Convert to readable format (e.g., 'ADT-1', 'BEN-2')
      const formattedCode = formCode.replace(/([A-Z]+)(\d+)/, '$1-$2');
      return `${formattedCode} Form`;
    }
console.log('Path after forms check:', path);
    // Check for masters routes
    if (path.startsWith('/masters')) {
      console.log('Masters path detected:', path);
      // Check if it's /masters with query params (tab navigation)
      if (path === '/masters') {
        const url = this.router.url;
        const urlObj = new URL(url, window.location.origin);
        const tabParam = urlObj.searchParams.get('tab');
        const subTabParam = urlObj.searchParams.get('subTab');
        
        if (tabParam) {
          // Map tab names to display titles
          const tabTitleMap: { [key: string]: string } = {
            'company': 'Company',
            'directors': 'Directors / KMP',
            'shareholder': 'Shareholder',
            'share-certificate': 'Share Certificate',
            'debenture-holder': 'Debenture Holder',
            'auditor': 'Auditor',
            'agendas': 'Agenda(s)',
            'shareholder-management': 'Shareholder Management',
            'capital-structure': 'Capital Structure'
          };
          
          const title = tabTitleMap[tabParam] || tabParam.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
          
          // Handle nested tabs (e.g., Capital Structure sub-tabs)
          if (tabParam === 'capital-structure' && subTabParam) {
            const subTabTitleMap: { [key: string]: string } = {
              'authorized': 'Authorized Capital',
              'paid-up': 'Paid-up Capital',
              'share': 'Share Capital'
            };
            const subTabTitle = subTabTitleMap[subTabParam] || subTabParam.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
            console.log('Masters nested tab title:', `Masters / ${title} / ${subTabTitle}`);
            return `Masters / ${title} / ${subTabTitle}`;
          }
          
          console.log('Masters tab title:', title);
          return `Masters / ${title}`;
        }
        return 'Masters';
      }
      // Handle /masters/company style routes
      if (path.startsWith('/masters/')) {
        const masterPath = path.replace('/masters/', '');
        const parts = masterPath.split('/');
        if (parts.length > 0) {
          return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' ')).join(' / ');
        }
        return 'Masters';
      }
      return 'Masters';
    }

    // Check for meetings routes
    if (path.startsWith('/meetings')) {
      if (path === '/meetings') {
        // Get tab from query params if available
        const url = this.router.url;
        const urlObj = new URL(url, window.location.origin);
        const tabParam = urlObj.searchParams.get('tab');
        if (tabParam) {
          switch (tabParam) {
            case 'board': return 'Board Meeting';
            case 'agm': return 'Annual General Meeting';
            case 'egm': return 'Extra Ordinary General Meeting';
            case 'committee': return 'Committee Meeting';
            default: return 'Meetings';
          }
        }
        return 'Meetings';
      }
      const meetingPath = path.replace('/meetings/', '');
      console.log(path)
      const parts = meetingPath.split('/');
      if (parts.length > 0) {
        return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' ')).join(' / ');
      }
      return 'Meetings';
    }

    // Default fallback
    return 'Dashboard';
  }

  updateAuthPageStatus(): void {
    const url = this.router.url;
    this.isAuthPageRoute = url.includes('/login') || url.includes('/signup');
  }

  isAuthPage(): boolean {
    return this.isAuthPageRoute;
  }

  isProfilePage(): boolean {
    return this.router.url.includes('/profile');
  }

  getUserName(): string {
    return this.authService.getUserDisplayName();
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  handleProfile(): void {
    this.isUserMenuOpen = false;
    this.router.navigate(['/profile']);
  }

  showLogoutModal(): void {
    this.isUserMenuOpen = false;
    this.showModal = true;
  }

  hideLogoutModal(): void {
    this.showModal = false;
  }

  async handleLogout(): Promise<void> {
    this.isLoggingOut = true;
    try {
      // Call logout API and wait for response
      const response = await this.authService.callLogoutAPI();
      
      // Check if logout was successful
      if (response && response.success === true) {
        // Close loader and modal immediately
        this.isLoggingOut = false;
        this.showModal = false;
        
        // Update auth page status immediately (before navigation)
        this.isAuthPageRoute = true;
        
        // Perform logout (clears data and navigates) - no delay needed
        await this.authService.logout();
      } else {
        // Even if API says unsuccessful, still close and redirect
        console.warn('Logout API returned unsuccessful, but continuing with logout');
        this.isLoggingOut = false;
        this.showModal = false;
        
        // Update auth page status immediately (before navigation)
        this.isAuthPageRoute = true;
        
        // Perform logout (clears data and navigates) - no delay needed
        await this.authService.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, clear state and redirect
      this.isLoggingOut = false;
      this.showModal = false;
      
      // Update auth page status immediately (before navigation)
      this.isAuthPageRoute = true;
      
      // Perform logout (clears data and navigates) - no delay needed
      await this.authService.logout();
    }
  }
}
