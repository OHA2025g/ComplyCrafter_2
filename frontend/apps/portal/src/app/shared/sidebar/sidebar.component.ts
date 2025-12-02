import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

interface MenuItem {
  title: string;
  route?: string;
  icon?: string;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="sidebar" [class.collapsed]="isCollapsed">
      <div class="sidebar-header">
        <img src="/images/comply_crafter_logo.png" alt="ComplyCrafter Logo" class="sidebar-logo" />
      </div>

      <nav class="sidebar-nav">
        <div *ngFor="let item of menuItems" class="nav-item">
          <a *ngIf="!item.children && item.route" 
             [routerLink]="[item.route]" 
             routerLinkActive="active"
             class="nav-link">
            <span class="nav-icon">{{ item.icon || '📄' }}</span>
            <span class="nav-text" *ngIf="!isCollapsed">{{ item.title }}</span>
          </a>

          <div *ngIf="item.children" class="nav-expandable">
            <div class="nav-link" (click)="handleExpandableClick(item, $event)">
            <span class="nav-icon">{{ item.icon || '📄' }}</span>
            <span class="nav-text" *ngIf="!isCollapsed">{{ item.title }}</span>
              <span class="nav-arrow" *ngIf="!isCollapsed">{{ item.expanded ? '▼' : '▶' }}</span>
            </div>

            <div class="nav-submenu" [class.expanded]="item.expanded && !isCollapsed" *ngIf="!isCollapsed">
              <div *ngFor="let child of item.children" class="nav-subitem">
                <a *ngIf="!child.children && child.route" 
                   (click)="handleChildNavigation(child, $event)"
                   class="nav-sublink">
                  {{ child.title }}
                </a>

                <div *ngIf="child.children" class="nav-nested">
                  <div class="nav-sublink" (click)="toggleItem(child)">
                    {{ child.title }}
                    <span class="nav-arrow-sm">{{ child.expanded ? '▼' : '▶' }}</span>
                  </div>

