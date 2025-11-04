# Duplicate Company Error Handling - Frontend Integration Guide

**Date:** November 3, 2025  
**Status:** ✅ **IMPLEMENTED AND TESTED**

---

## 📋 Requirement

When a user tries to add a company that already exists in their account, show a popup with:

> **"The company "{Company Name}" already exists in your Company Master"**

---

## ✅ Backend Implementation

### Error Response Format

**Status Code:** `400 Bad Request`

**Response Body:**
```json
{
  "detail": "The company \"DIXIT RETAIL LLP\" already exists in your Company Master"
}
```

### When This Error Occurs

1. User searches for a company (e.g., "DIXIT RETAIL LLP")
2. User clicks "Add Company"
3. Backend checks if CIN already exists for this user
4. If exists, returns 400 error with company name in message

---

## 🎨 Frontend Integration Examples

### 1. Angular (TypeScript)

#### Using HttpClient with Error Handling

```typescript
import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

export class CompanyAddComponent {
  constructor(
    private http: HttpClient,
    private messageService: MessageService // or your toast service
  ) {}

  addCompany(company: any) {
    this.http.post('http://localhost:8100/companies/', company)
      .subscribe({
        next: (response) => {
          // Success
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Company added successfully'
          });
        },
        error: (error: HttpErrorResponse) => {
          // Error handling
          if (error.status === 400 && error.error?.detail) {
            // Show popup with the error message
            this.messageService.add({
              severity: 'error',
              summary: 'Duplicate Company',
              detail: error.error.detail,
              life: 5000
            });
          } else {
            // Generic error
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to add company'
            });
          }
        }
      });
  }
}
```

#### Using PrimeNG Toast

```typescript
import { MessageService } from 'primeng/api';

// In component
constructor(private messageService: MessageService) {}

// On error
if (error.status === 400) {
  this.messageService.add({
    severity: 'warn',
    summary: 'Company Already Exists',
    detail: error.error.detail,
    sticky: false,
    life: 5000
  });
}
```

#### Using Angular Material Dialog

```typescript
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from './error-dialog.component';

constructor(private dialog: MatDialog) {}

// On error
if (error.status === 400) {
  this.dialog.open(ErrorDialogComponent, {
    data: {
      title: 'Company Already Exists',
      message: error.error.detail
    }
  });
}
```

### 2. React (JavaScript/TypeScript)

#### Using Fetch API

```javascript
async function addCompany(companyData) {
  try {
    const response = await fetch('http://localhost:8100/companies/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(companyData),
    });

    if (!response.ok) {
      const error = await response.json();
      
      if (response.status === 400 && error.detail) {
        // Show popup/toast with error message
        toast.error(error.detail, {
          position: 'top-right',
          autoClose: 5000,
        });
      } else {
        toast.error('Failed to add company');
      }
      return;
    }

    const data = await response.json();
    toast.success('Company added successfully');
    
  } catch (error) {
    console.error('Error adding company:', error);
    toast.error('An unexpected error occurred');
  }
}
```

#### Using React Toastify

```javascript
import { toast } from 'react-toastify';

const handleAddCompany = async (company) => {
  try {
    const response = await addCompanyAPI(company);
    toast.success('Company added successfully!');
  } catch (error) {
    if (error.response?.status === 400) {
      // Show the duplicate error message
      toast.error(error.response.data.detail, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      });
    } else {
      toast.error('Failed to add company');
    }
  }
};
```

#### Using SweetAlert2

```javascript
import Swal from 'sweetalert2';

async function addCompany(companyData) {
  try {
    const response = await fetch('/companies/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(companyData),
    });

    if (!response.ok) {
      const error = await response.json();
      
      if (response.status === 400) {
        // Show popup
        Swal.fire({
          icon: 'warning',
          title: 'Company Already Exists',
          text: error.detail,
          confirmButtonText: 'OK'
        });
      }
      return;
    }

    // Success
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Company added successfully',
      timer: 2000
    });
    
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An unexpected error occurred'
    });
  }
}
```

