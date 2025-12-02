import { Component, DestroyRef, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
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

  authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password'];
  isAuthView = false;

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        startWith(new NavigationEnd(0, this.router.url, this.router.url)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(event => {
        const currentUrl = event.urlAfterRedirects || this.router.url || '';
        this.isAuthView = this.authRoutes.some(route => currentUrl.startsWith(route));
      });
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
