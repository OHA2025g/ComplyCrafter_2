# MSC3: Form MSC3

**Form Code:** MSC3  
**Form Name:** N/A  
**Regulation:** N/A  
**Filing Timeline:** As required  
**Field Count:** N/A  
**Status:** ✅ Migrated

---

## Form Wireframe


┌─────────────────────────────────────────────────────────────────────────────┐
│                                  Form MSC3                                  │
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

### 1. Create MSC3

```http
POST /api/msc3/
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

### 2. Get MSC3 by ID

```http
GET /api/msc3/{id}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": 123,
  ...
}
```

### 3. Update MSC3

```http
PUT /api/msc3/{id}
Content-Type: application/json
Authorization: Bearer {token}

Request Body: (partial update supported)
{
  "field_to_update": "new_value"
}

Response: 200 OK
```

### 4. List All MSC3 Forms

```http
GET /api/msc3/?skip=0&limit=100
Authorization: Bearer {token}

Response: 200 OK
[
  { "id": 123, ... },
  { "id": 124, ... }
]
```

### 5. Get by Company

```http
GET /api/msc3/company/{company_id}
Authorization: Bearer {token}

Response: 200 OK
[
  { "id": 123, ... }
]
```

### 6. Change Status

```http
PATCH /api/msc3/{id}/status/{status}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": 123,
  "is_active": true
}
```

### 7. Delete MSC3

```http
DELETE /api/msc3/{id}
Authorization: Bearer {token}

Response: 204 No Content
```


---


## Database Schema

### Table: `tbl_msc3`

```sql
CREATE TABLE tbl_msc3 (
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
    CONSTRAINT ck_msc3_cin_length CHECK (LENGTH(cin) = 21),
    
    -- Indexes
    INDEX idx_msc3_company (company_id),
    INDEX idx_msc3_cin (cin),
    INDEX idx_msc3_active (is_active),
    INDEX idx_msc3_created (created_on)
);

-- View for joined data
CREATE VIEW vw_msc3 AS
SELECT 
    f.*,
    u.name as ref_user_name,
    c.name as company_name,
    c.email as company_email
FROM tbl_msc3 f
LEFT JOIN tbl_app_user u ON f.ref_user = u.id
LEFT JOIN tbl_company c ON f.company_id = c.id
WHERE f.is_active = TRUE;
```

### Relationships

```
tbl_msc3
  ├─▶ tbl_company (many-to-one)
  ├─▶ tbl_app_user (many-to-one, via ref_user)
  └─▶ tbl_app_user (many-to-one, via created_by)
```


---


## Code Examples

### Angular Component (TypeScript)

```typescript
// File: frontend/apps/portal/src/app/forms/msc3/msc3.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MSC3Service } from './msc3.service';

@Component({
  selector: 'app-msc3',
  templateUrl: './msc3.component.html',
  styleUrls: ['./msc3.component.scss']
})
export class MSC3Component implements OnInit {
  msc3Form!: FormGroup;
  isEditMode = false;
  activeTab = 'details';
  
  constructor(
    private fb: FormBuilder,
    private msc3Service: MSC3Service
  ) {
    this.initializeForm();
  }
  
  ngOnInit(): void {
    // Load form data if editing
  }
  
  initializeForm(): void {
    this.msc3Form = this.fb.group({
      companyId: [null, Validators.required],
      cin: ['', [Validators.required, Validators.minLength(21)]],
      companyName: ['', Validators.required],
      companyAddress: ['', Validators.required],
      companyEmail: ['', [Validators.required, Validators.email]],
      // Form-specific fields...
    });
  }
  
  onSubmit(): void {
    if (this.msc3Form.valid) {
      this.msc3Service.createMSC3(this.msc3Form.value)
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
# File: services/forms/app/services/msc3_service.py

from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.msc3 import MSC3, MSC3Create, MSC3Update
import logging

logger = logging.getLogger(__name__)

class MSC3Service:
    def __init__(self, db: Session):
        self.db = db
    
    async def create_msc3(
        self, 
        msc3_data: MSC3Create, 
        user_id: int
    ) -> MSC3:
        """Create a new MSC3 record"""
        try:
            msc3 = MSC3(
                **msc3_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(msc3)
            await self.db.commit()
            await self.db.refresh(msc3)
            logger.info(f"Created MSC3 with ID: {msc3.id}")
            return msc3
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating MSC3: {str(e)}")
            raise
    
    async def get_msc3(self, msc3_id: int) -> Optional[MSC3]:
        """Get MSC3 by ID"""
        return await self.db.query(MSC3).filter(
            and_(
                MSC3.id == msc3_id,
                MSC3.is_active == True
            )
        ).first()
    
    async def get_msc3s_by_company(
        self, 
        company_id: int
    ) -> List[MSC3]:
        """Get all MSC3 forms for a company"""
        return await self.db.query(MSC3).filter(
            and_(
                MSC3.company_id == company_id,
                MSC3.is_active == True
            )
        ).all()
```

### FastAPI Routes

```python
# File: services/forms/app/api/routes/msc3.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..dependencies import get_current_user, get_db
from ...models.msc3 import MSC3, MSC3Create
from ...services.msc3_service import MSC3Service

router = APIRouter(prefix="/msc3", tags=["msc3"])

@router.post("/", response_model=MSC3View, status_code=status.HTTP_201_CREATED)
async def create_msc3(
    msc3_data: MSC3Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new MSC3 form"""
    msc3_service = MSC3Service(db)
    return await msc3_service.create_msc3(
        msc3_data, 
        current_user.id
    )

@router.get("/{id}", response_model=MSC3View)
async def get_msc3(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get MSC3 by ID"""
    msc3_service = MSC3Service(db)
    msc3 = await msc3_service.get_msc3(id)
    if not msc3:
        raise HTTPException(status_code=404, detail="MSC3 not found")
    return msc3
```

### Pydantic Models

```python
# File: services/forms/app/models/msc3.py

from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime
from enum import Enum

class MSC3Base(BaseModel):
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

class MSC3Create(MSC3Base):
    pass

class MSC3Update(MSC3Base):
    company_id: Optional[int] = None
    cin: Optional[str] = None
    # All fields optional for partial updates

class MSC3Response(MSC3Base):
    id: int
    created_by: int
    created_on: datetime
    is_active: bool

class MSC3View(MSC3Response):
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
Step 2: Navigate to Forms → MSC3
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

