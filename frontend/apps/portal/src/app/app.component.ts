import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent],
  template: `
    <div class="app-layout" *ngIf="!isAuthPage(); else authLayout">
      <app-sidebar></app-sidebar>
      <div class="main-container">
        <header class="app-header">
          <div class="header-content">
            <div class="header-left">
              <img src="/assets/images/comply_crafter_logo.png" alt="ComplyCrafter Logo" class="logo" />
              <h1>ComplyCrafter Portal</h1>
            </div>
            <div class="header-right">
              <div class="user-info">
                <span class="user-icon">👤</span>
                <span class="user-name">{{ getUserName() }}</span>
              </div>
              <button class="btn-logout" (click)="handleLogout()" title="Logout">
                <span class="logout-icon">🚪</span>
                <span class="logout-text">Logout</span>
              </button>
            </div>
          </div>
        </header>
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>

    <ng-template #authLayout>
      <router-outlet></router-outlet>
    </ng-template>
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
    }
    .app-header {
      background: linear-gradient(135deg, #1f3c88 0%, #2a5298 100%);
      color: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
    }
    .user-icon {
      font-size: 1.2rem;
    }
    .user-name {
      color: white;
    }
    .btn-logout {
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
    .btn-logout:hover {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    .btn-logout:active {
      transform: translateY(0);
    }
    .logout-icon {
      font-size: 1.1rem;
      transition: transform 0.3s ease;
    }
    .btn-logout:hover .logout-icon {
      transform: translateX(3px);
    }
    .logout-text {
      font-weight: 600;
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
      .logout-text {
        display: none;
      }
    }
  `]
})
export class AppComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  isAuthPage(): boolean {
    const url = this.router.url;
    return url.includes('/login') || url.includes('/signup');
  }

  getUserName(): string {
    return this.authService.getUserDisplayName();
  }

  async handleLogout(): Promise<void> {
    if (confirm('Are you sure you want to logout?')) {
      await this.authService.logout();
    }
  }
}