                  <div class="nav-nested-submenu" [class.expanded]="child.expanded">
                    <!-- Level 3: Category headers or direct forms -->
                    <div *ngFor="let subchild of child.children" class="nav-category">
                      <!-- If has children (category header), show expand/collapse -->
                      <div *ngIf="subchild.children" class="nav-category-item">
                        <div class="nav-nested-link" (click)="toggleItem(subchild)">
                          {{ subchild.title }}
                          <span class="nav-arrow-sm">{{ subchild.expanded ? '▼' : '▶' }}</span>
                        </div>
                        <!-- Level 4: Actual forms under category -->
                        <div class="nav-forms-list" [class.expanded]="subchild.expanded">
                          <a *ngFor="let form of subchild.children"
                             (click)="handleChildNavigation(form, $event)"
                             class="nav-form-link">
                            {{ form.title }}
                          </a>
                        </div>
                      </div>
                      <!-- If no children (direct form), show as link -->
                      <a *ngIf="!subchild.children && subchild.route" 
                         (click)="handleChildNavigation(subchild, $event)"
                         class="nav-nested-link">
                        {{ subchild.title }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <button class="toggle-btn" (click)="toggleSidebar()" title="{{ isCollapsed ? 'Expand' : 'Collapse' }}">
        <span>{{ isCollapsed ? '>>' : '<<' }}</span>
      </button>
    </div>
  `,
  styles: [`
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .sidebar { width: 260px; height: 100vh; background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%); border-right: 2px solid #e9ecef; overflow-y: auto; box-shadow: 2px 0 12px rgba(0,0,0,0.05); animation: fadeIn 0.3s ease-out; transition: width 0.3s ease; position: relative; }
    .sidebar.collapsed { width: 70px; }
    .sidebar::-webkit-scrollbar { width: 8px; }
    .sidebar::-webkit-scrollbar-track { background: #f8f9fa; }
    .sidebar::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #667eea, #764ba2); border-radius: 4px; }
    .sidebar-header { padding: 0.5rem; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08)); border-bottom: 2px solid #e9ecef; height: 60px; min-height: 60px; box-sizing: border-box; }
    .sidebar.collapsed .sidebar-header { padding: 0.5rem; height: 60px; min-height: 60px; }
    .sidebar-logo { width: 32px; height: 32px; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.1)); transition: transform 0.3s; flex-shrink: 0; }
    .sidebar-logo:hover { transform: rotate(5deg) scale(1.05); }
    .sidebar-header h3 { margin: 0; font-size: 1.3rem; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 800; white-space: nowrap; }
    .toggle-btn { position: absolute; bottom: 1rem; left: 50%; transform: translateX(-50%); width: 40px; height: 40px; background: white; border: 2px solid #e9ecef; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); z-index: 10; transition: all 0.3s ease; }
    .sidebar.collapsed .toggle-btn { left: 50%; transform: translateX(-50%); }
    .toggle-btn:hover { background: #f8f9fa; transform: translateX(-50%) scale(1.1); }
    .sidebar.collapsed .toggle-btn:hover { transform: translateX(-50%) scale(1.1); }
    .toggle-btn span { font-size: 1rem; color: #667eea; font-weight: bold; }
    .sidebar-nav { padding: 1rem 0; }
    .nav-item { margin-bottom: 0.35rem; }
    .nav-link { display: flex; align-items: center; padding: 0.85rem 1.5rem; color: #495057; text-decoration: none; cursor: pointer; transition: all 0.25s; font-weight: 600; border-radius: 0 20px 20px 0; margin-right: 0.5rem; position: relative; }
    .sidebar.collapsed .nav-link { padding: 0.85rem 0.5rem; justify-content: center; }
    .nav-link::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 0; height: 60%; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 0 4px 4px 0; transition: width 0.3s; }
    .nav-link:hover { background: linear-gradient(90deg, rgba(102, 126, 234, 0.08), transparent); color: #667eea; }
    .nav-link:hover::before { width: 4px; }
    .nav-link.active { background: linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.12)); color: #667eea; font-weight: 700; }
    .nav-link.active::before { width: 4px; background: linear-gradient(135deg, #667eea, #764ba2); }
    .nav-icon { margin-right: 0.85rem; font-size: 1.3rem; transition: transform 0.2s; flex-shrink: 0; }
    .sidebar.collapsed .nav-icon { margin-right: 0; }
    .nav-link:hover .nav-icon { transform: scale(1.1); }
    .nav-text { flex: 1; font-weight: 600; white-space: nowrap; overflow: hidden; }
    .nav-arrow { font-size: 0.75rem; color: #adb5bd; transition: transform 0.3s, color 0.2s; }
    .nav-link:hover .nav-arrow { color: #667eea; }
    .nav-submenu { max-height: 0; overflow: hidden; transition: max-height 0.35s ease-out; background: rgba(255,255,255,0.5); border-radius: 0 12px 12px 0; margin-right: 0.5rem; }
    .nav-submenu.expanded { max-height: 2000px; transition: max-height 0.5s ease-in; padding: 0.5rem 0; }
    .sidebar.collapsed .nav-submenu { display: none !important; }
    .nav-subitem { margin-left: 0.75rem; }
    .nav-sublink { display: block; padding: 0.65rem 1.5rem; color: #495057; text-decoration: none; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; border-radius: 8px; margin: 0.25rem 0.5rem; font-weight: 600; }
    .nav-sublink:hover { background: rgba(102, 126, 234, 0.08); color: #667eea; }
    .nav-arrow-sm { float: right; font-size: 0.75rem; color: #adb5bd; margin-left: 0.5rem; transition: transform 0.3s, color 0.2s; }
    .nav-sublink:hover .nav-arrow-sm { color: #667eea; }
    .nav-nested-submenu { max-height: 0; overflow: hidden; transition: max-height 0.35s ease-out; margin-left: 1rem; }
    .nav-nested-submenu.expanded { max-height: 1000px; transition: max-height 0.4s ease-in; }
    .nav-nested-link { display: block; padding: 0.55rem 1.5rem; color: #6c757d; text-decoration: none; font-size: 0.875rem; transition: all 0.2s; cursor: pointer; border-radius: 8px; margin: 0.2rem 0.5rem; font-weight: 600; }
    .nav-nested-link:hover { background: rgba(102, 126, 234, 0.06); color: #667eea; }
    .nav-category { margin-bottom: 0.25rem; }
    .nav-category-item { margin-left: 0.5rem; }
    .nav-forms-list { max-height: 0; overflow: hidden; transition: max-height 0.35s ease-out; margin-left: 1rem; }
    .nav-forms-list.expanded { max-height: 800px; transition: max-height 0.4s ease-in; padding: 0.5rem 0; }
    .nav-form-link { display: block; padding: 0.5rem 1.5rem; color: #868e96; text-decoration: none; font-size: 0.825rem; transition: all 0.2s; border-left: 3px solid transparent; border-radius: 0 8px 8px 0; margin: 0.2rem 0.5rem 0.2rem 0; font-weight: 600; }
    .nav-form-link:hover { background: linear-gradient(90deg, rgba(102, 126, 234, 0.06), transparent); color: #667eea; border-left-color: #667eea; }
    .nav-form-link.active { background: linear-gradient(90deg, rgba(102, 126, 234, 0.15), transparent); color: #667eea; border-left-color: #667eea; font-weight: 700; }
    @media (max-width: 768px) { .sidebar { width: 220px; } .sidebar-header { padding: 1.25rem 1rem; } .nav-link { padding: 0.7rem 1rem; } }
  `]
})
export class SidebarComponent {
  isCollapsed = true;
  private router = inject(Router);

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    // Collapse all submenus when sidebar is collapsed
    if (this.isCollapsed) {
      this.menuItems.forEach(item => {
        if (item.children) {
          item.expanded = false;
        }
      });
    }
  }

  menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      route: '/dashboard',
      icon: '📊'
    },
    {
      title: 'Masters',
      icon: '👥',
      route: '/masters',
      expanded: false,
      children: [
        { title: 'Company', route: '/masters?tab=company' },
        { title: 'Directors / KMP', route: '/masters?tab=directors' },
        { title: 'Shareholder', route: '/masters?tab=shareholder' },
        { title: 'Share Certificate', route: '/masters?tab=share-certificate' },
        { title: 'Debenture Holder', route: '/masters?tab=debenture-holder' },
        { title: 'Auditor', route: '/masters?tab=auditor' },
        { title: 'Agenda(s)', route: '/masters?tab=agendas' },
        { title: 'Shareholder Management', route: '/masters?tab=shareholder-management' },
        {
          title: 'Capital Structure',
          expanded: false,
          children: [
            { title: 'Authorized Capital', route: '/masters?tab=capital-structure&subTab=authorized' },
            { title: 'Paid-up Capital', route: '/masters?tab=capital-structure&subTab=paid-up' },
            { title: 'Share Capital', route: '/masters?tab=capital-structure&subTab=share' }
          ]
        }
      ]
    },
    {
      title: 'Meeting',
      icon: '🤝',
      route: '/meetings' // Direct link to the Meetings container page
    },
    {
      title: 'Forms',
      icon: '📝',
      route: '/forms' // Direct link to the Forms container page
    },
    {
      title: 'DMS',
      route: '/dms',
      icon: '🗂️'
    }
    // {
    //   title: 'Access Control',
    //   route: '/access-control',
    //   icon: '🔐'
    // }
  ];

  toggleItem(item: MenuItem): void {
    item.expanded = !item.expanded;
  }

  handleExpandableClick(item: MenuItem, event: Event): void {
    // If Masters, navigate to /masters (defaults to company tab)
    if (item.title === 'Masters' && item.route) {
      this.router.navigate([item.route], { queryParams: { tab: 'company' } });
      // Expand the menu after navigation
      if (!this.isCollapsed) {
        item.expanded = true;
      }
    } else {
      // For other expandable items, just toggle
      this.toggleItem(item);
    }
  }

  handleChildNavigation(child: MenuItem, event: Event): void {
    event.preventDefault();
    if (!child.route) return;
    
    // Extract base path and query params
    const [basePath, queryString] = child.route.split('?');
    const queryParams: { [key: string]: string } = {};
    
    if (queryString) {
      queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key && value) {
          queryParams[key] = decodeURIComponent(value);
        }
      });
    }
    
    // Navigate to base path with query params
    this.router.navigate([basePath], { queryParams }).then(() => {
      // Expand parent if collapsed
      const parent = this.menuItems.find(item => item.children?.includes(child));
      if (parent && !this.isCollapsed) {
        parent.expanded = true;
      }
    });
  }
}

