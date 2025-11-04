import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CompaniesService, Company } from '../services/companies.service';

@Component({
  selector: 'app-company-master',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="entities-container">
      <!-- Header with Entity Count -->
      <div class="page-header">
        <h1 class="page-title">Name of Entities <span class="entity-count">(Entity Used: {{ getEntityCount() }})</span></h1>
      </div>

      <!-- Main Content Card -->
      <div class="content-card">
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
            <button class="btn-add" (click)="addCompany()">
              <span class="add-icon">+</span>
              <span>Add</span>
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading entities...</p>
        </div>

        <!-- Data Table -->
        <div *ngIf="!isLoading" class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th><span class="sort-icon">◆</span> Sr.No</th>
                <th><span class="sort-icon">◆</span> CIN</th>
                <th><span class="sort-icon">◆</span> Name</th>
                <th><span class="sort-icon">◆</span> Incorporation Date</th>
                <th><span class="sort-icon">◆</span> Type of Entity</th>
                <th><span class="sort-icon">◆</span> Status</th>
                <th><span class="sort-icon">◆</span> Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let entity of getPaginatedData(); let i = index">
                <td>{{ entity.srNo }}</td>
                <td class="cin-cell">{{ entity.cin }}</td>
                <td class="name-cell">{{ entity.name }}</td>
                <td>{{ formatDate(entity.incorporationDate) }}</td>
                <td>{{ entity.entityType }}</td>
                <td>
                  <span class="status-badge" 
                        [class.status-active]="entity.status === 'Active'"
                        [class.status-inactive]="entity.status !== 'Active'">
                    {{ entity.status }}
                  </span>
                </td>
                <td class="action-cell">
                  <button class="action-btn" (click)="viewEntity(entity)" title="View">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                    </svg>
                  </button>
                  <button class="action-btn" (click)="editEntity(entity)" title="Edit">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                    </svg>
                  </button>
                  <button class="action-btn delete-btn" (click)="deleteEntity(entity)" title="Delete">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                      <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                  </button>
                </td>
              </tr>
              <tr *ngIf="getFilteredData().length === 0">
                <td colspan="7" class="no-data">
                  <div class="empty-state">
                    <p>No data available in table</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Table Footer with Pagination -->
        <div *ngIf="!isLoading" class="table-footer">
          <div class="entries-info">
            Showing {{ getStartEntry() }} to {{ getEndEntry() }} of {{ getFilteredData().length }} entries
          </div>
          
          <div class="pagination">
            <button (click)="currentPage = 1" [disabled]="currentPage === 1" class="page-btn" title="First Page">&lt;&lt;</button>
            <button (click)="currentPage = currentPage - 1" [disabled]="currentPage === 1" class="page-btn" title="Previous Page">&lt;</button>
            <button *ngFor="let page of getVisiblePages()" (click)="currentPage = page" [class.active]="page === currentPage" class="page-btn page-number">{{ page }}</button>
            <button (click)="currentPage = currentPage + 1" [disabled]="currentPage === getTotalPages()" class="page-btn" title="Next Page">&gt;</button>
            <button (click)="currentPage = getTotalPages()" [disabled]="currentPage === getTotalPages()" class="page-btn" title="Last Page">&gt;&gt;</button>
          </div>
        </div>
      </div>
    </div>

    <!-- View Company Details Dialog -->
    <div *ngIf="showViewDialog" class="modal-overlay" (click)="closeViewDialog()">
      <div class="modal-dialog" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">Company Details</h2>
          <button class="modal-close" (click)="closeViewDialog()">&times;</button>
        </div>
        
        <div class="modal-body">
          <!-- Loading State -->
          <div *ngIf="loadingDetails" class="loading-details">
            <div class="spinner-small"></div>
            <p>Loading company details...</p>
          </div>
          
          <!-- Company Details -->
          <div *ngIf="!loadingDetails && selectedCompanyDetails" class="company-details">
            
            <!-- Basic Information -->
            <div class="detail-section">
              <h3 class="section-title">📋 Basic Information</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Company Name</label>
                  <span class="detail-value">{{ selectedCompanyDetails.companyName }}</span>
                </div>
                <div class="detail-item">
                  <label>CIN/LLPIN</label>
                  <span class="detail-value cin-value">{{ selectedCompanyDetails.cin }}</span>
                </div>
                <div class="detail-item">
                  <label>Entity Type</label>
                  <span class="detail-value">{{ selectedCompanyDetails.entityType || 'Not specified' }}</span>
                </div>
                <div class="detail-item">
                  <label>Status</label>
                  <span class="status-badge" 
                        [class.status-active]="selectedCompanyDetails.companyStatus === 'Active'"
                        [class.status-inactive]="selectedCompanyDetails.companyStatus !== 'Active'">
                    {{ selectedCompanyDetails.companyStatus }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Registration Information -->
            <div class="detail-section" *ngIf="selectedCompanyDetails.registrationDate || selectedCompanyDetails.companyClass">
              <h3 class="section-title">📅 Registration Information</h3>
              <div class="detail-grid">
                <div class="detail-item" *ngIf="selectedCompanyDetails.registrationDate">
                  <label>Registration Date</label>
                  <span class="detail-value">{{ formatDate(selectedCompanyDetails.registrationDate) }}</span>
                </div>
                <div class="detail-item" *ngIf="selectedCompanyDetails.companyClass">
                  <label>Company Class</label>
                  <span class="detail-value">{{ selectedCompanyDetails.companyClass }}</span>
                </div>
              </div>
            </div>
            
            <!-- Financial Information -->
            <div class="detail-section" *ngIf="selectedCompanyDetails.authorizedCapital || selectedCompanyDetails.paidUpCapital">
              <h3 class="section-title">💰 Financial Information</h3>
              <div class="detail-grid">
                <div class="detail-item" *ngIf="selectedCompanyDetails.authorizedCapital">
                  <label>Authorized Capital</label>
                  <span class="detail-value">{{ selectedCompanyDetails.authorizedCapital }}</span>
                </div>
                <div class="detail-item" *ngIf="selectedCompanyDetails.paidUpCapital">
                  <label>Paid-up Capital</label>
                  <span class="detail-value">{{ selectedCompanyDetails.paidUpCapital }}</span>
                </div>
              </div>
            </div>
            
            <!-- Contact Information -->
            <div class="detail-section" *ngIf="selectedCompanyDetails.email || selectedCompanyDetails.registeredAddress">
              <h3 class="section-title">📧 Contact Information</h3>
              <div class="detail-grid">
                <div class="detail-item detail-full" *ngIf="selectedCompanyDetails.email">
                  <label>Email</label>
                  <span class="detail-value">{{ selectedCompanyDetails.email }}</span>
                </div>
                <div class="detail-item detail-full" *ngIf="selectedCompanyDetails.registeredAddress">
                  <label>Registered Address</label>
                  <span class="detail-value">{{ selectedCompanyDetails.registeredAddress }}</span>
                </div>
              </div>
            </div>
            
            <!-- Compliance Information -->
            <div class="detail-section" *ngIf="selectedCompanyDetails.dateOfLastAGM || selectedCompanyDetails.dateOfBalanceSheet || selectedCompanyDetails.listingStatus">
              <h3 class="section-title">📊 Compliance Information</h3>
              <div class="detail-grid">
                <div class="detail-item" *ngIf="selectedCompanyDetails.dateOfLastAGM">
                  <label>Last AGM Date</label>
                  <span class="detail-value">{{ formatDate(selectedCompanyDetails.dateOfLastAGM) }}</span>
                </div>
                <div class="detail-item" *ngIf="selectedCompanyDetails.dateOfBalanceSheet">
                  <label>Last Balance Sheet Date</label>
                  <span class="detail-value">{{ formatDate(selectedCompanyDetails.dateOfBalanceSheet) }}</span>
                </div>
                <div class="detail-item" *ngIf="selectedCompanyDetails.listingStatus">
                  <label>Listing Status</label>
                  <span class="detail-value">{{ selectedCompanyDetails.listingStatus }}</span>
                </div>
              </div>
            </div>
            
            <!-- System Information -->
            <div class="detail-section system-info">
              <h3 class="section-title">ℹ️ System Information</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Added to Account</label>
                  <span class="detail-value detail-meta">{{ formatDateTime(selectedCompanyDetails.addedAt) }}</span>
                </div>
                <div class="detail-item" *ngIf="selectedCompanyDetails.lastUpdated">
                  <label>Data Last Updated</label>
                  <span class="detail-value detail-meta">{{ formatDateTime(selectedCompanyDetails.lastUpdated) }}</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn-close-modal" (click)="closeViewDialog()">Close</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    
    .entities-container { 
      padding: 1.5rem 2rem; 
      max-width: 100%; 
      margin: 0 auto; 
      animation: fadeIn 0.3s ease-out;
      background: #f5f5f5;
      min-height: 100vh;
    }
    
    .page-header { 
      margin-bottom: 1.5rem; 
    }
    
    .page-title { 
      font-size: 1.75rem; 
      font-weight: 600; 
      color: #333; 
      margin: 0;
      font-family: Arial, sans-serif;
    }
    
    .entity-count {
      font-size: 1rem;
      color: #666;
      font-weight: normal;
    }
    
    .content-card { 
      background: white; 
      border-radius: 4px; 
      padding: 1.5rem; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .table-controls { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 1.25rem; 
      gap: 1rem; 
      flex-wrap: wrap; 
    }
    
    .left-controls { 
      display: flex; 
      align-items: center; 
      gap: 0.5rem; 
    }
    
    .entries-select { 
      padding: 0.4rem 0.6rem; 
      border: 1px solid #ddd; 
      border-radius: 3px; 
      font-size: 0.9rem; 
      background: white; 
      cursor: pointer;
      color: #333;
    }
    
    .entries-select:focus { 
      outline: none; 
      border-color: #4A90E2; 
    }
    
    .entries-label { 
      color: #666; 
      font-size: 0.9rem; 
    }
    
    .right-controls { 
      display: flex; 
      align-items: center; 
      gap: 0.75rem; 
    }
    
    .search-box { 
      display: flex; 
      align-items: center; 
      gap: 0.5rem; 
    }
    
    .search-box label { 
      font-size: 0.9rem; 
      color: #333; 
      white-space: nowrap; 
    }
    
    .search-input { 
      padding: 0.4rem 0.6rem; 
      border: 1px solid #ddd; 
      border-radius: 3px; 
      font-size: 0.9rem; 
      width: 200px;
      color: #333;
    }
    
    .search-input:focus { 
      outline: none; 
      border-color: #4A90E2; 
    }
    
    .btn-add { 
      background: #007bff; 
      color: white; 
      border: none; 
      padding: 0.45rem 1rem; 
      border-radius: 3px; 
      font-size: 0.9rem; 
      font-weight: 500; 
      cursor: pointer; 
      transition: background 0.2s; 
      display: flex; 
      align-items: center; 
      gap: 0.35rem; 
      white-space: nowrap; 
    }
    
    .btn-add:hover { 
      background: #0056b3; 
    }
    
    .add-icon { 
      font-size: 1.1rem; 
      font-weight: 700; 
    }
    
    .loading-state { 
      text-align: center; 
      padding: 3rem 2rem; 
    }
    
    .spinner { 
      width: 40px; 
      height: 40px; 
      border: 3px solid #f3f3f3; 
      border-top: 3px solid #4A90E2; 
      border-radius: 50%; 
      margin: 0 auto 1rem; 
      animation: spin 1s linear infinite; 
    }
    
    .loading-state p { 
      color: #666; 
      font-size: 1rem; 
    }
    
    .table-wrapper { 
      overflow-x: auto; 
      margin-bottom: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .data-table { 
      width: 100%; 
      border-collapse: collapse; 
      font-size: 0.9rem;
      background: white;
    }
    
    .data-table thead { 
      background: #f8f9fa; 
      border-bottom: 2px solid #dee2e6;
    }
    
    .data-table th { 
      padding: 0.75rem 1rem; 
      text-align: left; 
      font-weight: 600; 
      font-size: 0.9rem; 
      color: #333;
      white-space: nowrap;
    }
    
    .sort-icon {
      font-size: 0.7rem;
      color: #999;
      margin-right: 0.25rem;
    }
    
    .data-table tbody tr { 
      border-bottom: 1px solid #dee2e6;
      transition: background 0.15s;
    }
    
    .data-table tbody tr:hover { 
      background: #f8f9fa;
    }
    
    .data-table td { 
      padding: 0.75rem 1rem; 
      font-size: 0.9rem; 
      color: #333; 
    }
    
    .cin-cell {
      font-family: 'Courier New', monospace;
      color: #0066cc;
    }
    
    .name-cell { 
      font-weight: 500; 
      color: #333; 
    }
    
    .status-badge { 
      padding: 0.25rem 0.6rem; 
      border-radius: 12px; 
      font-size: 0.85rem; 
      font-weight: 500; 
      white-space: nowrap; 
      display: inline-block;
    }
    
    .status-active { 
      background: #d4edda; 
      color: #155724; 
    }
    
    .status-inactive { 
      background: #f8d7da; 
      color: #721c24; 
    }
    
    .action-cell { 
      text-align: left; 
      white-space: nowrap; 
    }
    
    .action-btn { 
      background: transparent; 
      border: none; 
      cursor: pointer; 
      padding: 0.35rem; 
      border-radius: 3px; 
      transition: all 0.2s; 
      margin-right: 0.25rem;
      color: #666;
      display: inline-flex;
      align-items: center;
    }
    
    .action-btn:hover { 
      background: #f0f0f0;
      color: #333;
    }
    
    .action-btn.delete-btn:hover {
      background: #f8d7da;
      color: #721c24;
    }
    
    .no-data { 
      text-align: center; 
      padding: 3rem !important; 
    }
    
    .empty-state p { 
      margin: 0; 
      color: #666; 
      font-size: 0.95rem; 
    }
    
    .table-footer { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      padding-top: 1rem; 
      border-top: 1px solid #dee2e6;
      flex-wrap: wrap; 
      gap: 1rem; 
    }
    
    .entries-info { 
      color: #666; 
      font-size: 0.9rem; 
    }
    
    .pagination { 
      display: flex; 
      gap: 0.25rem; 
    }
    
    .page-btn { 
      padding: 0.4rem 0.7rem; 
      border: 1px solid #dee2e6; 
      background: white; 
      border-radius: 3px; 
      cursor: pointer; 
      font-size: 0.85rem; 
      color: #333; 
      transition: all 0.15s; 
      min-width: 32px; 
      text-align: center; 
    }
    
    .page-btn:hover:not(:disabled) { 
      background: #e9ecef;
      border-color: #adb5bd;
    }
    
    .page-btn:disabled { 
      opacity: 0.5; 
      cursor: not-allowed; 
    }
    
    .page-btn.active { 
      background: #007bff; 
      color: white; 
      border-color: #007bff; 
    }
    
    .page-number { 
      min-width: 36px; 
    }
    
    @media (max-width: 768px) {
      .entities-container { padding: 1rem; }
      .table-controls { flex-direction: column; align-items: flex-start; }
      .right-controls { width: 100%; flex-wrap: wrap; }
      .search-input { flex: 1; min-width: 150px; }
      .table-wrapper { border-radius: 0; }
    }
    
    /* View Dialog/Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.2s ease-out;
      padding: 1rem;
    }
    
    .modal-dialog {
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      max-width: 700px;
      width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      animation: slideDown 0.3s ease-out;
    }
    
    @keyframes slideDown {
      from { transform: translateY(-50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    .modal-header {
      padding: 1.5rem;
      border-bottom: 2px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .modal-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: white;
    }
    
    .modal-close {
      background: transparent;
      border: none;
      font-size: 2rem;
      color: white;
      cursor: pointer;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background 0.2s;
      line-height: 1;
      padding: 0;
    }
    
    .modal-close:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    
    .modal-body {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }
    
    .loading-details {
      text-align: center;
      padding: 3rem 2rem;
    }
    
    .spinner-small {
      width: 30px;
      height: 30px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #667eea;
      border-radius: 50%;
      margin: 0 auto 1rem;
      animation: spin 1s linear infinite;
    }
    
    .loading-details p {
      color: #666;
      font-size: 0.95rem;
    }
    
    .company-details {
      padding: 0;
    }
    
    .detail-section {
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .detail-section:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }
    
    .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 1rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .detail-item.detail-full {
      grid-column: 1 / -1;
    }
    
    .detail-item label {
      font-weight: 600;
      color: #666;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .detail-value {
      color: #333;
      font-size: 1rem;
      font-weight: 500;
    }
    
    .cin-value {
      font-family: 'Courier New', monospace;
      color: #0066cc;
      font-weight: 600;
    }
    
    .detail-meta {
      color: #666;
      font-size: 0.9rem;
    }
    
    .system-info {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 6px;
      border-bottom: none;
    }
    
    .modal-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #e0e0e0;
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      background: #f8f9fa;
    }
    
    .btn-close-modal {
      background: #6c757d;
      color: white;
      border: none;
      padding: 0.6rem 1.5rem;
      border-radius: 4px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }
    
    .btn-close-modal:hover {
      background: #5a6268;
    }
    
    @media (max-width: 768px) {
      .modal-dialog {
        max-width: 95%;
        max-height: 95vh;
      }
      
      .detail-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CompanyMasterComponent implements OnInit {
  private companiesService = inject(CompaniesService);
  private router = inject(Router);
  
  entities: Company[] = [];
  filteredData: Company[] = [];
  entriesPerPage: number = 10;
  currentPage: number = 1;
  searchTerm: string = '';
  isLoading: boolean = false;
  
  // View dialog state
  showViewDialog: boolean = false;
  selectedCompanyDetails: any = null;
  loadingDetails: boolean = false;

  ngOnInit(): void {
    this.loadEntities();
  }

  loadEntities(): void {
    this.isLoading = true;
    
    this.companiesService.getAll(undefined, true).subscribe({
      next: (data) => {
        this.entities = data;
        this.filteredData = [...this.entities];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading entities:', error);
        this.isLoading = false;
        this.entities = [];
        this.filteredData = [];
      }
    });
  }

  getEntityCount(): number {
    return this.entities.length;
  }

  filterData(): void {
    if (!this.searchTerm.trim()) {
      this.filteredData = [...this.entities];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredData = this.entities.filter(entity =>
        entity.name.toLowerCase().includes(term) ||
        entity.cin.toLowerCase().includes(term) ||
        entity.status.toLowerCase().includes(term) ||
        entity.entityType.toLowerCase().includes(term) ||
        (entity.incorporationDate && entity.incorporationDate.includes(term))
      );
    }
    this.currentPage = 1;
  }

  getFilteredData(): Company[] {
    return this.filteredData;
  }

  getPaginatedData(): Company[] {
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
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);
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

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  formatDateTime(dateTimeString: string | undefined): string {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return 'N/A';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  addCompany(): void {
    this.router.navigate(['/company-search']);
  }

  viewEntity(entity: Company): void {
    if (!entity.id) {
      alert('Company ID not found');
      return;
    }
    
    this.loadingDetails = true;
    this.showViewDialog = true;
    this.selectedCompanyDetails = null;
    
    // Fetch detailed company information
    this.companiesService.getById(entity.id).subscribe({
      next: (details) => {
        this.selectedCompanyDetails = details;
        this.loadingDetails = false;
      },
      error: (error) => {
        console.error('Error loading company details:', error);
        this.loadingDetails = false;
        alert('Failed to load company details');
        this.showViewDialog = false;
      }
    });
  }
  
  closeViewDialog(): void {
    this.showViewDialog = false;
    this.selectedCompanyDetails = null;
  }

  editEntity(entity: Company): void {
    alert(`Edit Entity: ${entity.name}\n\nThis will open an edit form.`);
  }

  deleteEntity(entity: Company): void {
    if (confirm(`Are you sure you want to remove "${entity.name}" from your entity list?`)) {
      if (entity.id) {
        this.companiesService.delete(entity.id).subscribe({
          next: () => {
            this.loadEntities();
            alert('Entity removed successfully');
          },
          error: (error) => {
            console.error('Error deleting entity:', error);
            alert('Error removing entity. Please try again.');
          }
        });
      }
    }
  }
}
