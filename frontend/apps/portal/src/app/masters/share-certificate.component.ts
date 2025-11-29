import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface PhysicalCertificate {
  certNo: number;
  certificateIssuedTo: string;
  folioNo: string;
  noOfShares: number;
  distinctiveNo: string;
  presentShareholder: string;
  remark: string;
  certificateType: 'split' | 'issued_lieu' | 'consolidated' | 'jumbo' | 'duplicate';
}

interface DematCertificate {
  srNo: number;
  shareholderName: string;
  dpId: string;
  noOfShares: number;
  distinctiveNo: string;
  presentShareholder: string;
  remark: string;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-share-certificate',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="share-certificate-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-actions">
          <button class="btn-outline">✕ Clear Company</button>
          <button class="btn-outline">🔍 Switch Company</button>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="tabs-container">
        <div class="tabs">
          <button 
            class="tab-button" 
            [class.active]="activeTab === 'physical'"
            (click)="activeTab = 'physical'">
            Physical
          </button>
          <button 
            class="tab-button" 
            [class.active]="activeTab === 'demat'"
            (click)="activeTab = 'demat'">
            Demat
          </button>
        </div>
      </div>

      <!-- Physical Tab Content -->
      <div class="tab-content" *ngIf="activeTab === 'physical'">
        <div class="content-card">
          <div class="section-title">PARTICULARS OF SHARE CERTIFICATE</div>
          
          <!-- Filters Row -->
          <div class="filters-row">
            <div class="filter-group">
              <label>Type of Share Certificate:</label>
              <select [(ngModel)]="physicalShareType" class="filter-select">
                <option value="equity">Equity Shares</option>
                <option value="preference">Preference Shares</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label>Category of Share Certificate:</label>
              <select [(ngModel)]="physicalCategory" class="filter-select">
                <option value="all">All Certificate</option>
                <option value="split">Split Certificates</option>
                <option value="issued_lieu">Issued in Lieu of split</option>
                <option value="consolidated">Consolidated Certificates</option>
                <option value="jumbo">Jumbo Certificate</option>
                <option value="duplicate">Duplicate Certificate</option>
              </select>
            </div>
          </div>

          <!-- Table Controls -->
          <div class="table-controls">
            <div class="left-controls">
              <select [(ngModel)]="physicalEntriesPerPage" (change)="physicalCurrentPage = 1" class="entries-select">
                <option [value]="10">10 entries per page</option>
                <option [value]="25">25 entries per page</option>
                <option [value]="50">50 entries per page</option>
                <option [value]="100">100 entries per page</option>
              </select>
            </div>
            
            <div class="right-controls">
              <button class="btn-action btn-primary">💰 Stamp Duty</button>
              <button class="btn-action btn-primary">📥 Bulk Download Certificate</button>
              <div class="search-box">
                <label>Search:</label>
                <input 
                  type="text" 
                  [(ngModel)]="physicalSearchTerm"
                  placeholder="Search certificates..."
                  class="search-input"
                />
              </div>
            </div>
          </div>

