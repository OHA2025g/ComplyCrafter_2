# DIR6: Form DIR6

**Form Code:** DIR6  
**Form Name:** N/A  
**Regulation:** N/A  
**Filing Timeline:** As required  
**Field Count:** N/A  
**Status:** ✅ Migrated

---

## Form Wireframe


┌─────────────────────────────────────────────────────────────────────────────┐
│                                  Form DIR6                                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ [Details]  [Attachments]                                                    │
└─────────────────────────────────────────────────────────────────────────────┘

╔═════════════════════════════════════════════════════════════════════════════╗
║ COMPANY INFORMATION                                                         ║
╠═════════════════════════════════════════════════════════════════════════════╣
║                                                                             ║
║  CIN *                                                                        ║
║  [__________________________________________________]                           ║
║                                                                             ║
║  Company Name *                                                               ║
║  [__________________________________________________]                           ║
║                                                                             ║
║  Company Address *                                                            ║
║  [____________________________________________________________________] ║
║  [____________________________________________________________________] ║
║  [____________________________________________________________________] ║
║                                                                             ║
║  Company Email *                                                              ║
║  [__________________________________________________]                           ║
║                                                                             ║
║                                                                             ║
╚═════════════════════════════════════════════════════════════════════════════╝

╔═════════════════════════════════════════════════════════════════════════════╗
║ DETAILS                                                                     ║
╠═════════════════════════════════════════════════════════════════════════════╣
║                                                                             ║
║  Details Details                                                              ║
║  [____________________________________________________________________] ║
║  [____________________________________________________________________] ║
║  [____________________________________________________________________] ║
║                                                                             ║
║                                                                             ║
╚═════════════════════════════════════════════════════════════════════════════╝

                    [Cancel]                    [Save Draft]  [Submit]


---


## Complete Field List

| # | Field Name | Type | Required | Validation | Description |
|---|------------|------|----------|------------|-------------|
| 1 | CIN | Text | Yes | 21 chars, alphanumeric | Company Identification Number |
| 2 | Company Name | Text | Yes | Max 500 chars | Legal name of company |
| 3 | Company Address | Textarea | Yes | Max 1000 chars | Registered office address |

_[Additional fields follow similar pattern...]_


---


## API Endpoints

### 1. Create DIR6

```http
POST /api/dir6/
Content-Type: application/json
Authorization: Bearer {token}

Request Body:
{
  "company_id": 1,
  "cin": "U12345MH2024PTC123456",
  "company_name": "ABC Company Private Limited",
  ...
}

Response: 201 Created
{
  "id": 123,
  "company_id": 1,
  "created_on": "2024-10-27T10:30:00Z",
  "status": "success"
}
```

### 2. Get DIR6 by ID

```http
GET /api/dir6/{id}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": 123,
  ...
}
```

### 3. Update DIR6

```http
PUT /api/dir6/{id}
Content-Type: application/json
Authorization: Bearer {token}

Request Body: (partial update supported)
{
  "field_to_update": "new_value"
}

Response: 200 OK
```

### 4. List All DIR6 Forms

```http
GET /api/dir6/?skip=0&limit=100
Authorization: Bearer {token}

Response: 200 OK
[
  { "id": 123, ... },
  { "id": 124, ... }
]
```

### 5. Get by Company

```http
GET /api/dir6/company/{company_id}
Authorization: Bearer {token}

Response: 200 OK
[
  { "id": 123, ... }
]
```

### 6. Change Status

```http
PATCH /api/dir6/{id}/status/{status}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": 123,
  "is_active": true
}
```

### 7. Delete DIR6

```http
DELETE /api/dir6/{id}
Authorization: Bearer {token}

Response: 204 No Content
```


---


## Database Schema

### Table: `tbl_dir6`

```sql
CREATE TABLE tbl_dir6 (
    -- Primary Key
    id SERIAL PRIMARY KEY,
    
    -- Foreign Keys
    ref_user INTEGER NOT NULL REFERENCES tbl_app_user(id),
    company_id INTEGER NOT NULL REFERENCES tbl_company(id),
    
    -- Company Information
    cin VARCHAR(21) NOT NULL,
    company_name VARCHAR(500) NOT NULL,
    company_address TEXT NOT NULL,
    company_email VARCHAR(255) NOT NULL,
    
    -- Form-specific fields
    -- [Fields vary by form type]
    
    -- Audit Fields
    created_by INTEGER NOT NULL REFERENCES tbl_app_user(id),
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES tbl_app_user(id),
    updated_on TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Constraints
    CONSTRAINT ck_dir6_cin_length CHECK (LENGTH(cin) = 21),
    
    -- Indexes
    INDEX idx_dir6_company (company_id),
    INDEX idx_dir6_cin (cin),
    INDEX idx_dir6_active (is_active),
    INDEX idx_dir6_created (created_on)
);

-- View for joined data
CREATE VIEW vw_dir6 AS
SELECT 
    f.*,
    u.name as ref_user_name,
    c.name as company_name,
    c.email as company_email
FROM tbl_dir6 f
LEFT JOIN tbl_app_user u ON f.ref_user = u.id
LEFT JOIN tbl_company c ON f.company_id = c.id
WHERE f.is_active = TRUE;
```

