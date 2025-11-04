# Company Master - Quick Start Guide

## 🚀 Quick Access

**Frontend**: http://localhost:4200 → Login → Masters → Company Master  
**API**: http://localhost:8100/companies/  
**Docs**: http://localhost:8100/docs#/Companies  

## 📊 What You Can Do

✅ View all your companies in a beautiful data table  
✅ Search by company name, CIN, status, or class  
✅ Add new companies (redirects to Company Search)  
✅ Edit company information  
✅ Delete companies (soft delete - can be restored)  
✅ View inactive companies  
✅ Reactivate deleted companies  
✅ Change page size (10/25/50/100 entries)  
✅ Navigate through pages  

## 🔗 Quick API Tests

```bash
# View all companies
curl http://localhost:8100/companies/

# View single company
curl http://localhost:8100/companies/1

# Add new company
curl -X POST http://localhost:8100/companies/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "cin": "U12345MH2023PTC678901",
    "company_name": "Test Company Pvt Ltd",
    "company_status": "Active",
    "company_class": "Private Limited"
  }'
```

## 📊 Sample Data

7 companies pre-loaded:
1. PRIYA EXPRESS PRIVATE LIMITED
2. Tech Innovations Private Limited
3. Global Solutions India Pvt Ltd
4. Mumbai Trading Corporation
5. Bangalore Finance Services Ltd
6. Chennai Consulting Group (Inactive)
7. Gujarat Education Services

## 🎯 Features

### Frontend Features
- **Search**: Real-time filtering across all columns
- **Pagination**: Smart 5-page navigation
- **Actions**: View (👁️), Edit (✏️), Delete (🗑️), Activate (✅)
- **Toggle**: Show active only or show all companies
- **Responsive**: Works on mobile, tablet, and desktop

### API Features
- **GET** `/companies/` - List all companies
- **GET** `/companies/{id}` - Get single company
- **POST** `/companies/` - Add new company
- **PUT** `/companies/{id}` - Update company
- **DELETE** `/companies/{id}` - Delete company
- **POST** `/companies/{id}/activate` - Reactivate company

### Database
- **Table**: `user_companies`
- **Soft Delete**: Companies marked as inactive, not deleted
- **Unique Constraint**: Prevents duplicate CIN per user
- **Indexes**: Optimized for fast queries

## 📝 Common Tasks

### Add a Company
1. Click "+ Add Company" button
2. Search for company by CIN or name
3. Select from MCA results
4. Company added to your list

### Search Companies
1. Type in search box
2. Results filter in real-time
3. Works across: Name, CIN, Status, Class

### Delete Company
1. Click delete icon (🗑️)
2. Confirm deletion
3. Company marked as inactive
4. Can be reactivated later

### View Inactive Companies
1. Click "Show All" button in header
2. Inactive companies appear
3. Activate button (✅) shows for inactive
4. Click "Show Active Only" to hide

---

**Full Documentation**: `docs/COMPANY_MASTER_COMPLETE.md`

**Status**: ✅ Production Ready