          <!-- Physical Certificates Table -->
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Cert. No.</th>
                  <th>Certificate issued to</th>
                  <th>Folio No.</th>
                  <th>No. of Shares</th>
                  <th>Distinctive No.</th>
                  <th>Present Shareholder</th>
                  <th>Remark</th>
                  <th>Action</th>
                  <th>View/Download</th>
                  <th>Upload</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let cert of getFilteredPhysicalCertificates(); let i = index" 
                    [class.cert-type-split]="cert.certificateType === 'split'"
                    [class.cert-type-issued-lieu]="cert.certificateType === 'issued_lieu'"
                    [class.cert-type-consolidated]="cert.certificateType === 'consolidated'"
                    [class.cert-type-jumbo]="cert.certificateType === 'jumbo'"
                    [class.cert-type-duplicate]="cert.certificateType === 'duplicate'">
                  <td>{{ cert.certNo }}</td>
                  <td>{{ cert.certificateIssuedTo }}</td>
                  <td>{{ cert.folioNo }}</td>
                  <td>{{ cert.noOfShares }}</td>
                  <td>{{ cert.distinctiveNo }}</td>
                  <td>{{ cert.presentShareholder }}</td>
                  <td>{{ cert.remark }}</td>
                  <td class="action-cell">
                    <button class="action-btn" (click)="editPhysicalCert(cert)" title="Edit">✏️</button>
                    <button class="action-btn" (click)="deletePhysicalCert(cert)" title="Delete">🗑️</button>
                  </td>
                  <td class="action-cell">
                    <button class="action-btn" (click)="viewPhysicalCert(cert)" title="View">👁️</button>
                    <button class="action-btn" (click)="downloadPhysicalCert(cert)" title="Download">📥</button>
                  </td>
                  <td class="action-cell">
                    <button class="action-btn" (click)="uploadPhysicalCert(cert)" title="Upload">📤</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Legend -->
          <div class="legend">
            <div class="legend-item">
              <span class="legend-color cert-type-split"></span>
              <span>Split Certificates</span>
            </div>
            <div class="legend-item">
              <span class="legend-color cert-type-issued-lieu"></span>
              <span>Issued in Lieu of split</span>
            </div>
            <div class="legend-item">
              <span class="legend-color cert-type-consolidated"></span>
              <span>Consolidated Certificates</span>
            </div>
            <div class="legend-item">
              <span class="legend-color cert-type-jumbo"></span>
              <span>Jumbo Certificate</span>
            </div>
            <div class="legend-item">
              <span class="legend-color cert-type-duplicate"></span>
              <span>Duplicate Certificate</span>
            </div>
          </div>

          <!-- Table Footer -->
          <div class="table-footer">
            <div class="entries-info">
              Showing {{ getPhysicalStartEntry() }} to {{ getPhysicalEndEntry() }} of {{ getFilteredPhysicalCertificates().length }} entries
            </div>
            <div class="pagination">
              <button (click)="physicalCurrentPage = 1" [disabled]="physicalCurrentPage === 1" class="page-btn">⏮️</button>
              <button (click)="physicalCurrentPage = physicalCurrentPage - 1" [disabled]="physicalCurrentPage === 1" class="page-btn">◀</button>
              <button *ngFor="let page of getPhysicalVisiblePages()" 
                      (click)="physicalCurrentPage = page"
                      [class.active]="page === physicalCurrentPage"
                      class="page-btn">
                {{ page }}
              </button>
              <button (click)="physicalCurrentPage = physicalCurrentPage + 1" [disabled]="physicalCurrentPage === getPhysicalTotalPages()" class="page-btn">▶</button>
              <button (click)="physicalCurrentPage = getPhysicalTotalPages()" [disabled]="physicalCurrentPage === getPhysicalTotalPages()" class="page-btn">⏭️</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Demat Tab Content -->
      <div class="tab-content" *ngIf="activeTab === 'demat'">
        <div class="content-card">
          <div class="section-title">PARTICULARS OF DISTINCTIVE NO.</div>
          
          <!-- Filters Row -->
          <div class="filters-row">
            <div class="filter-group">
              <label>Type of Share:</label>
              <select [(ngModel)]="dematShareType" class="filter-select">
                <option value="equity">Equity Shares</option>
                <option value="preference">Preference Shares</option>
              </select>
            </div>
          </div>

          <!-- Table Controls -->
          <div class="table-controls">
            <div class="left-controls">
              <select [(ngModel)]="dematEntriesPerPage" (change)="dematCurrentPage = 1" class="entries-select">
                <option [value]="10">10 entries per page</option>
                <option [value]="25">25 entries per page</option>
                <option [value]="50">50 entries per page</option>
                <option [value]="100">100 entries per page</option>
              </select>
            </div>
            
            <div class="right-controls">
              <div class="search-box">
                <label>Search:</label>
                <input 
                  type="text" 
                  [(ngModel)]="dematSearchTerm"
                  placeholder="Search..."
                  class="search-input"
                />
              </div>
            </div>
          </div>

