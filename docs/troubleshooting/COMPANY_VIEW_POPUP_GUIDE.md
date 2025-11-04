# Company Master - View Button Popup Implementation Guide

**Date:** November 3, 2025  
**Status:** ✅ **IMPLEMENTED AND READY**

---

## 📋 Requirement

When clicking the **View** button in Company Master Actions, show a popup with **all company details**.

---

## ✅ Backend Implementation

### API Endpoint

**Endpoint:** `GET /companies/{company_id}`

**Purpose:** Returns comprehensive company details for display in popup

### Response Format

```json
{
  "id": 1,
  "cin": "AAS-8733",
  "companyName": "DIXIT RETAIL LLP",
  "entityType": "LLP",
  "companyStatus": "Active",
  "incorporationDate": null,
  "addedAt": "2025-11-03 19:46:37.850438",
  "isActive": true,
  "registrationDate": "2020-07-13 00:00:00",
  "authorizedCapital": "",
  "paidUpCapital": "",
  "email": "",
  "registeredAddress": "",
  "listingStatus": "",
  "dateOfLastAGM": "",
  "dateOfBalanceSheet": "",
  "companyClass": "",
  "lastUpdated": "2025-11-03 19:33:47.555215"
}
```

### Available Fields

| Field | Description | Example |
|-------|-------------|---------|
| `id` | Internal database ID | 1 |
| `cin` | Corporate Identity Number | AAS-8733 |
| `companyName` | Company name | DIXIT RETAIL LLP |
| `entityType` | Type of entity | LLP, Private Limited |
| `companyStatus` | Company status | Active, Inactive |
| `incorporationDate` | Date added to system | 2025-11-03 |
| `addedAt` | When added to your list | 2025-11-03 19:46:37 |
| `isActive` | Active in your list | true/false |
| `registrationDate` | MCA registration date | 2020-07-13 00:00:00 |
| `authorizedCapital` | Authorized capital | Rs. 10,00,000 |
| `paidUpCapital` | Paid-up capital | Rs. 5,00,000 |
| `email` | Company email | company@example.com |
| `registeredAddress` | Registered office address | Full address |
| `listingStatus` | Stock exchange listing | Listed/Unlisted |
| `dateOfLastAGM` | Last AGM date | 2024-09-30 |
| `dateOfBalanceSheet` | Last balance sheet date | 2024-03-31 |
| `companyClass` | Company classification | New Company (Others) |
| `lastUpdated` | Data last updated from MCA | 2025-11-03 19:33:47 |

---

## 🎨 Frontend Implementation Examples

### 1. Angular (TypeScript) with PrimeNG Dialog

#### Component TypeScript

```typescript
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class CompanyMasterComponent {
  displayViewDialog = false;
  selectedCompany: any = null;
  
  constructor(private http: HttpClient) {}
  
  viewCompany(companyId: number) {
    // Fetch company details
    this.http.get(`http://localhost:8100/companies/${companyId}`)
      .subscribe({
        next: (company) => {
          this.selectedCompany = company;
          this.displayViewDialog = true;
        },
        error: (error) => {
          console.error('Failed to fetch company details:', error);
          alert('Failed to load company details');
        }
      });
  }
  
  closeDialog() {
    this.displayViewDialog = false;
    this.selectedCompany = null;
  }
}
```

#### Component HTML (PrimeNG)

```html
<!-- View Button in Table -->
<p-button 
  icon="pi pi-eye" 
  label="View" 
  (onClick)="viewCompany(company.id)"
  styleClass="p-button-info p-button-sm">
</p-button>

