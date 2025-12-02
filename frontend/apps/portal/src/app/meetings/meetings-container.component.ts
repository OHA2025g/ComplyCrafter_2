import { Component, OnInit, AfterViewInit, inject, ViewContainerRef, ComponentRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

interface MeetingTab {
  id: string;
  title: string;
  route: string;
}

@Component({
  selector: 'app-meetings-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="meetings-container">
      <!-- Tab Navigation Card -->
      <div class="meetings-tabs-card">
        <div class="nav-tabs-integrated">
          <button
            *ngFor="let tab of meetingTabs"
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
    .meetings-container {
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

    .meetings-tabs-card {
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
      .meetings-container {
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
export class MeetingsContainerComponent implements OnInit, AfterViewInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @ViewChild('contentContainer', { read: ViewContainerRef }) contentContainer!: ViewContainerRef;

  activeTab = 'board';
  private currentComponentRef: ComponentRef<any> | null = null;

  meetingTabs: MeetingTab[] = [
    { id: 'board', title: 'Board Meeting', route: '/meetings?tab=board' },
    { id: 'agm', title: 'Annual General Meeting', route: '/meetings?tab=agm' },
    { id: 'egm', title: 'Extra Ordinary General Meeting', route: '/meetings?tab=egm' },
    { id: 'committee', title: 'Committee Meeting', route: '/meetings?tab=committee' }
  ];

  ngOnInit() {
    // Check if there's a tab parameter in the route
    const tabParam = this.route.snapshot.queryParams['tab'];
    if (tabParam) {
      const tab = this.meetingTabs.find(t => t.id === tabParam);
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
    const tab = this.meetingTabs.find(t => t.id === this.activeTab);
    return tab ? tab.title : '';
  }

  async selectTab(tab: MeetingTab) {
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
    const tab = this.meetingTabs.find(t => t.id === tabId);
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
        case 'board':
          const boardModule = await import('./board-meeting.component');
          componentClass = boardModule.BoardMeetingComponent;
          break;
        case 'agm':
          const agmModule = await import('./agm.component');
          componentClass = agmModule.AGMComponent;
          break;
        case 'egm':
          const egmModule = await import('./egm.component');
          componentClass = egmModule.EGMComponent;
          break;
        case 'committee':
          const committeeModule = await import('./committee-meeting.component');
          componentClass = committeeModule.CommitteeMeetingComponent;
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

