import { Component, OnInit, AfterViewInit, AfterViewChecked, OnDestroy, inject, ViewContainerRef, ComponentRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

interface CapitalTab {
  id: string;
  title: string;
  route: string;
}

@Component({
  selector: 'app-capital-structure',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="capital-structure-container">
      <!-- Capital Structure Tabs -->
      <div class="capital-tabs">
        <button
          *ngFor="let tab of capitalTabs"
          class="capital-tab"
          [class.active]="activeTab === tab.id"
          (click)="selectTab(tab)">
          {{ tab.title }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="capital-content-wrapper" #contentContainer></div>
    </div>
  `,
  styles: [`
    .capital-structure-container {
      width: 100%;
    }

    .capital-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 0.5rem;
    }

    .capital-tab {
      background: transparent;
      border: none;
      padding: 0.75rem 1.25rem;
      font-size: 0.9rem;
      font-weight: 600;
      color: #666;
      cursor: pointer;
      transition: all 0.3s;
      border-bottom: 3px solid transparent;
      margin-bottom: -0.5rem;
      white-space: nowrap;
    }

    .capital-tab:hover {
      color: #667eea;
      background: rgba(102, 126, 234, 0.05);
      border-radius: 4px 4px 0 0;
    }

    .capital-tab.active {
      color: #667eea;
      border-bottom-color: #667eea;
    }

    .capital-content-wrapper {
      // min-height: 300px;
    }
  `]
})
export class CapitalStructureComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('contentContainer', { read: ViewContainerRef }) contentContainer!: ViewContainerRef;
  private componentLoaded = false;

  activeTab = 'authorized';
  private currentComponentRef: ComponentRef<any> | null = null;
  private routeSubscription?: Subscription;

  capitalTabs: CapitalTab[] = [
    {
      id: 'authorized',
      title: 'Authorized Capital',
      route: '/masters/capital/authorized'
    },
    {
      id: 'paid-up',
      title: 'Paid-up Capital',
      route: '/masters/capital/paid-up'
    },
    {
      id: 'share',
      title: 'Share Capital',
      route: '/masters/capital/share'
    }
  ];

  ngOnInit() {
    console.log('CapitalStructureComponent ngOnInit - queryParams:', this.route.snapshot.queryParams);
    
    // Check for subTab query param (from sidebar navigation)
    const subTabParam = this.route.snapshot.queryParams['subTab'];
    if (subTabParam) {
      const tab = this.capitalTabs.find(t => t.id === subTabParam);
      if (tab) {
        this.activeTab = tab.id;
        console.log('Set activeTab from subTab param:', this.activeTab);
      }
    } else {
      // Check for capitalTab (legacy support)
      const tabParam = this.route.snapshot.queryParams['capitalTab'];
      if (tabParam) {
        const tab = this.capitalTabs.find(t => t.id === tabParam);
        if (tab) {
          this.activeTab = tab.id;
          console.log('Set activeTab from capitalTab param:', this.activeTab);
        }
      } else {
        // Default to authorized if no param
        this.activeTab = 'authorized';
        console.log('No subTab param found, defaulting to authorized');
      }
    }

    // Subscribe to route query parameter changes
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      console.log('Route query params changed:', params);
      const subTabParam = params['subTab'];
      if (subTabParam) {
        const tab = this.capitalTabs.find(t => t.id === subTabParam);
        if (tab) {
          if (this.activeTab !== tab.id) {
            this.activeTab = tab.id;
            // Wait for contentContainer to be available
            if (this.contentContainer) {
              this.loadComponent(tab.id);
            } else {
              // Retry after a short delay
              setTimeout(() => {
                if (this.contentContainer) {
                  this.loadComponent(tab.id);
                }
              }, 100);
            }
          }
        }
      }
    });
  }

  ngAfterViewInit() {
    // Use requestAnimationFrame to ensure ViewChild is fully initialized
    requestAnimationFrame(() => {
      if (this.contentContainer && !this.componentLoaded) {
        this.loadComponent(this.activeTab);
        this.componentLoaded = true;
      }
    });
  }

  ngAfterViewChecked() {
    // Fallback: if component wasn't loaded in AfterViewInit, try again
    if (this.contentContainer && !this.componentLoaded) {
      this.loadComponent(this.activeTab);
      this.componentLoaded = true;
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.currentComponentRef) {
      this.currentComponentRef.destroy();
    }
  }

  async selectTab(tab: CapitalTab) {
    if (this.activeTab === tab.id) return; // Prevent reloading if same tab
    
    this.activeTab = tab.id;
    await this.loadComponent(tab.id);
    
    // Update URL with subTab query param
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: 'capital-structure', subTab: tab.id },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  async loadComponent(tabId: string) {
    const tab = this.capitalTabs.find(t => t.id === tabId);
    if (!tab) {
      console.warn(`Capital tab not found: ${tabId}`);
      return;
    }

    // Wait for contentContainer to be available
    if (!this.contentContainer) {
      console.warn('ContentContainer not available yet, retrying...');
      setTimeout(() => this.loadComponent(tabId), 100);
      return;
    }

    // Clean up existing component
    if (this.currentComponentRef) {
      this.currentComponentRef.destroy();
      this.currentComponentRef = null;
    }

    // Clear the container
    this.contentContainer.clear();

    try {
      let componentClass: any;

      switch (tabId) {
        case 'authorized':
          const authorizedModule = await import('./authorized-capital.component');
          componentClass = authorizedModule.AuthorizedCapitalComponent;
          break;
        case 'paid-up':
          const paidUpModule = await import('./paid-up-capital.component');
          componentClass = paidUpModule.PaidUpCapitalComponent;
          break;
        case 'share':
          const shareCapitalModule = await import('./share-capital.component');
          componentClass = shareCapitalModule.ShareCapitalComponent;
          break;
        default:
          console.warn(`Unknown tab ID: ${tabId}`);
          return;
      }

      if (componentClass && this.contentContainer) {
        this.currentComponentRef = this.contentContainer.createComponent(componentClass);
        console.log(`Successfully loaded capital component: ${tabId}`);
      } else {
        console.error(`Failed to load component class for tab: ${tabId}`);
      }
    } catch (error) {
      console.error(`Error loading capital component for tab ${tabId}:`, error);
    }
  }
}

