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
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
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

