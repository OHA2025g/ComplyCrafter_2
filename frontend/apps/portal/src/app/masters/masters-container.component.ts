import { Component, OnInit, AfterViewInit, OnDestroy, inject, ViewContainerRef, ComponentRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

interface MasterTab {
  id: string;
  title: string;
  route: string;
}

@Component({
  selector: 'app-masters-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="masters-container">
      <!-- Tab Navigation Card -->
      <div class="masters-tabs-card">
        <div class="nav-tabs-integrated">
          <button
            *ngFor="let tab of masterTabs"
            class="nav-tab"
            [class.active]="activeTab === tab.id"
            (click)="selectTab(tab)">
            {{ tab.title }}
          </button>
        </div>
      </div>

      <!-- Card Title (outside the card, top left) -->
      <h1 class="card-title" *ngIf="getActiveTabTitle()">{{ getActiveTabTitle() }}</h1>

      <!-- Component Card (appears below title) -->
      <div class="component-card" *ngIf="activeTab">
        <div class="component-content-wrapper" #contentContainer></div>
      </div>
    </div>
  `,
  styles: [`
    .masters-container {
      padding: 1rem 1.5rem;
      max-width: 100%;
      margin: 0 auto;
      background: #f5f5f5;
      min-height: calc(100vh - 60px);
    }

    .card-title {
      font-size: 1rem;
    /* font-weight: 700; */
    color: #6974dc;
    margin: 0 0 0.75rem 0;
    padding: 4px;
      font-family: Arial, sans-serif;
    }

    .masters-tabs-card {
      background: white;
      border-radius: 8px;
      padding: 0;
      margin-bottom: 0.75rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .nav-tabs-integrated {
      display: flex;
      gap: 0;
      border-bottom: 2px solid #e0e0e0;
      padding: 0 1rem;
      overflow-x: auto;
      background: white;
      border-radius: 8px;
    }

    .nav-tab {
      background: transparent;
      border: none;
      padding: 0.75rem 1rem;
      font-size: 0.9rem;
      font-weight: 600;
      color: #666;
      cursor: pointer;
      transition: all 0.3s;
      border-bottom: 3px solid transparent;
      margin-bottom: -2px;
      white-space: nowrap;
      position: relative;
    }

    .nav-tab:hover {
      color: #667eea;
      background: rgba(102, 126, 234, 0.05);
    }

    .nav-tab.active {
      color: #667eea;
      border-bottom-color: #667eea;
      background: transparent;
    }

    .component-card {
      background: white;
      border-radius: 8px;
      padding: 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .component-content-wrapper {
      padding: 0;
    }

    @media (max-width: 768px) {
      .masters-container {
        padding: 0.75rem 1rem;
      }

      .nav-tabs-integrated {
        padding: 0 0.5rem;
        flex-wrap: nowrap;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }

      .nav-tab {
        padding: 0.65rem 0.85rem;
        font-size: 0.85rem;
      }

      .component-content-wrapper {
        padding: 0;
      }
    }
  `]
})
export class MastersContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @ViewChild('contentContainer', { read: ViewContainerRef }) contentContainer!: ViewContainerRef;

  activeTab = 'company';
  private currentComponentRef: ComponentRef<any> | null = null;
  private routeSubscription?: Subscription;

  masterTabs: MasterTab[] = [
    {
      id: 'company',
      title: 'Company',
      route: '/masters/company'
    },
    {
      id: 'directors',
      title: 'Directors',
      route: '/masters/directors'
    },
    {
      id: 'shareholder',
      title: 'Shareholders',
      route: '/masters/shareholder'
    },
    {
      id: 'share-certificate',
      title: 'Share Certificate',
      route: '/masters/share-certificate'
    },
    {
      id: 'debenture-holder',
      title: 'Debenture Holder',
      route: '/masters/debenture-holder'
    },
    {
      id: 'auditor',
      title: 'Auditor',
      route: '/masters/auditor'
    },
    {
      id: 'agendas',
      title: 'Agendas',
      route: '/masters/agendas'
    },
    {
      id: 'shareholder-management',
      title: 'Shareholder Management',
      route: '/masters/shareholder-management'
    },
    {
      id: 'capital-structure',
      title: 'Capital Structure',
      route: '/masters/capital'
    }
  ];

  ngOnInit() {
    // Check if there's a tab parameter in the route
    const tabParam = this.route.snapshot.queryParams['tab'];
    if (tabParam) {
      const tab = this.masterTabs.find(t => t.id === tabParam);
      if (tab) {
        this.activeTab = tab.id;
      }
    } else {
      // Default to company tab if no tab parameter is provided
      this.activeTab = 'company';
    }

    // Subscribe to route query parameter changes
    this.routeSubscription = this.route.queryParams
      .pipe(filter(params => params['tab']))
      .subscribe(params => {
        const tabParam = params['tab'];
        const tab = this.masterTabs.find(t => t.id === tabParam);
        if (tab && this.activeTab !== tab.id) {
          this.activeTab = tab.id;
          this.loadComponent(tab.id);
        }
      });
  }

  ngAfterViewInit() {
    // Load the initial component after view is initialized
    this.loadComponent(this.activeTab);
  }

  ngOnDestroy() {
    // Clean up subscription
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    
    // Clean up component reference
    if (this.currentComponentRef) {
      this.currentComponentRef.destroy();
      this.currentComponentRef = null;
    }
  }

  getActiveTabTitle(): string {
    const tab = this.masterTabs.find(t => t.id === this.activeTab);
    return tab ? tab.title : '';
  }

  async selectTab(tab: MasterTab) {
    if (this.activeTab === tab.id) return; // Prevent reloading if same tab
    
    this.activeTab = tab.id;
    await this.loadComponent(tab.id);
    
    // Update URL without navigation
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab.id },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  async loadComponent(tabId: string) {
    const tab = this.masterTabs.find(t => t.id === tabId);
    if (!tab || !this.contentContainer) return;

    // Clear existing component first
    if (this.currentComponentRef) {
      this.currentComponentRef.destroy();
      this.currentComponentRef = null;
    }

    // Clear the container
    this.contentContainer.clear();

    try {
      let componentClass: any;

      switch (tabId) {
        case 'company':
          const companyModule = await import('./company.component');
          componentClass = companyModule.CompanyMasterComponent;
          break;
        case 'directors':
          const directorsModule = await import('./directors.component');
          componentClass = directorsModule.DirectorsMasterComponent;
          break;
        case 'shareholder':
          const shareholderModule = await import('./shareholder.component');
          componentClass = shareholderModule.ShareholderMasterComponent;
          break;
        case 'share-certificate':
          const shareCertModule = await import('./share-certificate.component');
          componentClass = shareCertModule.ShareCertificateComponent;
          break;
        case 'debenture-holder':
          const debentureModule = await import('./debenture-holder.component');
          componentClass = debentureModule.DebentureHolderComponent;
          break;
        case 'auditor':
          const auditorModule = await import('./auditor.component');
          componentClass = auditorModule.AuditorComponent;
          break;
        case 'agendas':
          const agendasModule = await import('./agendas.component');
          componentClass = agendasModule.AgendasComponent;
          break;
        case 'shareholder-management':
          const shareholderMgmtModule = await import('./shareholder-management.component');
          componentClass = shareholderMgmtModule.ShareholderManagementComponent;
          break;
        case 'capital-structure':
          const capitalModule = await import('./capital/capital-structure.component');
          componentClass = capitalModule.CapitalStructureComponent;
          break;
      }

      if (componentClass && this.contentContainer) {
        this.currentComponentRef = this.contentContainer.createComponent(componentClass);
      }
    } catch (error) {
      console.error(`Error loading component for tab ${tabId}:`, error);
    }
  }
}