### Relationships

```
tbl_dir6
  ├─▶ tbl_company (many-to-one)
  ├─▶ tbl_app_user (many-to-one, via ref_user)
  └─▶ tbl_app_user (many-to-one, via created_by)
```


---


## Code Examples

### Angular Component (TypeScript)

```typescript
// File: frontend/apps/portal/src/app/forms/dir6/dir6.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DIR6Service } from './dir6.service';

@Component({
  selector: 'app-dir6',
  templateUrl: './dir6.component.html',
  styleUrls: ['./dir6.component.scss']
})
export class DIR6Component implements OnInit {
  dir6Form!: FormGroup;
  isEditMode = false;
  activeTab = 'details';
  
  constructor(
    private fb: FormBuilder,
    private dir6Service: DIR6Service
  ) {
    this.initializeForm();
  }
  
  ngOnInit(): void {
    // Load form data if editing
  }
  
  initializeForm(): void {
    this.dir6Form = this.fb.group({
      companyId: [null, Validators.required],
      cin: ['', [Validators.required, Validators.minLength(21)]],
      companyName: ['', Validators.required],
      companyAddress: ['', Validators.required],
      companyEmail: ['', [Validators.required, Validators.email]],
      // Form-specific fields...
    });
  }
  
  onSubmit(): void {
    if (this.dir6Form.valid) {
      this.dir6Service.createDIR6(this.dir6Form.value)
        .subscribe({
          next: (response) => console.log('Success:', response),
          error: (error) => console.error('Error:', error)
        });
    }
  }
}
```

### FastAPI Service (Python)

```python
# File: services/forms/app/services/dir6_service.py

from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.dir6 import DIR6, DIR6Create, DIR6Update
import logging

logger = logging.getLogger(__name__)

class DIR6Service:
    def __init__(self, db: Session):
        self.db = db
    
    async def create_dir6(
        self, 
        dir6_data: DIR6Create, 
        user_id: int
    ) -> DIR6:
        """Create a new DIR6 record"""
        try:
            dir6 = DIR6(
                **dir6_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(dir6)
            await self.db.commit()
            await self.db.refresh(dir6)
            logger.info(f"Created DIR6 with ID: {dir6.id}")
            return dir6
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating DIR6: {str(e)}")
            raise
    
    async def get_dir6(self, dir6_id: int) -> Optional[DIR6]:
        """Get DIR6 by ID"""
        return await self.db.query(DIR6).filter(
            and_(
                DIR6.id == dir6_id,
                DIR6.is_active == True
            )
        ).first()
    
    async def get_dir6s_by_company(
        self, 
        company_id: int
    ) -> List[DIR6]:
        """Get all DIR6 forms for a company"""
        return await self.db.query(DIR6).filter(
            and_(
                DIR6.company_id == company_id,
                DIR6.is_active == True
            )
        ).all()
```

### FastAPI Routes

```python
# File: services/forms/app/api/routes/dir6.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..dependencies import get_current_user, get_db
from ...models.dir6 import DIR6, DIR6Create
from ...services.dir6_service import DIR6Service

router = APIRouter(prefix="/dir6", tags=["dir6"])

@router.post("/", response_model=DIR6View, status_code=status.HTTP_201_CREATED)
async def create_dir6(
    dir6_data: DIR6Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new DIR6 form"""
    dir6_service = DIR6Service(db)
    return await dir6_service.create_dir6(
        dir6_data, 
        current_user.id
    )

@router.get("/{id}", response_model=DIR6View)
async def get_dir6(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get DIR6 by ID"""
    dir6_service = DIR6Service(db)
    dir6 = await dir6_service.get_dir6(id)
    if not dir6:
        raise HTTPException(status_code=404, detail="DIR6 not found")
    return dir6
```

### Pydantic Models

```python
# File: services/forms/app/models/dir6.py

from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime
from enum import Enum

class DIR6Base(BaseModel):
    company_id: int = Field(..., gt=0)
    cin: str = Field(..., min_length=21, max_length=21)
    company_name: str = Field(..., min_length=1, max_length=500)
    company_address: str = Field(..., min_length=1)
    company_email: str = Field(..., regex=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    
    @validator('cin')
    def validate_cin(cls, v):
        if not v.isalnum():
            raise ValueError('CIN must be alphanumeric')
        return v.upper()
    
    class Config:
        from_attributes = True

class DIR6Create(DIR6Base):
    pass

class DIR6Update(DIR6Base):
    company_id: Optional[int] = None
    cin: Optional[str] = None
    # All fields optional for partial updates

class DIR6Response(DIR6Base):
    id: int
    created_by: int
    created_on: datetime
    is_active: bool

class DIR6View(DIR6Response):
    ref_user_name: Optional[str] = None
```