          <!-- Demat Certificates Table -->
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Shareholder Name</th>
                  <th>DP ID</th>
                  <th>No. of Shares</th>
                  <th>Distinctive No.</th>
                  <th>Present Shareholder</th>
                  <th>Remark</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let cert of getFilteredDematCertificates(); let i = index">
                  <td>{{ cert.srNo }}</td>
                  <td>{{ cert.shareholderName }}</td>
                  <td>{{ cert.dpId }}</td>
                  <td>{{ cert.noOfShares }}</td>
                  <td>{{ cert.distinctiveNo }}</td>
                  <td>{{ cert.presentShareholder }}</td>
                  <td>
                    <span class="status-badge" [class.status-active]="cert.status === 'active'" [class.status-inactive]="cert.status === 'inactive'">
                      {{ cert.remark }}
                    </span>
                  </td>
                  <td class="action-cell">
                    <button class="action-btn" (click)="viewDematCert(cert)" title="View">👁️</button>
                    <button class="action-btn" (click)="deleteDematCert(cert)" title="Delete">🗑️</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Table Footer -->
          <div class="table-footer">
            <div class="entries-info">
              Showing {{ getDematStartEntry() }} to {{ getDematEndEntry() }} of {{ getFilteredDematCertificates().length }} entries
            </div>
            <div class="pagination">
              <button (click)="dematCurrentPage = 1" [disabled]="dematCurrentPage === 1" class="page-btn">⏮️</button>
              <button (click)="dematCurrentPage = dematCurrentPage - 1" [disabled]="dematCurrentPage === 1" class="page-btn">◀</button>
              <button *ngFor="let page of getDematVisiblePages()" 
                      (click)="dematCurrentPage = page"
                      [class.active]="page === dematCurrentPage"
                      class="page-btn">
                {{ page }}
              </button>
              <button (click)="dematCurrentPage = dematCurrentPage + 1" [disabled]="dematCurrentPage === getDematTotalPages()" class="page-btn">▶</button>
              <button (click)="dematCurrentPage = getDematTotalPages()" [disabled]="dematCurrentPage === getDematTotalPages()" class="page-btn">⏭️</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    
    .share-certificate-container { padding: 0; max-width: 100%; margin: 0; animation: fadeInUp 0.5s ease-out; }
    