<!-- View Dialog/Popup -->
<p-dialog 
  header="Company Details" 
  [(visible)]="displayViewDialog" 
  [modal]="true"
  [style]="{width: '50vw'}"
  [dismissableMask]="true">
  
  <div *ngIf="selectedCompany" class="company-details">
    
    <!-- Basic Information -->
    <div class="section">
      <h3>Basic Information</h3>
      <div class="field-grid">
        <div class="field">
          <label>Company Name:</label>
          <span>{{ selectedCompany.companyName }}</span>
        </div>
        <div class="field">
          <label>CIN/LLPIN:</label>
          <span>{{ selectedCompany.cin }}</span>
        </div>
        <div class="field">
          <label>Entity Type:</label>
          <span>{{ selectedCompany.entityType || 'N/A' }}</span>
        </div>
        <div class="field">
          <label>Status:</label>
          <span class="status-badge" [ngClass]="{'active': selectedCompany.companyStatus === 'Active'}">
            {{ selectedCompany.companyStatus }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Financial Information -->
    <div class="section" *ngIf="selectedCompany.authorizedCapital || selectedCompany.paidUpCapital">
      <h3>Financial Information</h3>
      <div class="field-grid">
        <div class="field" *ngIf="selectedCompany.authorizedCapital">
          <label>Authorized Capital:</label>
          <span>{{ selectedCompany.authorizedCapital }}</span>
        </div>
        <div class="field" *ngIf="selectedCompany.paidUpCapital">
          <label>Paid-up Capital:</label>
          <span>{{ selectedCompany.paidUpCapital }}</span>
        </div>
      </div>
    </div>
    
    <!-- Registration Information -->
    <div class="section">
      <h3>Registration Information</h3>
      <div class="field-grid">
        <div class="field" *ngIf="selectedCompany.registrationDate">
          <label>Registration Date:</label>
          <span>{{ selectedCompany.registrationDate | date }}</span>
        </div>
        <div class="field" *ngIf="selectedCompany.companyClass">
          <label>Company Class:</label>
          <span>{{ selectedCompany.companyClass }}</span>
        </div>
      </div>
    </div>
    
    <!-- Contact Information -->
    <div class="section" *ngIf="selectedCompany.email || selectedCompany.registeredAddress">
      <h3>Contact Information</h3>
      <div class="field-grid">
        <div class="field" *ngIf="selectedCompany.email">
          <label>Email:</label>
          <span>{{ selectedCompany.email }}</span>
        </div>
        <div class="field full-width" *ngIf="selectedCompany.registeredAddress">
          <label>Registered Address:</label>
          <span>{{ selectedCompany.registeredAddress }}</span>
        </div>
      </div>
    </div>
    
    <!-- Compliance Information -->
    <div class="section" *ngIf="selectedCompany.dateOfLastAGM || selectedCompany.dateOfBalanceSheet">
      <h3>Compliance Information</h3>
      <div class="field-grid">
        <div class="field" *ngIf="selectedCompany.dateOfLastAGM">
          <label>Last AGM Date:</label>
          <span>{{ selectedCompany.dateOfLastAGM | date }}</span>
        </div>
        <div class="field" *ngIf="selectedCompany.dateOfBalanceSheet">
          <label>Last Balance Sheet Date:</label>
          <span>{{ selectedCompany.dateOfBalanceSheet | date }}</span>
        </div>
        <div class="field" *ngIf="selectedCompany.listingStatus">
          <label>Listing Status:</label>
          <span>{{ selectedCompany.listingStatus }}</span>
        </div>
      </div>
    </div>
    
    <!-- System Information -->
    <div class="section metadata">
      <div class="field-grid">
        <div class="field">
          <label>Added to Account:</label>
          <span>{{ selectedCompany.addedAt | date:'medium' }}</span>
        </div>
        <div class="field" *ngIf="selectedCompany.lastUpdated">
          <label>Data Last Updated:</label>
          <span>{{ selectedCompany.lastUpdated | date:'medium' }}</span>
        </div>
      </div>
    </div>
    
  </div>
  
  <ng-template pTemplate="footer">
    <p-button 
      label="Close" 
      icon="pi pi-times" 
      (onClick)="closeDialog()"
      styleClass="p-button-text">
    </p-button>
  </ng-template>
</p-dialog>
```

#### Component CSS

```css
.company-details {
  padding: 1rem;
}

.section {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.section:last-child {
  border-bottom: none;
}

.section h3 {
  color: #333;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.field.full-width {
  grid-column: 1 / -1;
}

.field label {
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
}

.field span {
  color: #333;
  font-size: 1rem;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.active {
  background-color: #d4edda;
  color: #155724;
}

.metadata {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
}
```

---

### 2. React with Material-UI Dialog

```javascript
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Divider,
  Chip
} from '@mui/material';

function CompanyMaster() {
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const handleViewCompany = async (companyId) => {
    try {
      const response = await fetch(`http://localhost:8100/companies/${companyId}`);
      const company = await response.json();
      setSelectedCompany(company);
      setViewDialog(true);
    } catch (error) {
      console.error('Failed to fetch company:', error);
      alert('Failed to load company details');
    }
  };

  return (
    <>
      {/* View Button */}
      <Button 
        variant="outlined" 
        color="primary"
        onClick={() => handleViewCompany(company.id)}>
        View
      </Button>

      {/* View Dialog */}
      <Dialog 
        open={viewDialog} 
        onClose={() => setViewDialog(false)}
        maxWidth="md"
        fullWidth>
        
        <DialogTitle>Company Details</DialogTitle>
        
        <DialogContent dividers>
          {selectedCompany && (
            <Grid container spacing={3}>
              
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Divider />
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Company Name
                </Typography>
                <Typography variant="body1">
                  {selectedCompany.companyName}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  CIN/LLPIN
                </Typography>
                <Typography variant="body1">
                  {selectedCompany.cin}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Entity Type
                </Typography>
                <Typography variant="body1">
                  {selectedCompany.entityType || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Status
                </Typography>
                <Chip 
                  label={selectedCompany.companyStatus}
                  color={selectedCompany.companyStatus === 'Active' ? 'success' : 'default'}
                  size="small"
                />
              </Grid>
              
              {/* Registration Information */}
              {selectedCompany.registrationDate && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                      Registration Information
                    </Typography>
                    <Divider />
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Registration Date
                    </Typography>
                    <Typography variant="body1">
                      {new Date(selectedCompany.registrationDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  
                  {selectedCompany.companyClass && (
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Company Class
                      </Typography>
                      <Typography variant="body1">
                        {selectedCompany.companyClass}
                      </Typography>
                    </Grid>
                  )}
                </>
              )}
              
              {/* Financial Information */}
              {(selectedCompany.authorizedCapital || selectedCompany.paidUpCapital) && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                      Financial Information
                    </Typography>
                    <Divider />
                  </Grid>
                  
                  {selectedCompany.authorizedCapital && (
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Authorized Capital
                      </Typography>
                      <Typography variant="body1">
                        {selectedCompany.authorizedCapital}
                      </Typography>
                    </Grid>
                  )}
                  
                  {selectedCompany.paidUpCapital && (
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Paid-up Capital
                      </Typography>
                      <Typography variant="body1">
                        {selectedCompany.paidUpCapital}
                      </Typography>
                    </Grid>
                  )}
                </>
              )}
              
              {/* Contact Information */}
              {(selectedCompany.email || selectedCompany.registeredAddress) && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                      Contact Information
                    </Typography>
                    <Divider />
                  </Grid>
                  
                  {selectedCompany.email && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Email
                      </Typography>
                      <Typography variant="body1">
                        {selectedCompany.email}
                      </Typography>
                    </Grid>
                  )}
                  
                  {selectedCompany.registeredAddress && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Registered Address
                      </Typography>
                      <Typography variant="body1">
                        {selectedCompany.registeredAddress}
                      </Typography>
                    </Grid>
                  )}
                </>
              )}
              
              {/* Compliance Information */}
              {(selectedCompany.dateOfLastAGM || selectedCompany.dateOfBalanceSheet) && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                      Compliance Information
                    </Typography>
                    <Divider />
                  </Grid>
                  
                  {selectedCompany.dateOfLastAGM && (
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Last AGM Date
                      </Typography>
                      <Typography variant="body1">
                        {new Date(selectedCompany.dateOfLastAGM).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  )}
                  
                  {selectedCompany.dateOfBalanceSheet && (
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Last Balance Sheet Date
                      </Typography>
                      <Typography variant="body1">
                        {new Date(selectedCompany.dateOfBalanceSheet).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  )}
                </>
              )}
              
            </Grid>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
```

---

### 3. Bootstrap Modal (jQuery/Vanilla JS)

#### HTML

```html
<!-- View Button in Table -->
<button class="btn btn-info btn-sm" onclick="viewCompany(1)">
  <i class="bi bi-eye"></i> View
</button>

<!-- View Modal -->
<div class="modal fade" id="viewCompanyModal" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      
      <div class="modal-header">
        <h5 class="modal-title">Company Details</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      
      <div class="modal-body" id="companyDetailsContainer">
        <!-- Content will be dynamically loaded -->
      </div>
      
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
      
    </div>
  </div>
</div>
```

#### JavaScript

```javascript
async function viewCompany(companyId) {
  try {
    const response = await fetch(`http://localhost:8100/companies/${companyId}`);
    const company = await response.json();
    
    // Build HTML for company details
    const html = `
      <!-- Basic Information -->
      <div class="section mb-4">
        <h6 class="fw-bold mb-3">Basic Information</h6>
        <div class="row g-3">
          <div class="col-md-6">
            <strong>Company Name:</strong><br>
            <span>${company.companyName}</span>
          </div>
          <div class="col-md-6">
            <strong>CIN/LLPIN:</strong><br>
            <span>${company.cin}</span>
          </div>
          <div class="col-md-6">
            <strong>Entity Type:</strong><br>
            <span>${company.entityType || 'N/A'}</span>
          </div>
          <div class="col-md-6">
            <strong>Status:</strong><br>
            <span class="badge bg-${company.companyStatus === 'Active' ? 'success' : 'secondary'}">
              ${company.companyStatus}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Registration Information -->
      ${company.registrationDate ? `
      <div class="section mb-4">
        <h6 class="fw-bold mb-3">Registration Information</h6>
        <div class="row g-3">
          <div class="col-md-6">
            <strong>Registration Date:</strong><br>
            <span>${new Date(company.registrationDate).toLocaleDateString()}</span>
          </div>
          ${company.companyClass ? `
          <div class="col-md-6">
            <strong>Company Class:</strong><br>
            <span>${company.companyClass}</span>
          </div>
          ` : ''}
        </div>
      </div>
      ` : ''}
      
      <!-- Financial Information -->
      ${company.authorizedCapital || company.paidUpCapital ? `
      <div class="section mb-4">
        <h6 class="fw-bold mb-3">Financial Information</h6>
        <div class="row g-3">
          ${company.authorizedCapital ? `
          <div class="col-md-6">
            <strong>Authorized Capital:</strong><br>
            <span>${company.authorizedCapital}</span>
          </div>
          ` : ''}
          ${company.paidUpCapital ? `
          <div class="col-md-6">
            <strong>Paid-up Capital:</strong><br>
            <span>${company.paidUpCapital}</span>
          </div>
          ` : ''}
        </div>
      </div>
      ` : ''}
      
      <!-- Contact Information -->
      ${company.email || company.registeredAddress ? `
      <div class="section mb-4">
        <h6 class="fw-bold mb-3">Contact Information</h6>
        <div class="row g-3">
          ${company.email ? `
          <div class="col-md-12">
            <strong>Email:</strong><br>
            <span>${company.email}</span>
          </div>
          ` : ''}
          ${company.registeredAddress ? `
          <div class="col-md-12">
            <strong>Registered Address:</strong><br>
            <span>${company.registeredAddress}</span>
          </div>
          ` : ''}
        </div>
      </div>
      ` : ''}
      
      <!-- Compliance Information -->
      ${company.dateOfLastAGM || company.dateOfBalanceSheet || company.listingStatus ? `
      <div class="section mb-4">
        <h6 class="fw-bold mb-3">Compliance Information</h6>
        <div class="row g-3">
          ${company.dateOfLastAGM ? `
          <div class="col-md-6">
            <strong>Last AGM Date:</strong><br>
            <span>${new Date(company.dateOfLastAGM).toLocaleDateString()}</span>
          </div>
          ` : ''}
          ${company.dateOfBalanceSheet ? `
          <div class="col-md-6">
            <strong>Last Balance Sheet Date:</strong><br>
            <span>${new Date(company.dateOfBalanceSheet).toLocaleDateString()}</span>
          </div>
          ` : ''}
          ${company.listingStatus ? `
          <div class="col-md-6">
            <strong>Listing Status:</strong><br>
            <span>${company.listingStatus}</span>
          </div>
          ` : ''}
        </div>
      </div>
      ` : ''}
      
      <!-- System Information -->
      <div class="section bg-light p-3 rounded">
        <div class="row g-3">
          <div class="col-md-6">
            <strong>Added to Account:</strong><br>
            <span class="text-muted">${new Date(company.addedAt).toLocaleString()}</span>
          </div>
          ${company.lastUpdated ? `
          <div class="col-md-6">
            <strong>Data Last Updated:</strong><br>
            <span class="text-muted">${new Date(company.lastUpdated).toLocaleString()}</span>
          </div>
          ` : ''}
        </div>
      </div>
    `;
    
    // Set the content and show modal
    document.getElementById('companyDetailsContainer').innerHTML = html;
    const modal = new bootstrap.Modal(document.getElementById('viewCompanyModal'));
    modal.show();
    
  } catch (error) {
    console.error('Failed to fetch company details:', error);
    alert('Failed to load company details');
  }
}
```

---

## 📱 Example Popup Layouts

### Layout 1: Compact View

```
┌────────────────────────────────────────────────────────┐
│  Company Details                                    ✕  │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Basic Information                                     │
│  ─────────────────────────────────────────────         │
│  Company Name:        DIXIT RETAIL LLP                 │
│  CIN/LLPIN:          AAS-8733                          │
│  Entity Type:        LLP                               │
│  Status:             [Active]                          │
│                                                        │
│  Registration Information                              │
│  ─────────────────────────────────────────────         │
│  Registration Date:  July 13, 2020                     │
│  Company Class:      LLP                               │
│                                                        │
│  System Information                                    │
│  ─────────────────────────────────────────────         │
│  Added to Account:   Nov 3, 2025, 7:46 PM             │
│  Data Last Updated:  Nov 3, 2025, 7:33 PM             │
│                                                        │
│                                         [Close]        │
└────────────────────────────────────────────────────────┘
```

### Layout 2: Detailed View (if MCA data available)

```
┌────────────────────────────────────────────────────────┐
│  Company Details - PRIYA EXPRESS PRIVATE LIMITED    ✕  │
├────────────────────────────────────────────────────────┤
│                                                        │
│  📋 Basic Information                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Company Name:    PRIYA EXPRESS PRIVATE LIMITED        │
│  CIN:             U74999MH2017PTC289529                │
│  Entity Type:     Private Limited                      │
│  Status:          Active ✓                             │
│                                                        │
│  📅 Registration Information                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Registration Date:  Jan 13, 2017                      │
│  Company Class:      New Company (Others)              │
│                                                        │
│  💰 Financial Information                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Authorized Capital:  Rs. 10,00,000                    │
│  Paid-up Capital:     Rs. 5,00,000                     │
│                                                        │
│  📧 Contact Information                                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Email:          info@priyaexpress.com                 │
│  Address:        123 Main St, Mumbai, MH 400001       │
│                                                        │
│  📊 Compliance Information                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Last AGM Date:          Sep 30, 2024                  │
│  Last Balance Sheet:     Mar 31, 2024                  │
│  Listing Status:         Unlisted                      │
│                                                        │
│  ℹ️  System Information                                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Added to Account:   Nov 3, 2025, 7:48 PM             │
│  Data Last Updated:  Nov 3, 2025, 7:48 PM             │
│                                                        │
│                                  [Close]               │
└────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing the API

### Test View Endpoint

```bash
# View DIXIT RETAIL LLP (ID: 1)
curl http://localhost:8100/companies/1

# View PRIYA EXPRESS (ID: 4)
curl http://localhost:8100/companies/4

# View TATA DIGITAL (ID: 2)
curl http://localhost:8100/companies/2
```

### Example Response

```json
{
  "id": 1,
  "cin": "AAS-8733",
  "companyName": "DIXIT RETAIL LLP",
  "entityType": "LLP",
  "companyStatus": "Active",
  "incorporationDate": null,
  "addedAt": "2025-11-03 19:46:37.850438",
  "isActive": true,
  "registrationDate": "2020-07-13 00:00:00",
  "authorizedCapital": "",
  "paidUpCapital": "",
  "email": "",
  "registeredAddress": "",
  "listingStatus": "",
  "dateOfLastAGM": "",
  "dateOfBalanceSheet": "",
  "companyClass": "",
  "lastUpdated": "2025-11-03 19:33:47.555215"
}
```

---

## 📊 Field Display Logic

### Conditional Display

Some fields may be empty. Use this logic:

```javascript
// Only show section if at least one field has data
const hasFinancialData = company.authorizedCapital || company.paidUpCapital;
const hasContactData = company.email || company.registeredAddress;
const hasComplianceData = company.dateOfLastAGM || company.dateOfBalanceSheet || company.listingStatus;

// Display field only if it has value
{company.email && (
  <div>
    <strong>Email:</strong> {company.email}
  </div>
)}

// Or show N/A for empty required fields
<div>
  <strong>Entity Type:</strong> {company.entityType || 'N/A'}
</div>
```

---

## 🎨 UI/UX Recommendations

### 1. Loading State

```javascript
const [loading, setLoading] = useState(false);

const viewCompany = async (id) => {
  setLoading(true);
  try {
    const response = await fetch(`/companies/${id}`);
    const data = await response.json();
    setSelectedCompany(data);
    setShowDialog(true);
  } finally {
    setLoading(false);
  }
};

// In dialog
{loading ? <Spinner /> : <CompanyDetails />}
```

### 2. Error Handling

```javascript
if (!response.ok) {
  if (response.status === 404) {
    toast.error('Company not found');
  } else {
    toast.error('Failed to load company details');
  }
  return;
}
```

### 3. Empty Fields

```javascript
// Helper function
const displayValue = (value, fallback = 'N/A') => {
  return value && value.trim() !== '' ? value : fallback;
};

// Usage
<span>{displayValue(company.email, 'Not provided')}</span>
```

### 4. Date Formatting

```javascript
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
```

---

## 🔧 Complete Integration Steps

### Step 1: Add View Button Handler

In your Company Master table, add click handler:

```html
<!-- Angular -->
<button (click)="viewCompany(company.id)">View</button>

<!-- React -->
<button onClick={() => viewCompany(company.id)}>View</button>

<!-- jQuery -->
<button onclick="viewCompany(${company.id})">View</button>
```

### Step 2: Fetch Company Details

```javascript
async function viewCompany(companyId) {
  const response = await fetch(`http://localhost:8100/companies/${companyId}`);
  const company = await response.json();
  showPopup(company);
}
```

### Step 3: Display in Popup

Use one of the examples above based on your UI framework:
- Angular + PrimeNG Dialog
- React + Material-UI Dialog
- Bootstrap Modal
- Custom modal

### Step 4: Handle Empty Fields

Show "N/A" or hide sections that have no data

### Step 5: Add Close Button

Allow users to close the popup

---

## 📋 Quick Reference

### API Endpoint
```
GET /companies/{company_id}
```

### Response Fields (18 total)

**Always Available:**
- `id`, `cin`, `companyName`, `companyStatus`, `addedAt`, `isActive`

**Sometimes Available:**
- `entityType`, `incorporationDate`, `registrationDate`, `companyClass`
- `authorizedCapital`, `paidUpCapital`
- `email`, `registeredAddress`
- `listingStatus`, `dateOfLastAGM`, `dateOfBalanceSheet`
- `lastUpdated`

---

## ✅ Testing Checklist

### Backend
- [x] Endpoint returns all available fields
- [x] Joins with MCA cache for additional data
- [x] Handles missing company (404 error)
- [x] Returns consistent JSON format

### Frontend (To Do)
- [ ] View button opens popup
- [ ] Popup displays all company details
- [ ] Empty fields handled gracefully
- [ ] Dates formatted correctly
- [ ] Close button works
- [ ] Loading state shown while fetching
- [ ] Error handling for fetch failures

---

## 🎯 Summary

**Endpoint:** `GET /companies/{company_id}`

**Returns:** Comprehensive company details including:
- ✅ Basic information (name, CIN, status)
- ✅ Registration information (date, class)
- ✅ Financial information (authorized/paid-up capital)
- ✅ Contact information (email, address)
- ✅ Compliance information (AGM, balance sheet)
- ✅ System information (when added, last updated)

**Frontend:** Use the code examples above to display in a popup

---

**Status:** ✅ **BACKEND READY**

The API endpoint now returns all company details. Use the frontend examples above to display them in a popup! 🎉

