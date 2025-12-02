import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ShareCapital {
  srNo: number;
  shareClass: string;
  authorizedShares: number;
  paidUpShares: number;
  faceValue: number;
  status: string;
}

@Component({
  selector: 'app-share-capital',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="capital-container">
      <div class="content-card">
        <div class="table-controls">
          <div class="left-controls">
            <select [(ngModel)]="entriesPerPage" class="entries-select"><option [value]="10">10</option></select>
            <span class="entries-label">entries per page</span>
          </div>
          <div class="right-controls">
            <button class="btn-add" (click)="addCapital()">+ Add</button>
            <input type="text" [(ngModel)]="searchTerm" (input)="filterData()" placeholder="Search..." class="search-input" />
          </div>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr><th>Sr No</th><th>Share Class</th><th>Authorized</th><th>Paid-up</th><th>Face Value (₹)</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let capital of getPaginatedData()">
                <td>{{ capital.srNo }}</td>
                <td><span class="class-badge">{{ capital.shareClass }}</span></td>
                <td>{{ capital.authorizedShares | number }}</td>
                <td>{{ capital.paidUpShares | number }}</td>
                <td>{{ capital.faceValue }}</td>
                <td><span class="status-badge">{{ capital.status }}</span></td>
                <td class="action-cell">
                  <button class="action-btn" title="View">👁️</button>
                  <button class="action-btn" title="Edit">✏️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .capital-container { padding: 0; max-width: 100%; margin: 0; animation: fadeInUp 0.5s ease-out; }
    .page-header { background: transparent; border-radius: 0; padding: 0 1rem; margin-bottom: 0.75rem; box-shadow: none; }
    .page-header h1 { font-size: 1.75rem; font-weight: 700; color: #333; margin: 0; }
    .subtitle { color: #6c757d; margin: 0.25rem 0 0 0; font-size: 0.9rem; }
    .content-card { background: transparent; border-radius: 0; padding: 0 1rem; box-shadow: none; }
    .table-controls { display: flex; justify-content: space-between; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.75rem; }
    .left-controls, .right-controls { display: flex; align-items: center; gap: 0.75rem; }
    .entries-select { padding: 0.75rem 1rem; border: none; border-radius: 10px; background: #f8f9fa; }
    .entries-label { color: #6c757d; font-weight: 600; }
    .btn-add { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 0.75rem 1.75rem; border-radius: 12px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); }
    .search-input { padding: 0.75rem 1rem; border: none; border-radius: 10px; background: #f8f9fa; min-width: 200px; }
    .table-wrapper { overflow-x: auto; border-radius: 12px; border: 2px solid #f0f0f0; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table thead { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
    .data-table th { padding: 1rem; text-align: left; font-weight: 700; }
    .data-table tbody tr { background: #ffe5e5; /* Light pink */ }
    .data-table tbody tr:nth-child(even) { background: #e5f0ff; /* Light blue */ }
    .data-table tbody tr:hover { background: linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.12)); transform: scale(1.01); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .data-table td { padding: 1rem; border-bottom: 1px solid #e0e0e0; }
    .class-badge { background: linear-gradient(135deg, #f093fb, #f5576c); color: white; padding: 0.35rem 0.85rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700; }
    .status-badge { background: linear-gradient(135deg, #11998e, #38ef7d); color: white; padding: 0.35rem 0.85rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700; }
    .action-cell { text-align: center; white-space: nowrap; }
    .action-column {
      text-align: center;
      white-space: nowrap;
    }
    .action-column .action-btn {
      display: inline-flex;
      margin: 0 0.25rem;
    }
    .action-btn { background: transparent; border: none; cursor: pointer; font-size: 1.3rem; padding: 0.5rem; border-radius: 8px; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; }
    .action-btn:hover { background: rgba(102, 126, 234, 0.15); transform: scale(1.15); }
  `]
})
export class ShareCapitalComponent implements OnInit {
  capitals: ShareCapital[] = [
    { srNo: 1, shareClass: 'Equity Shares', authorizedShares: 1000000, paidUpShares: 750000, faceValue: 10, status: 'Active' },
    { srNo: 2, shareClass: 'Preference Shares', authorizedShares: 500000, paidUpShares: 250000, faceValue: 100, status: 'Active' }
  ];
  filteredData: ShareCapital[] = [];
  entriesPerPage: number = 10;
  searchTerm: string = '';

  ngOnInit(): void { this.filteredData = [...this.capitals]; }
  filterData(): void {
    this.filteredData = this.searchTerm ? this.capitals.filter(c => c.shareClass.toLowerCase().includes(this.searchTerm.toLowerCase())) : [...this.capitals];
  }
  getPaginatedData(): ShareCapital[] { return this.filteredData; }
  addCapital(): void { alert('Add share capital'); }
}