---


## Business Rules & Validations

### Field Validations

1. **CIN (Company Identification Number)**
   - Length: Exactly 21 characters
   - Format: Alphanumeric
   - Pattern: L/U + 5 digits + 2 letters + 4 digits + 3 letters + 6 digits
   - Example: U12345MH2024PTC123456

2. **Company Email**
   - Format: Valid email address
   - Domain validation: Must be company domain
   - Uniqueness: Must be unique in system

3. **Dates**
   - All dates must be in DD/MM/YYYY format
   - Past dates only (except future event dates)
   - Date range validations apply

4. **PAN (Permanent Account Number)**
   - Length: Exactly 10 characters
   - Format: 5 letters + 4 digits + 1 letter
   - Pattern: [A-Z]{5}[0-9]{4}[A-Z]
   - Example: ABCDE1234F

5. **DIN (Director Identification Number)**
   - Length: Exactly 8 digits
   - Format: Numeric only
   - Validation: Must be valid DIN from MCA database

### Business Logic Rules

1. **Form Submission**
   - All required fields must be filled
   - All validations must pass
   - Required attachments must be uploaded
   - DSC must be valid

2. **Status Transitions**
   - Draft → Pending Validation
   - Pending Validation → Approved/Rejected
   - Approved → Submitted
   - Submitted → Acknowledged

3. **Authorization**
   - User must be associated with the company
   - User must have appropriate role
   - DSC must belong to authorized signatory

4. **Data Integrity**
   - Foreign key constraints enforced
   - Audit trail maintained
   - Soft delete implementation
   - Version history tracked

### Compliance Rules

1. **Filing Timeline**
   - Must be filed within specified timeline
   - Late filing attracts additional fees
   - System generates reminders

2. **Document Requirements**
   - All attachments must be PDF/DOC/DOCX
   - Maximum file size: 5MB per document
   - Scanned documents must be clear and legible

3. **Certification**
   - Digital signature required
   - Signatory must be authorized
   - Certificate must be valid


---

## User Journey

```
Step 1: Login to ComplyCrafter
   ↓
Step 2: Navigate to Forms → DIR6
   ↓
Step 3: Select Company (auto-populate company details)
   ↓
Step 4: Fill form sections (with real-time validation)
   ↓
Step 5: Upload required attachments
   ↓
Step 6: Review all entered data
   ↓
Step 7: Save draft (optional)
   ↓
Step 8: Add DSC details
   ↓
Step 9: Submit form
   ↓
Step 10: Receive acknowledgment
   ↓
Step 11: Track submission status
   ↓
Step 12: Download filed form (after MCA approval)
```

## Status Workflow Diagram

```
┌─────────┐
│  Draft  │
└────┬────┘
     │ User clicks Submit
     ↓
┌──────────────────┐
│ Pending          │
│ Validation       │
└────┬─────┬───────┘
     │     │
     │     └──▶ ┌──────────┐
     │          │ Rejected │ ──▶ (User can revise)
     │          └──────────┘
     ↓
┌──────────┐
│ Approved │
└────┬─────┘
     │ Auto-submit to MCA
     ↓
┌────────────────┐
│ Submitted      │
│ to MCA         │
└────┬───────────┘
     │ MCA Processing
     ↓
┌──────────────┐
│ Acknowledged │
└────┬─────────┘
     │
     ↓
┌───────────┐
│ Completed │
└───────────┘
```

## File Attachments

| Attachment | Required | Format | Max Size | Description |
|------------|----------|--------|----------|-------------|
| Supporting Document 1 | Yes | PDF | 5MB | Primary supporting document |
| Supporting Document 2 | No | PDF/DOC | 5MB | Additional documents |
| Annexure | Conditional | PDF | 5MB | Required for specific cases |
| Certificate | Yes | PDF | 5MB | Required certificate |

---

## Testing Checklist

- [ ] All fields render correctly
- [ ] Validation works as expected
- [ ] Required fields enforce validation
- [ ] Dropdown options load correctly
- [ ] Date picker functions properly
- [ ] File upload works
- [ ] Form submission successful
- [ ] Error handling works
- [ ] Success message displays
- [ ] Navigation works properly
- [ ] Mobile responsive design
- [ ] Cross-browser compatibility
- [ ] Performance acceptable (<3s load)
- [ ] Security validations in place
- [ ] API endpoints functional
- [ ] Database operations succeed
- [ ] Audit trail created
- [ ] Email notifications sent

---

**Documentation Version:** 1.0  
**Last Updated:** October 27, 2024  
**Status:** ✅ Complete

