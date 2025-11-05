import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
    <div class="sidebar">
      <div class="sidebar-header">
        <img src="/images/comply_crafter_logo.png" alt="ComplyCrafter Logo" class="sidebar-logo" />
        <h3>Comply Crafter</h3>
      </div>

      <nav class="sidebar-nav">
        <div *ngFor="let item of menuItems" class="nav-item">
          <a *ngIf="!item.children && item.route" 
             [routerLink]="[item.route]" 
             routerLinkActive="active"
             class="nav-link">
            <span class="nav-icon">{{ item.icon || '📄' }}</span>
            <span class="nav-text">{{ item.title }}</span>
          </a>

          <div *ngIf="item.children" class="nav-expandable">
            <div class="nav-link" (click)="toggleItem(item)">
              <span class="nav-icon">{{ item.icon || '📄' }}</span>
              <span class="nav-text">{{ item.title }}</span>
              <span class="nav-arrow">{{ item.expanded ? '▼' : '▶' }}</span>
            </div>

            <div class="nav-submenu" [class.expanded]="item.expanded">
              <div *ngFor="let child of item.children" class="nav-subitem">
                <a *ngIf="!child.children && child.route" 
                   [routerLink]="[child.route]"
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
                             [routerLink]="[form.route]"
                             routerLinkActive="active"
                             class="nav-form-link">
                            {{ form.title }}
                          </a>
                        </div>
                      </div>
                      <!-- If no children (direct form), show as link -->
                      <a *ngIf="!subchild.children && subchild.route" 
                         [routerLink]="[subchild.route]"
                         routerLinkActive="active"
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
    </div>
  `,
  styles: [`
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .sidebar { width: 260px; height: 100vh; background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%); border-right: 2px solid #e9ecef; overflow-y: auto; box-shadow: 2px 0 12px rgba(0,0,0,0.05); animation: fadeIn 0.3s ease-out; }
    .sidebar::-webkit-scrollbar { width: 8px; }
    .sidebar::-webkit-scrollbar-track { background: #f8f9fa; }
    .sidebar::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #667eea, #764ba2); border-radius: 4px; }
    .sidebar-header { padding: 0.9rem 1.5rem; display: flex; align-items: center; gap: 0.85rem; background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08)); border-bottom: 2px solid #e9ecef; }
    .sidebar-logo { width: 44px; height: 44px; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.1)); transition: transform 0.3s; }
    .sidebar-logo:hover { transform: rotate(5deg) scale(1.05); }
    .sidebar-header h3 { margin: 0; font-size: 1.3rem; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 800; }
    .sidebar-nav { padding: 1rem 0; }
    .nav-item { margin-bottom: 0.35rem; }
    .nav-link { display: flex; align-items: center; padding: 0.85rem 1.5rem; color: #495057; text-decoration: none; cursor: pointer; transition: all 0.25s; font-weight: 600; border-radius: 0 20px 20px 0; margin-right: 0.5rem; position: relative; }
    .nav-link::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 0; height: 60%; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 0 4px 4px 0; transition: width 0.3s; }
    .nav-link:hover { background: linear-gradient(90deg, rgba(102, 126, 234, 0.08), transparent); color: #667eea; }
    .nav-link:hover::before { width: 4px; }
    .nav-link.active { background: linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.12)); color: #667eea; font-weight: 700; }
    .nav-link.active::before { width: 4px; background: linear-gradient(135deg, #667eea, #764ba2); }
    .nav-icon { margin-right: 0.85rem; font-size: 1.3rem; transition: transform 0.2s; }
    .nav-link:hover .nav-icon { transform: scale(1.1); }
    .nav-text { flex: 1; font-weight: 600; }
    .nav-arrow { font-size: 0.75rem; color: #adb5bd; transition: transform 0.3s, color 0.2s; }
    .nav-link:hover .nav-arrow { color: #667eea; }
    .nav-submenu { max-height: 0; overflow: hidden; transition: max-height 0.35s ease-out; background: rgba(255,255,255,0.5); border-radius: 0 12px 12px 0; margin-right: 0.5rem; }
    .nav-submenu.expanded { max-height: 2000px; transition: max-height 0.5s ease-in; padding: 0.5rem 0; }
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
  menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      route: '/dashboard',
      icon: '📊'
    },
    {
      title: 'Masters',
      icon: '👥',
      expanded: false,
      children: [
        { title: 'Company', route: '/masters/company' },
        { title: 'Directors / KMP', route: '/masters/directors' },
        { title: 'Shareholder', route: '/masters/shareholder' },
        { title: 'Share Certificate', route: '/masters/share-certificate' },
        { title: 'Debenture Holder', route: '/masters/debenture-holder' },
        { title: 'Auditor', route: '/masters/auditor' },
        { title: 'Agenda(s)', route: '/masters/agendas' },
        { title: 'Shareholder Management', route: '/masters/shareholder-management' },
        {
          title: 'Capital Structure',
          expanded: false,
          children: [
            { title: 'Authorized Capital', route: '/masters/capital/authorized' },
            { title: 'Paid-up Capital', route: '/masters/capital/paid-up' },
            { title: 'Share Capital', route: '/masters/capital/share' }
          ]
        }
      ]
    },
    {
      title: 'Meeting',
      icon: '🤝',
      expanded: false,
      children: [
        { title: 'Board Meeting', route: '/meetings/board' },
        { title: 'Annual General Meeting', route: '/meetings/agm' },
        { title: 'Extra Ordinary General Meeting', route: '/meetings/egm' },
        { title: 'Committee Meeting', route: '/meetings/committee' }
      ]
    },
    {
      title: 'Forms',
      icon: '📝',
      expanded: false,
      children: [
        {
          title: 'MCA Version 3',
          expanded: false,
          children: [
            {
              title: 'Charge related forms',
              expanded: false,
              // No route - this is just a category header
              children: [
                { title: 'CHG1', route: '/forms/chg1' },
                { title: 'CHG4', route: '/forms/chg4' },
                { title: 'CHG6', route: '/forms/chg6' },
                { title: 'CHG8', route: '/forms/chg8' },
                { title: 'CHG9', route: '/forms/chg9' }
              ]
            },
            {
              title: 'Deposit related forms',
              expanded: false,
              // No route - this is just a category header
              children: [
                { title: 'DPT3', route: '/forms/dpt3' },
                { title: 'DPT4', route: '/forms/dpt4' }
              ]
            },
            {
              title: 'DIN related forms',
              expanded: false,
              // No route - this is just a category header
              children: [
                { title: 'DIR3', route: '/forms/dir3' },
                { title: 'DIR5', route: '/forms/dir5' },
                { title: 'DIR6', route: '/forms/dir6' },
                { title: 'DIR9', route: '/forms/dir9' },
                { title: 'DIR11', route: '/forms/dir11' },
                { title: 'DIR12', route: '/forms/dir12' }
              ]
            },
            {
              title: 'Nidhi Services',
              expanded: false,
              // No route - this is just a category header
              children: [
                { title: 'NDH1', route: '/forms/ndh1' },
                { title: 'NDH2', route: '/forms/ndh2' }
              ]
            },
            {
              title: 'Change Services',
              expanded: false,
              // No route - this is just a category header
              children: [
                { title: 'INC4', route: '/forms/inc4' },
                { title: 'INC22', route: '/forms/inc22' },
                { title: 'SH7', route: '/forms/sh7' },
                { title: 'MR1', route: '/forms/mr1' }
              ]
            },
            {
              title: 'Informational Services',
              expanded: false,
              // No route - this is just a category header
              children: [
                { title: 'INC20A', route: '/forms/inc20a' },
                { title: 'INC28', route: '/forms/inc28' },
                { title: 'PAS2', route: '/forms/pas2' }
              ]
            },
            {
              title: 'Approval Services (ROC)',
              expanded: false,
              // No route - this is just a category header
              children: [
                { title: 'INC12', route: '/forms/inc12' },
                { title: 'INC24', route: '/forms/inc24' },
                { title: 'STK2', route: '/forms/stk2' }
              ]
            },
            {
              title: 'Approval Services (RD)',
              expanded: false,
              // No route - this is just a category header
              children: [
                { title: 'INC23', route: '/forms/inc23' }
              ]
            },
            {
              title: 'Compliance Services',
              expanded: false,
              // No route - this is just a category header
              children: [
                { title: 'MGT14', route: '/forms/mgt14' },
                { title: 'MSC3', route: '/forms/msc3' },
                { title: 'PAS3', route: '/forms/pas3' },
                { title: 'PAS6', route: '/forms/pas6' },
                { title: 'GNL2', route: '/forms/gnl2' },
                { title: 'GNL3', route: '/forms/gnl3' },
                { title: 'SH8', route: '/forms/sh8' },
                { title: 'SH9', route: '/forms/sh9' },
                { title: 'SH11', route: '/forms/sh11' },
                { title: 'MSME', route: '/forms/msme' },
                { title: 'MGT6', route: '/forms/mgt6' },
                { title: 'BEN2', route: '/forms/ben2' }
              ]
            },
            {
              title: 'Annual Filings',
              expanded: false,
              // No route - this is just a category header
              children: [
                { title: 'AOC4', route: '/forms/aoc4' },
                { title: 'AOC4CFS', route: '/forms/aoc4cfs' },
                { title: 'MGT7A', route: '/forms/mgt7a' },
                { title: 'MGT8', route: '/forms/mgt8' },
                { title: 'MGT9', route: '/forms/mgt9' },
                { title: 'ADT1', route: '/forms/adt1' }
              ]
            },
            {
              title: 'Incorporation',
              expanded: false,
              // No route - this is just a category header
              children: [
                { title: 'RUN', route: '/forms/run' },
                { title: 'RUNLLP', route: '/forms/runllp' }
              ]
            },
            {
              title: 'IEPF Services',
              expanded: false,
              // No route - this is just a category header
              children: [
                { title: 'IEPF2', route: '/forms/iepf2' },
                { title: 'IEPF5', route: '/forms/iepf5' }
              ]
            },
            {
              title: 'LLP Form',
              expanded: false,
              // No route - this is just a category header
              children: [
                { title: 'FORM3', route: '/forms/form3' },
                { title: 'FORM4', route: '/forms/form4' },
                { title: 'FORM5', route: '/forms/form5' },
                { title: 'FORM11', route: '/forms/form11' },
                { title: 'FORM12', route: '/forms/form12' },
                { title: 'FORM15', route: '/forms/form15' },
                { title: 'FORM22', route: '/forms/form22' },
                { title: 'FORM23', route: '/forms/form23' },
                { title: 'FORM24', route: '/forms/form24' },
                { title: 'FORM28', route: '/forms/form28' }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'DMS',
      route: '/dms',
      icon: '🗂️'
    }
  ];

  toggleItem(item: MenuItem): void {
    item.expanded = !item.expanded;
  }
}

