import { Component, OnInit, AfterViewInit, inject, ViewContainerRef, ComponentRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

interface FormCategoryTab {
  id: string;
  title: string;
  route: string;
  category: string;
}

@Component({
  selector: 'app-forms-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="forms-container-wrapper">
      <!-- Tab Navigation Card -->
      <div class="forms-tabs-card">
        <div class="nav-tabs-integrated">
          <button
            *ngFor="let tab of formCategoryTabs"
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
    .forms-container-wrapper {
      padding: 1rem 1.5rem;
      max-width: 100%;
      margin: 0 auto;
      background: #f5f5f5;
      min-height: calc(100vh - 60px);
    }

    .card-title {
      font-size: 1rem;
      color: #6974dc;
      margin: 0 0 0.75rem 0;
      padding: 4px;
      font-family: Arial, sans-serif;
    }

    .forms-tabs-card {
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
      .forms-container-wrapper {
        padding: 0.75rem 1rem;
      }

      .nav-tabs-integrated {
        padding: 0 0.5rem;
        flex-wrap: nowrap;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }

      .nav-tab {
        padding: 0.6rem 0.75rem;
        font-size: 0.85rem;
      }
    }
  `]
})
export class FormsContainerComponent implements OnInit, AfterViewInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @ViewChild('contentContainer', { read: ViewContainerRef }) contentContainer!: ViewContainerRef;

  activeTab = 'all';
  private currentComponentRef: ComponentRef<any> | null = null;

  formCategoryTabs: FormCategoryTab[] = [
    { id: 'all', title: 'All Forms', route: '/forms?tab=all', category: 'All' },
    { id: 'charge', title: 'Charge Related', route: '/forms?tab=charge', category: 'Charge related forms' },
    { id: 'deposit', title: 'Deposit Related', route: '/forms?tab=deposit', category: 'Deposit related forms' },
    { id: 'din', title: 'DIN Related', route: '/forms?tab=din', category: 'DIN related forms' },
    { id: 'nidhi', title: 'Nidhi Services', route: '/forms?tab=nidhi', category: 'Nidhi Services' },
    { id: 'change', title: 'Change Services', route: '/forms?tab=change', category: 'Change Services' },
    { id: 'informational', title: 'Informational Services', route: '/forms?tab=informational', category: 'Informational Services' },
    { id: 'approval-roc', title: 'Approval Services (ROC)', route: '/forms?tab=approval-roc', category: 'Approval Services (ROC)' },
    { id: 'approval-rd', title: 'Approval Services (RD)', route: '/forms?tab=approval-rd', category: 'Approval Services (RD)' },
    { id: 'compliance', title: 'Compliance Services', route: '/forms?tab=compliance', category: 'Compliance Services' },
    { id: 'annual', title: 'Annual Filings', route: '/forms?tab=annual', category: 'Annual Filings' },
    { id: 'incorporation', title: 'Incorporation', route: '/forms?tab=incorporation', category: 'Incorporation' },
    { id: 'iepf', title: 'IEPF Services', route: '/forms?tab=iepf', category: 'IEPF Services' },
    { id: 'llp', title: 'LLP Form', route: '/forms?tab=llp', category: 'LLP Form' }
  ];

  ngOnInit() {
    // Check if there's a tab parameter in the route
    const tabParam = this.route.snapshot.queryParams['tab'];
    if (tabParam) {
      const tab = this.formCategoryTabs.find(t => t.id === tabParam);
      if (tab) {
        this.activeTab = tab.id;
      }
    }
  }

  ngAfterViewInit() {
    // Load the initial component after view is initialized
    this.loadComponent(this.activeTab);
  }

  getActiveTabTitle(): string {
    const tab = this.formCategoryTabs.find(t => t.id === this.activeTab);
    return tab ? tab.title : 'Forms';
  }

  async selectTab(tab: FormCategoryTab) {
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
    const tab = this.formCategoryTabs.find(t => t.id === tabId);
    if (!tab || !this.contentContainer) return;

    // Clear existing component first
    if (this.currentComponentRef) {
      this.currentComponentRef.destroy();
      this.currentComponentRef = null;
    }

    // Clear the container
    this.contentContainer.clear();

    try {
      // Always load FormsListComponent, but pass category as input
      const formsListModule = await import('./forms-list/forms-list.component');
      const componentClass = formsListModule.FormsListComponent;
      
      if (componentClass && this.contentContainer) {
        this.currentComponentRef = this.contentContainer.createComponent(componentClass);
        // Set the selected category on the component
        if (this.currentComponentRef.instance && tab.category !== 'All') {
          this.currentComponentRef.instance.selectedCategory = tab.category;
          this.currentComponentRef.instance.applyFilters();
        }
      }
    } catch (error) {
      console.error(`Error loading component for tab ${tabId}:`, error);
    }
  }
}

