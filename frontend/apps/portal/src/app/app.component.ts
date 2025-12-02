import { Component, DestroyRef, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { LogoutModalComponent } from './shared/logout-modal/logout-modal.component';
import { AlertComponent } from './shared/alert/alert.component';
import { AuthService } from './services/auth.service';
import { filter, startWith } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  isUserMenuOpen = false;
  showModal = false;
  isLoggingOut = false;
  currentPageTitle = 'Dashboard';
  authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password'];
  isAuthView = false;

  constructor() {
    // Close dropdown when clicking outside
    document.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        this.isUserMenuOpen = false;
      }
    });

    // Subscribe to route changes for auth view detection
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        startWith(new NavigationEnd(0, this.router.url, this.router.url)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(event => {
        const currentUrl = event.urlAfterRedirects || this.router.url || '';
        this.isAuthView = this.authRoutes.some(route => currentUrl.startsWith(route));
        // Update page title on route change
        this.updatePageTitle();
      });
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
    // Close modal immediately
    this.showModal = false;
    
    // Perform logout (clears data and navigates to login)
    await this.authService.logout();
  }
}