### 3. jQuery (for legacy code)

```javascript
$.ajax({
  url: 'http://localhost:8100/companies/',
  type: 'POST',
  contentType: 'application/json',
  data: JSON.stringify(companyData),
  success: function(response) {
    // Success
    alert('Company added successfully');
    // Or use a toast library
  },
  error: function(xhr) {
    if (xhr.status === 400 && xhr.responseJSON?.detail) {
      // Show popup with error message
      alert(xhr.responseJSON.detail);
      
      // Or using Bootstrap modal
      $('#errorModal .modal-body').text(xhr.responseJSON.detail);
      $('#errorModal').modal('show');
      
    } else {
      alert('Failed to add company');
    }
  }
});
```

---

## 🧪 Test Scenarios

### Scenario 1: Adding New Company
**Request:**
```json
POST /companies/
{
  "user_id": 1,
  "cin": "U12345NEW2025PTC123456",
  "company_name": "NEW COMPANY LIMITED",
  "company_status": "Active"
}
```

**Response:** `200 OK`
```json
{
  "message": "Company added successfully",
  "id": 5,
  "cin": "U12345NEW2025PTC123456",
  "company_name": "NEW COMPANY LIMITED"
}
```

**Frontend Action:** Show success toast/message

---

### Scenario 2: Adding Duplicate Company
**Request:**
```json
POST /companies/
{
  "user_id": 1,
  "cin": "AAS-8733",
  "company_name": "DIXIT RETAIL LLP",
  "company_status": "Active"
}
```

**Response:** `400 Bad Request`
```json
{
  "detail": "The company \"DIXIT RETAIL LLP\" already exists in your Company Master"
}
```

**Frontend Action:** Show error popup with exact message from `detail` field

---

## 📱 UI/UX Recommendations

### Error Popup Design

**Option 1: Alert Dialog**
```
┌─────────────────────────────────────────┐
│  ⚠️  Company Already Exists             │
├─────────────────────────────────────────┤
│                                         │
│  The company "DIXIT RETAIL LLP"         │
│  already exists in your Company Master  │
│                                         │
│                    [ OK ]               │
└─────────────────────────────────────────┘
```

**Option 2: Toast Notification**
```
┌─────────────────────────────────────────┐
│  ⚠️  The company "DIXIT RETAIL LLP"     │
│     already exists in your Company      │
│     Master                               │
│                               [ ✕ ]     │
└─────────────────────────────────────────┘
```

**Option 3: Inline Error**
```
Company Search: [DIXIT RETAIL LLP        ]  [Search]

Results:
✅ DIXIT RETAIL LLP (AAS-8733)            [+ Add]
                                           ↓
┌──────────────────────────────────────────────┐
│ ⚠️ The company "DIXIT RETAIL LLP" already   │
│    exists in your Company Master             │
└──────────────────────────────────────────────┘
```

---

## 🔧 Error Handling Best Practices

### 1. Always Check Status Code
```javascript
if (response.status === 400) {
  // Validation error (duplicate company)
  showErrorPopup(error.detail);
} else if (response.status === 500) {
  // Server error
  showGenericError();
}
```

### 2. Extract Error Message
```javascript
const errorMessage = error.error?.detail || 
                     error.message || 
                     'An unexpected error occurred';
```

### 3. Provide User Actions
```javascript
// In popup/dialog
{
  title: 'Company Already Exists',
  message: error.detail,
  actions: [
    { label: 'View Company', action: () => navigateToCompany(cin) },
    { label: 'OK', action: () => closeDialog() }
  ]
}
```

### 4. Log for Debugging
```javascript
if (response.status === 400) {
  console.log('Duplicate company:', {
    cin: companyData.cin,
    name: companyData.company_name,
    error: error.detail
  });
}
```

