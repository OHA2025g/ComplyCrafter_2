import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Auditor {
  srNo: number;
  firmName: string;
  auditorName: string;
  address: string;
  email: string;
  phoneNo: string;
  type: 'auditor' | 'secretarial' | 'cost' | 'internal';
}

@Component({
  selector: 'app-auditor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auditor-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-actions">
          <button class="btn-outline">✕ Clear Company</button>
          <button class="btn-outline">🔍 Switch Company</button>
        </div>
      </div>

      <!-- Main Content Card -->
      <div class="content-card">
        <!-- Tabs -->
        <div class="tabs-container">
          <div class="tabs">
            <button 
              class="tab-button" 
              [class.active]="activeTab === 'auditor'"
              (click)="switchTab('auditor')">
              Auditors
            </button>
            <button 
              class="tab-button" 
              [class.active]="activeTab === 'secretarial'"
              (click)="switchTab('secretarial')">
              Secretarial Auditors
            </button>
            <button 
              class="tab-button" 
              [class.active]="activeTab === 'cost'"
              (click)="switchTab('cost')">
              Cost Auditors
            </button>
            <button 
              class="tab-button" 
              [class.active]="activeTab === 'internal'"
              (click)="switchTab('internal')">
              Internal Auditors
            </button>
          </div>
          
          <button class="btn-add" (click)="addAuditor()">
            <span class="add-icon">+</span>
            <span>Add</span>
          </button>
        </div>

        <!-- Table Controls -->
        <div class="table-controls">
          <div class="left-controls">
            <select [(ngModel)]="entriesPerPage" (change)="currentPage = 1" class="entries-select">
              <option [value]="10">10</option>
              <option [value]="25">25</option>
              <option [value]="50">50</option>
              <option [value]="100">100</option>
            </select>
            <span class="entries-label">entries per page</span>
          </div>
          
          <div class="right-controls">
            <div class="search-box">
              <label>Search:</label>
              <input 
                type="text" 
                [(ngModel)]="searchTerm"
                (input)="filterData()"
                placeholder=""
                class="search-input"
              />
            </div>
          </div>
        </div>

        <!-- Data Table -->
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Firm Name</th>
                <th>Auditor Name</th>
                <th>Address</th>
                <th>Email</th>
                <th>Phone No</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let auditor of getPaginatedData(); let i = index">
                <td>{{ auditor.srNo }}</td>
                <td>{{ auditor.firmName }}</td>
                <td>{{ auditor.auditorName }}</td>
                <td>{{ auditor.address }}</td>
                <td>{{ auditor.email }}</td>
                <td>{{ auditor.phoneNo }}</td>
                <td class="action-cell">
                  <button class="action-btn view-btn" (click)="viewAuditor(auditor)" title="View">👁️</button>
                  <button class="action-btn edit-btn" (click)="editAuditor(auditor)" title="Edit">✏️</button>
                  <button class="action-btn delete-btn" (click)="deleteAuditor(auditor)" title="Delete">🗑️</button>
                </td>
              </tr>
              <tr *ngIf="getFilteredData().length === 0">
                <td colspan="7" class="no-data">No auditors found</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Table Footer with Pagination -->
        <div class="table-footer">
          <div class="entries-info">
            Showing {{ getStartEntry() }} to {{ getEndEntry() }} of {{ getFilteredData().length }} entries
          </div>
          
          <div class="pagination">
            <button 
              (click)="currentPage = 1" 
              [disabled]="currentPage === 1" 
              class="page-btn"
              title="First Page">
              ⏮️
            </button>
            <button 
              (click)="currentPage = currentPage - 1" 
              [disabled]="currentPage === 1" 
              class="page-btn"
              title="Previous Page">
              ◀
            </button>
            
            <button 
              *ngFor="let page of getVisiblePages()" 
              (click)="currentPage = page"
              [class.active]="page === currentPage"
              class="page-btn page-number">
              {{ page }}
            </button>
            
            <button 
              (click)="currentPage = currentPage + 1" 
              [disabled]="currentPage === getTotalPages()" 
              class="page-btn"
              title="Next Page">
              ▶
            </button>
            <button 
              (click)="currentPage = getTotalPages()" 
              [disabled]="currentPage === getTotalPages()" 
              class="page-btn"
              title="Last Page">
              ⏭️
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .auditor-container {
      padding: 0;
      max-width: 100%;
      margin: 0;
      animation: fadeInUp 0.5s ease-out;
    }

    /* Header Styles */
    .page-header {
      background: transparent;
      border-radius: 0;
      padding: 0 1rem;
      margin-bottom: 0.75rem;
      box-shadow: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-content h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #333;
      margin: 0;
    }

    .subtitle {
      color: #6c757d;
      margin: 0.5rem 0 0 0;
      font-size: 1rem;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .btn-outline {
      background: transparent;
      border: none;
      color: #667eea;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      white-space: nowrap;
    }

    .btn-outline:hover {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    /* Content Card */
    .content-card {
      background: transparent;
      border-radius: 0;
      padding: 0 1rem;
      box-shadow: none;
    }

    /* Tabs Container */
    .tabs-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      gap: 1rem;
      flex-wrap: wrap;
      padding-bottom: 1rem;
      border-bottom: 2px solid #f0f0f0;
    }

    .tabs {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .tab-button {
      background: transparent;
      border: none;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      font-weight: 600;
      color: #6c757d;
      cursor: pointer;
      transition: all 0.3s;
      border-radius: 10px;
      position: relative;
    }

    .tab-button:hover {
      color: #667eea;
      background: rgba(102, 126, 234, 0.08);
    }

    .tab-button.active {
      color: white;
      background: linear-gradient(135deg, #667eea, #764ba2);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .btn-add {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 0.75rem 1.75rem;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      white-space: nowrap;
    }

    .btn-add:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
    }

    .add-icon {
      font-size: 1.3rem;
      font-weight: 700;
    }

    /* Table Controls */
    .table-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .left-controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .entries-select {
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      background: #f8f9fa;
      transition: all 0.3s;
      cursor: pointer;
    }

    .entries-select:focus {
      outline: none;
      background: white;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    .entries-label {
      color: #6c757d;
      font-weight: 600;
    }

    .right-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .search-box label {
      font-weight: 600;
      color: #2c3e50;
      white-space: nowrap;
    }

    .search-input {
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      background: #f8f9fa;
      transition: all 0.3s;
      min-width: 200px;
    }

    .search-input:focus {
      outline: none;
      background: white;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    /* Table Styles */
    .table-wrapper {
      overflow-x: auto;
      margin-bottom: 1.5rem;
      border-radius: 12px;
      border: 2px solid #f0f0f0;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table thead {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    .data-table th {
      padding: 1rem;
      text-align: left;
      font-weight: 700;
      font-size: 0.95rem;
      white-space: nowrap;
    }

    .data-table tbody tr {
      transition: all 0.2s;
      background: #ffe5e5; /* Light pink */
    }

    .data-table tbody tr:nth-child(even) {
      background: #e5f0ff; /* Light blue */
    }

    .data-table tbody tr:hover {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.12));
      transform: scale(1.01);
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .data-table td {
      padding: 1rem;
      border-bottom: 1px solid #e0e0e0;
      font-size: 0.95rem;
      color: #2c3e50;
    }

    .action-cell {
      text-align: center;
      white-space: nowrap;
    }

    .action-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 1.3rem;
      padding: 0.5rem;
      border-radius: 8px;
      transition: all 0.2s;
      margin: 0 0.15rem;
    }

    .action-btn:hover {
      transform: scale(1.15);
    }

    .view-btn:hover {
      background: rgba(52, 152, 219, 0.15);
    }

    .edit-btn:hover {
      background: rgba(46, 204, 113, 0.15);
    }

    .delete-btn:hover {
      background: rgba(231, 76, 60, 0.15);
    }

    .no-data {
      text-align: center;
      padding: 3rem !important;
      color: #6c757d;
      font-style: italic;
      font-size: 1.1rem;
    }

    /* Table Footer */
    .table-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 2px solid #f0f0f0;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .entries-info {
      color: #6c757d;
      font-size: 0.95rem;
      font-weight: 600;
    }

    /* Pagination */
    .pagination {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .page-btn {
      padding: 0.5rem 0.85rem;
      border: 2px solid #e0e0e0;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      color: #667eea;
      transition: all 0.2s;
      min-width: 38px;
      text-align: center;
    }

    .page-btn:hover:not(:disabled) {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border-color: transparent;
      transform: translateY(-1px);
    }

    .page-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .page-btn.active {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border-color: transparent;
    }

    .page-number {
      min-width: 42px;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .header-actions {
        width: 100%;
        justify-content: flex-start;
      }

      .tabs-container {
        flex-direction: column;
        align-items: flex-start;
      }

      .tabs {
        width: 100%;
      }

      .btn-add {
        width: 100%;
        justify-content: center;
      }

      .table-controls {
        flex-direction: column;
        align-items: flex-start;
      }

      .right-controls {
        width: 100%;
      }

      .search-input {
        flex: 1;
      }
    }

    @media (max-width: 768px) {
      .auditor-container {
        padding: 1rem;
      }

      .page-header {
        padding: 1.5rem;
      }

      .header-content h1 {
        font-size: 1.8rem;
      }

      .content-card {
        padding: 1.5rem;
      }

      .table-wrapper {
        overflow-x: scroll;
      }

      .data-table th,
      .data-table td {
        padding: 0.75rem;
        font-size: 0.85rem;
      }

      .tab-button {
        padding: 0.6rem 1rem;
        font-size: 0.9rem;
      }
    }
  `]
})
export class AuditorComponent implements OnInit {
  activeTab: 'auditor' | 'secretarial' | 'cost' | 'internal' = 'auditor';
  
  // Sample Data matching the image
  allAuditors: Auditor[] = [
    // Auditors Tab
    {
      srNo: 1,
      firmName: 'Auditor 1',
      auditorName: 'partners 1 name',
      address: 'address',
      email: 'firmEmail',
      phoneNo: 'partners 1 mobile',
      type: 'auditor'
    },
    {
      srNo: 2,
      firmName: 'Auditor 2',
      auditorName: 'partners 2 name',
      address: 'address 2',
      email: 'firmEmai 21',
      phoneNo: 'partners 2 mobile',
      type: 'auditor'
    },
    {
      srNo: 3,
      firmName: 'Fk Firm',
      auditorName: 'fk proprieto name',
      address: 'fk address',
      email: 'fkemail@gmail.com',
      phoneNo: 'fk proprieto number',
      type: 'auditor'
    },
    // Secretarial Auditors Tab (sample data)
    {
      srNo: 1,
      firmName: 'Secretarial Firm A',
      auditorName: 'Secretarial Partner A',
      address: 'Secretarial Address A',
      email: 'secretarial.a@example.com',
      phoneNo: '9876543210',
      type: 'secretarial'
    },
    // Cost Auditors Tab (sample data)
    {
      srNo: 1,
      firmName: 'Cost Audit Firm B',
      auditorName: 'Cost Auditor B',
      address: 'Cost Address B',
      email: 'cost.b@example.com',
      phoneNo: '8765432109',
      type: 'cost'
    },
    // Internal Auditors Tab (sample data)
    {
      srNo: 1,
      firmName: 'Internal Audit Firm C',
      auditorName: 'Internal Auditor C',
      address: 'Internal Address C',
      email: 'internal.c@example.com',
      phoneNo: '7654321098',
      type: 'internal'
    }
  ];

  filteredData: Auditor[] = [];
  entriesPerPage: number = 10;
  currentPage: number = 1;
  searchTerm: string = '';

  ngOnInit(): void {
    this.filterDataByTab();
  }

  switchTab(tab: 'auditor' | 'secretarial' | 'cost' | 'internal'): void {
    this.activeTab = tab;
    this.searchTerm = '';
    this.currentPage = 1;
    this.filterDataByTab();
  }

  filterDataByTab(): void {
    this.filteredData = this.allAuditors.filter(a => a.type === this.activeTab);
  }

  filterData(): void {
    let filtered = this.allAuditors.filter(a => a.type === this.activeTab);
    
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(auditor =>
        auditor.firmName.toLowerCase().includes(term) ||
        auditor.auditorName.toLowerCase().includes(term) ||
        auditor.address.toLowerCase().includes(term) ||
        auditor.email.toLowerCase().includes(term) ||
        auditor.phoneNo.toLowerCase().includes(term) ||
        auditor.srNo.toString().includes(term)
      );
    }
    
    this.filteredData = filtered;
    this.currentPage = 1; // Reset to first page after filtering
  }

  getFilteredData(): Auditor[] {
    return this.filteredData;
  }

  getPaginatedData(): Auditor[] {
    const start = (this.currentPage - 1) * this.entriesPerPage;
    const end = start + this.entriesPerPage;
    return this.filteredData.slice(start, end);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredData.length / this.entriesPerPage) || 1;
  }

  getVisiblePages(): number[] {
    const total = this.getTotalPages();
    const current = this.currentPage;
    const pages: number[] = [];
    
    // Show up to 5 page numbers at a time
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);
    
    // Adjust start if we're near the end
    start = Math.max(1, end - 4);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getStartEntry(): number {
    if (this.filteredData.length === 0) return 0;
    return (this.currentPage - 1) * this.entriesPerPage + 1;
  }

  getEndEntry(): number {
    const end = this.currentPage * this.entriesPerPage;
    return Math.min(end, this.filteredData.length);
  }

  // Action Methods
  addAuditor(): void {
    const tabName = this.getTabDisplayName();
    alert(`Add new ${tabName}\n\nThis will open a form to add a new ${tabName.toLowerCase()}.`);
    console.log('Add auditor clicked for tab:', this.activeTab);
  }

  viewAuditor(auditor: Auditor): void {
    alert(`View Auditor Details\n\nFirm Name: ${auditor.firmName}\nAuditor Name: ${auditor.auditorName}\nAddress: ${auditor.address}\nEmail: ${auditor.email}\nPhone: ${auditor.phoneNo}`);
    console.log('View auditor:', auditor);
  }

  editAuditor(auditor: Auditor): void {
    alert(`Edit Auditor: ${auditor.firmName}\n\nThis will open an edit form.`);
    console.log('Edit auditor:', auditor);
  }

  deleteAuditor(auditor: Auditor): void {
    if (confirm(`Are you sure you want to delete "${auditor.firmName}"?`)) {
      const index = this.allAuditors.findIndex(a => 
        a.srNo === auditor.srNo && a.type === auditor.type
      );
      if (index > -1) {
        this.allAuditors.splice(index, 1);
        this.filterDataByTab();
        console.log('Deleted auditor:', auditor);
      }
    }
  }

  getTabDisplayName(): string {
    switch (this.activeTab) {
      case 'auditor': return 'Auditor';
      case 'secretarial': return 'Secretarial Auditor';
      case 'cost': return 'Cost Auditor';
      case 'internal': return 'Internal Auditor';
    }
  }
}