    .page-header { background: transparent; border-radius: 0; padding: 0 1rem; margin-bottom: 0.75rem; box-shadow: none; display: flex; justify-content: space-between; align-items: center; }
    .header-content h1 { font-size: 1.75rem; font-weight: 700; color: #333; margin: 0; }
    .subtitle { color: #6c757d; margin: 0.5rem 0 0 0; font-size: 1rem; }
    .header-actions { display: flex; gap: 1rem; }
    
    .btn-outline { background: transparent; border: none; color: #667eea; padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s; white-space: nowrap; }
    .btn-outline:hover { background: linear-gradient(135deg, #667eea, #764ba2); color: white; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); }
    
    .tabs-container { margin-bottom: 2rem; }
    .tabs { display: flex; gap: 0.5rem; border-bottom: 3px solid #f0f0f0; }
    .tab-button { background: transparent; border: none; padding: 1rem 2rem; font-size: 1.1rem; font-weight: 600; color: #6c757d; cursor: pointer; transition: all 0.3s; border-bottom: 3px solid transparent; margin-bottom: -3px; position: relative; }
    .tab-button:hover { color: #667eea; }
    .tab-button.active { color: #667eea; border-bottom-color: #667eea; background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05)); }
    
    .tab-content { animation: fadeInUp 0.4s ease-out; }
    .content-card { background: transparent; border-radius: 0; padding: 0 1rem; box-shadow: none; }
    .section-title { font-size: 1.4rem; font-weight: 700; color: #2c3e50; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid #f0f0f0; }
    
    .filters-row { display: flex; gap: 2rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .filter-group { display: flex; align-items: center; gap: 0.75rem; }
    .filter-group label { font-weight: 600; color: #2c3e50; white-space: nowrap; }
    .filter-select { padding: 0.75rem 1rem; border: none; border-radius: 10px; font-size: 1rem; background: #f8f9fa; transition: all 0.3s; min-width: 200px; }
    .filter-select:focus { outline: none; background: white; box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1); }
    
    .table-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap; }
    .left-controls, .right-controls { display: flex; align-items: center; gap: 1rem; }
    .entries-select { padding: 0.75rem 1rem; border: none; border-radius: 10px; font-size: 0.95rem; background: #f8f9fa; transition: all 0.3s; }
    .entries-select:focus { outline: none; background: white; box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1); }
    
    .btn-action { padding: 0.75rem 1.5rem; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s; white-space: nowrap; }
    .btn-primary { background: linear-gradient(135deg, #667eea, #764ba2); color: white; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4); }
    
    .search-box { display: flex; align-items: center; gap: 0.5rem; }
    .search-box label { font-weight: 600; color: #2c3e50; }
    .search-input { padding: 0.75rem 1rem; border: none; border-radius: 10px; font-size: 1rem; background: #f8f9fa; transition: all 0.3s; min-width: 200px; }
    .search-input:focus { outline: none; background: white; box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1); }
    
    .table-wrapper { overflow-x: auto; margin-bottom: 1.5rem; border-radius: 8px; border: 1px solid #e0e0e0; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); }
    .data-table { width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden; }
    .data-table thead { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    .data-table th { padding: 1rem; text-align: left; font-weight: 700; font-size: 0.95rem; white-space: nowrap; border-bottom: 2px solid rgba(255, 255, 255, 0.2); }
    .data-table tbody tr { transition: all 0.2s; background: #ffe5e5; /* Light pink */ }
    .data-table tbody tr:nth-child(even) { background: #e5f0ff; /* Light blue */ }
    .data-table tbody tr:hover { background: linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.12)); transform: scale(1.01); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .data-table td { padding: 1rem; border-bottom: 1px solid rgba(0, 0, 0, 0.05); font-size: 0.95rem; color: #333; }
    
    /* Certificate Type Colors */
    .cert-type-split { background: rgba(255, 82, 82, 0.15) !important; }
    .cert-type-split:hover { background: rgba(255, 82, 82, 0.25) !important; }
    .cert-type-issued-lieu { background: rgba(52, 152, 219, 0.15) !important; }
    .cert-type-issued-lieu:hover { background: rgba(52, 152, 219, 0.25) !important; }
    .cert-type-consolidated { background: rgba(149, 165, 166, 0.15) !important; }
    .cert-type-consolidated:hover { background: rgba(149, 165, 166, 0.25) !important; }
    .cert-type-jumbo { background: rgba(46, 204, 113, 0.15) !important; }
    .cert-type-jumbo:hover { background: rgba(46, 204, 113, 0.25) !important; }
    .cert-type-duplicate { background: rgba(155, 89, 182, 0.15) !important; }
    .cert-type-duplicate:hover { background: rgba(155, 89, 182, 0.25) !important; }
    
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
    .action-btn:hover { background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15)); transform: scale(1.15); }
    
    .status-badge { padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700; }
    .status-active { background: linear-gradient(135deg, #11998e, #38ef7d); color: white; }
    .status-inactive { background: linear-gradient(135deg, #f093fb, #f5576c); color: white; }
    
    .legend { display: flex; gap: 1.5rem; padding: 1rem; background: #f8f9fa; border-radius: 12px; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .legend-item { display: flex; align-items: center; gap: 0.5rem; }
    .legend-color { width: 40px; height: 20px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .legend-color.cert-type-split { background: rgba(255, 82, 82, 0.6); }
    .legend-color.cert-type-issued-lieu { background: rgba(52, 152, 219, 0.6); }
    .legend-color.cert-type-consolidated { background: rgba(149, 165, 166, 0.6); }
    .legend-color.cert-type-jumbo { background: rgba(46, 204, 113, 0.6); }
    .legend-color.cert-type-duplicate { background: rgba(155, 89, 182, 0.6); }
    
    .table-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 2px solid #f0f0f0; }
    .entries-info { color: #6c757d; font-size: 0.95rem; font-weight: 600; }
    
    .pagination { display: flex; gap: 0.5rem; }
    .page-btn { padding: 0.5rem 0.85rem; border: none; background: white; border-radius: 8px; cursor: pointer; font-size: 0.9rem; font-weight: 600; color: #667eea; transition: all 0.2s; }
    .page-btn:hover:not(:disabled) { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-color: transparent; transform: translateY(-1px); }
    .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .page-btn.active { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-color: transparent; }
    
    @media (max-width: 1024px) { .page-header { flex-direction: column; align-items: flex-start; } .header-actions { width: 100%; justify-content: flex-start; } .table-controls { flex-direction: column; align-items: flex-start; } .right-controls { width: 100%; } }
  `]
})
export class ShareCertificateComponent implements OnInit {
  activeTab: 'physical' | 'demat' = 'physical';
  
  // Physical Certificate Data
  physicalCertificates: PhysicalCertificate[] = [
    {
      certNo: 1,
      certificateIssuedTo: 'Mr Kiran Premchand Shah',
      folioNo: '01',
      noOfShares: 5000,
      distinctiveNo: '1-5000',
      presentShareholder: 'Mr Kiran Premchand Shah',
      remark: 'Split Certificates',
      certificateType: 'split'
    },
    {
      certNo: 2,
      certificateIssuedTo: 'Siddharth Ravi Prakash Singh',
      folioNo: '02',
      noOfShares: 5000,
      distinctiveNo: '5001-10000',
      presentShareholder: 'Siddharth Ravi Prakash Singh',
      remark: 'Split Certificates',
      certificateType: 'split'
    },
    {
      certNo: 3,
      certificateIssuedTo: 'Mr Kiran Premchand Shah',
      folioNo: '01',
      noOfShares: 4850,
      distinctiveNo: '1-4850',
      presentShareholder: 'Mr Kiran Premchand Shah',
      remark: 'Issued in Lieu of split',
      certificateType: 'issued_lieu'
    },
    {
      certNo: 4,
      certificateIssuedTo: 'Mr Ajit Munnalal Vishwakarma',
      folioNo: '01',
      noOfShares: 150,
      distinctiveNo: '4851-5000',
      presentShareholder: 'Mr Ajit Munnalal Vishwakarma',
      remark: 'Issued in Lieu of split',
      certificateType: 'issued_lieu'
    },
    {
      certNo: 5,
      certificateIssuedTo: 'Siddharth Ravi Prakash Singh',
      folioNo: '02',
      noOfShares: 4850,
      distinctiveNo: '5001-9850',
      presentShareholder: 'Siddharth Ravi Prakash Singh',
      remark: 'Issued in Lieu of split',
      certificateType: 'issued_lieu'
    },
    {
      certNo: 6,
      certificateIssuedTo: 'Mr Ajit Munnalal Vishwakarma',
      folioNo: '02',
      noOfShares: 150,
      distinctiveNo: '9851-10000',
      presentShareholder: 'Mr Ajit Munnalal Vishwakarma',
      remark: 'Issued in Lieu of split',
      certificateType: 'issued_lieu'
    }
  ];
  
  physicalShareType = 'equity';
  physicalCategory = 'all';
  physicalEntriesPerPage = 10;
  physicalCurrentPage = 1;
  physicalSearchTerm = '';
  
  // Demat Certificate Data
  dematCertificates: DematCertificate[] = [
    {
      srNo: 1,
      shareholderName: 'Alice Johnson',
      dpId: 'DP001',
      noOfShares: 500,
      distinctiveNo: '2001-2500',
      presentShareholder: 'Alice Johnson',
      remark: 'Active',
      status: 'active'
    },
    {
      srNo: 2,
      shareholderName: 'Bob Williams',
      dpId: 'DP002',
      noOfShares: 300,
      distinctiveNo: '2501-2800',
      presentShareholder: 'Bob Williams',
      remark: 'Inactive',
      status: 'inactive'
    }
  ];
  
  dematShareType = 'equity';
  dematEntriesPerPage = 10;
  dematCurrentPage = 1;
  dematSearchTerm = '';

  ngOnInit(): void {
    console.log('Share Certificate component initialized');
  }

  // Physical Certificate Methods
  getFilteredPhysicalCertificates(): PhysicalCertificate[] {
    let filtered = [...this.physicalCertificates];
    
    // Apply category filter
    if (this.physicalCategory !== 'all') {
      filtered = filtered.filter(cert => cert.certificateType === this.physicalCategory);
    }
    
    // Apply search filter
    if (this.physicalSearchTerm) {
      const term = this.physicalSearchTerm.toLowerCase();
      filtered = filtered.filter(cert =>
        cert.certificateIssuedTo.toLowerCase().includes(term) ||
        cert.presentShareholder.toLowerCase().includes(term) ||
        cert.folioNo.toLowerCase().includes(term) ||
        cert.distinctiveNo.toLowerCase().includes(term) ||
        cert.remark.toLowerCase().includes(term) ||
        cert.certNo.toString().includes(term)
      );
    }
    
    return filtered;
  }

  getPhysicalTotalPages(): number {
    return Math.ceil(this.getFilteredPhysicalCertificates().length / this.physicalEntriesPerPage) || 1;
  }

  getPhysicalVisiblePages(): number[] {
    const total = this.getPhysicalTotalPages();
    const current = this.physicalCurrentPage;
    const pages: number[] = [];
    
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);
    start = Math.max(1, end - 4);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  getPhysicalStartEntry(): number {
    return (this.physicalCurrentPage - 1) * this.physicalEntriesPerPage + 1;
  }

  getPhysicalEndEntry(): number {
    return Math.min(this.physicalCurrentPage * this.physicalEntriesPerPage, this.getFilteredPhysicalCertificates().length);
  }

  editPhysicalCert(cert: PhysicalCertificate): void {
    alert(`Edit Certificate No: ${cert.certNo}`);
  }

  deletePhysicalCert(cert: PhysicalCertificate): void {
    if (confirm(`Delete Certificate No: ${cert.certNo}?`)) {
      console.log('Deleting certificate:', cert);
    }
  }

  viewPhysicalCert(cert: PhysicalCertificate): void {
    alert(`View Certificate No: ${cert.certNo}\nIssued to: ${cert.certificateIssuedTo}`);
  }

  downloadPhysicalCert(cert: PhysicalCertificate): void {
    alert(`Downloading Certificate No: ${cert.certNo}`);
  }

  uploadPhysicalCert(cert: PhysicalCertificate): void {
    alert(`Upload for Certificate No: ${cert.certNo}`);
  }

  // Demat Certificate Methods
  getFilteredDematCertificates(): DematCertificate[] {
    let filtered = [...this.dematCertificates];
    
    // Apply search filter
    if (this.dematSearchTerm) {
      const term = this.dematSearchTerm.toLowerCase();
      filtered = filtered.filter(cert =>
        cert.shareholderName.toLowerCase().includes(term) ||
        cert.dpId.toLowerCase().includes(term) ||
        cert.distinctiveNo.toLowerCase().includes(term) ||
        cert.presentShareholder.toLowerCase().includes(term) ||
        cert.remark.toLowerCase().includes(term) ||
        cert.srNo.toString().includes(term)
      );
    }
    
    return filtered;
  }

  getDematTotalPages(): number {
    return Math.ceil(this.getFilteredDematCertificates().length / this.dematEntriesPerPage) || 1;
  }

  getDematVisiblePages(): number[] {
    const total = this.getDematTotalPages();
    const current = this.dematCurrentPage;
    const pages: number[] = [];
    
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);
    start = Math.max(1, end - 4);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  getDematStartEntry(): number {
    return (this.dematCurrentPage - 1) * this.dematEntriesPerPage + 1;
  }

  getDematEndEntry(): number {
    return Math.min(this.dematCurrentPage * this.dematEntriesPerPage, this.getFilteredDematCertificates().length);
  }

  viewDematCert(cert: DematCertificate): void {
    alert(`View Demat Certificate\nShareholder: ${cert.shareholderName}\nDP ID: ${cert.dpId}\nShares: ${cert.noOfShares}`);
  }

  deleteDematCert(cert: DematCertificate): void {
    if (confirm(`Delete certificate for ${cert.shareholderName} (DP ID: ${cert.dpId})?`)) {
      console.log('Deleting demat certificate:', cert);
    }
  }
}