---

## 📊 Error Response Examples

### All Duplicate Error Cases

| Scenario | Response |
|----------|----------|
| DIXIT RETAIL LLP | `The company "DIXIT RETAIL LLP" already exists in your Company Master` |
| PRIYA EXPRESS | `The company "PRIYA EXPRESS PRIVATE LIMITED" already exists in your Company Master` |
| TATA DIGITAL | `The company "TATA DIGITAL PRIVATE LIMITED" already exists in your Company Master` |

---

## ✅ Testing Checklist

### Backend Tests
- [x] 400 status code returned for duplicates
- [x] Error message includes company name
- [x] Error message format is correct
- [x] Works for all company types (LLP, Private Limited, etc.)
- [x] Pre-check catches duplicates early
- [x] Database constraint also returns same message

### Frontend Tests (To Do)
- [ ] Error message is displayed in popup
- [ ] Popup shows exact message from backend
- [ ] Popup is user-friendly and clear
- [ ] User can dismiss the popup
- [ ] No console errors
- [ ] UI doesn't break after error

---

## 🚀 Quick Test Commands

### Test Duplicate Error

```bash
# Test 1: DIXIT RETAIL LLP
curl -X POST http://localhost:8100/companies/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "cin": "AAS-8733",
    "company_name": "DIXIT RETAIL LLP",
    "company_status": "Active"
  }'

# Expected Response (400):
# {"detail": "The company \"DIXIT RETAIL LLP\" already exists in your Company Master"}

# Test 2: PRIYA EXPRESS
curl -X POST http://localhost:8100/companies/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "cin": "U74999MH2017PTC289529",
    "company_name": "PRIYA EXPRESS PRIVATE LIMITED",
    "company_status": "Active"
  }'

# Expected Response (400):
# {"detail": "The company \"PRIYA EXPRESS PRIVATE LIMITED\" already exists in your Company Master"}
```

### Test Success Case

```bash
# Add a new company (should succeed)
curl -X POST http://localhost:8100/companies/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "cin": "U74999KA2020PTC123456",
    "company_name": "TEST COMPANY LIMITED",
    "company_status": "Active",
    "entity_type": "Private Limited"
  }'

# Expected Response (200):
# {"message": "Company added successfully", "id": 5, ...}
```

---

## 📝 Summary

### What Was Implemented

| Feature | Status |
|---------|--------|
| Error message format | ✅ Matches requirement exactly |
| Company name in message | ✅ Included |
| HTTP status code | ✅ 400 (Bad Request) |
| Early duplicate detection | ✅ Checks before INSERT |
| Database constraint handling | ✅ Catches if check misses |
| User-friendly message | ✅ Clear and actionable |

### Error Message Examples

```
"The company "DIXIT RETAIL LLP" already exists in your Company Master"
"The company "PRIYA EXPRESS PRIVATE LIMITED" already exists in your Company Master"
"The company "TATA DIGITAL PRIVATE LIMITED" already exists in your Company Master"
```

### Response Format

```json
{
  "detail": "The company \"<Company Name>\" already exists in your Company Master"
}
```

---

## 🎯 Next Steps for Frontend

1. **Update your add company function** to handle 400 errors
2. **Extract the `detail` field** from error response
3. **Show it in a popup/dialog/toast** notification
4. **Test with different companies** to ensure it works

### Recommended Libraries

- **Angular:** PrimeNG Toast, Angular Material Snackbar, SweetAlert2
- **React:** React Toastify, Material-UI Snackbar, SweetAlert2
- **Vue:** Vue Toastification, Element Plus Notification
- **Vanilla JS:** SweetAlert2, Toastify JS, Bootstrap Modal

---

**Status:** ✅ **BACKEND READY FOR FRONTEND INTEGRATION**

The error message is now properly formatted and ready to be displayed in your frontend popup!

🎉 **Implementation Complete!** 🎉

