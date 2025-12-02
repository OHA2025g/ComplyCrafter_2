import { Component, DestroyRef, inject, HostListener, ElementRef, ViewChild, ChangeDetectorRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { AuthService } from './services/auth.service';
import { filter, startWith } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent, RouterLink],
  template: `
    <div class="app-layout" [class.auth-layout]="isAuthPage()">
      <app-sidebar *ngIf="!isAuthPage()"></app-sidebar>
      <div class="main-container" [class.full-width]="isAuthPage()">
        <header class="app-header" *ngIf="!isAuthPage()">
          <div class="header-content">
            <div class="header-left">
              <img src="/images/comply_crafter_logo.png" alt="ComplyCrafter Logo" class="logo" />
              <h1>ComplyCrafter Portal</h1>
            </div>
            <div class="header-right">
              <div class="user-dropdown" #userDropdown>
                <div class="user-info" (click)="toggleUserDropdown($event)">
                  <span class="user-icon">👤</span>
                  <span class="user-name">{{ getUserName() }}</span>
                  <span class="dropdown-arrow">{{ isDropdownOpen ? '▲' : '▼' }}</span>
                </div>
                <div class="dropdown-menu" [class.show]="isDropdownOpen" (click)="$event.stopPropagation()">
                  <a [routerLink]="['/profile']" class="dropdown-item" (click)="onProfileClick($event)">
                    <span class="dropdown-icon">👤</span>
                    <span>Profile</span>
                  </a>
                  <div class="dropdown-divider"></div>
                  <button class="dropdown-item logout-item" (click)="onLogoutClick($event)">
                    <span class="dropdown-icon">🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main class="main-content" [class.auth-content]="isAuthPage()">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
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
    .app-layout.auth-layout {
      background: transparent;
    }
    .main-container {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .main-container.full-width {
      width: 100%;
    }
    .main-content.auth-content {
      padding: 0;
      margin: 0;
      overflow: visible;
    }
    .app-header {
      background: linear-gradient(135deg, #1f3c88 0%, #2a5298 100%);
      color: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      position: relative;
      z-index: 100;
    }
    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
      animation: slideIn 0.4s ease-out;
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
    .user-dropdown {
      position: relative;
      cursor: pointer;
      z-index: 1001;
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      backdrop-filter: blur(10px);
      font-size: 0.95rem;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    .user-info:hover {
      background: rgba(255, 255, 255, 0.15);
    }
    .user-icon {
      font-size: 1.2rem;
    }
    .user-name {
      color: white;
    }
    .dropdown-arrow {
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.8);
      transition: transform 0.3s ease;
      margin-left: 0.25rem;
    }
    .dropdown-menu {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      min-width: 200px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s ease;
      z-index: 1002;
      overflow: hidden;
      pointer-events: none;
    }
    .dropdown-menu.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
      pointer-events: auto;
    }
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.25rem;
      color: #333;
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 500;
      transition: all 0.2s ease;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
    }
    .dropdown-item:hover {
      background: #f8f9fa;
      color: #1f3c88;
    }
    .dropdown-item.logout-item:hover {
      background: #fff5f5;
      color: #dc3545;
    }
    .dropdown-icon {
      font-size: 1.1rem;
      width: 20px;
      text-align: center;
    }
    .dropdown-divider {
      height: 1px;
      background: #e9ecef;
      margin: 0.25rem 0;
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
export class AppComponent implements AfterViewInit, AfterViewChecked {
  private router = inject(Router);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private elementRef = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('userDropdown') userDropdown?: ElementRef;

  isDropdownOpen = false;
  isAuthPageValue = false;
  private viewInitialized = false;

  constructor() {
    // Subscribe to router events to update isAuthPageValue reactively
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event: NavigationEnd) => {
        this.updateAuthPageStatus(event.urlAfterRedirects || event.url);
        // After navigation, wait for view to update before detecting changes
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 0);
      });
    
    // Initialize with current URL
    this.updateAuthPageStatus(this.router.url);
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.cdr.detectChanges();
  }

  ngAfterViewChecked(): void {
    // Ensure ViewChild is available after view updates
    if (!this.viewInitialized && this.userDropdown) {
      this.viewInitialized = true;
    }
  }

  private updateAuthPageStatus(url: string): void {
    const newValue = url.includes('/login') || url.includes('/signup') || 
                     url.includes('/forgot-password') || url.includes('/reset-password');
    if (this.isAuthPageValue !== newValue) {
      this.isAuthPageValue = newValue;
    }
  }

  isAuthPage(): boolean {
    return this.isAuthPageValue;
  }
  getUserName(): string {
    return this.authService.getUserDisplayName();
  }

  toggleUserDropdown(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
    // Force change detection to ensure dropdown renders
    this.cdr.detectChanges();
  }

  closeUserDropdown(): void {
    this.isDropdownOpen = false;
  }

  onProfileClick(event: Event): void {
    event.stopPropagation();
    this.closeUserDropdown();
    // Navigation will happen via routerLink
  }

  onLogoutClick(event: Event): void {
    event.stopPropagation();
    this.handleLogout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isDropdownOpen) {
      // Try to get the element directly if ViewChild is not available
      const dropdownElement = this.userDropdown?.nativeElement || 
        document.querySelector('.user-dropdown');
      
      if (dropdownElement) {
        const clickedInside = dropdownElement.contains(event.target as Node);
        if (!clickedInside) {
          this.closeUserDropdown();
        }
      } else {
        // Fallback: close dropdown if we can't find the element
        this.closeUserDropdown();
      }
    }
  }

  async handleLogout(): Promise<void> {
    // Close dropdown first
    this.closeUserDropdown();
    
    if (confirm('Are you sure you want to logout?')) {
      await this.authService.logout();
    }
  }
}
