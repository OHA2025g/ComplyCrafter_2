import { Component, OnInit, AfterViewInit, inject, ViewContainerRef, ComponentRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

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
export class CapitalStructureComponent implements OnInit, AfterViewInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @ViewChild('contentContainer', { read: ViewContainerRef }) contentContainer!: ViewContainerRef;

  activeTab = 'authorized';
  private currentComponentRef: ComponentRef<any> | null = null;

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
    const tabParam = this.route.snapshot.queryParams['capitalTab'];
    if (tabParam) {
      const tab = this.capitalTabs.find(t => t.id === tabParam);
      if (tab) {
        this.activeTab = tab.id;
      }
    }
  }

  ngAfterViewInit() {
    this.loadComponent(this.activeTab);
  }

  async selectTab(tab: CapitalTab) {
    this.activeTab = tab.id;
    await this.loadComponent(tab.id);
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { capitalTab: tab.id },
      queryParamsHandling: 'merge'
    });
  }

  async loadComponent(tabId: string) {
    const tab = this.capitalTabs.find(t => t.id === tabId);
    if (!tab) return;

    if (this.currentComponentRef) {
      this.currentComponentRef.destroy();
      this.currentComponentRef = null;
    }

    if (this.contentContainer) {
      this.contentContainer.clear();
    }

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
      }

      if (componentClass && this.contentContainer) {
        this.currentComponentRef = this.contentContainer.createComponent(componentClass);
      }
    } catch (error) {
      console.error(`Error loading capital component for tab ${tabId}:`, error);
    }
  }
}

