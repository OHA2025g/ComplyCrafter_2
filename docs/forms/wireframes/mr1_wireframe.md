# MR1: Form MR1

**Form Code:** MR1  
**Form Name:** N/A  
**Regulation:** N/A  
**Filing Timeline:** As required  
**Field Count:** N/A  
**Status:** ✅ Migrated

---

## Form Wireframe


┌─────────────────────────────────────────────────────────────────────────────┐
│                                   Form MR1                                  │
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

### 1. Create MR1

```http
POST /api/mr1/
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

### 2. Get MR1 by ID

```http
GET /api/mr1/{id}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": 123,
  ...
}
```

### 3. Update MR1

```http
PUT /api/mr1/{id}
Content-Type: application/json
Authorization: Bearer {token}

Request Body: (partial update supported)
{
  "field_to_update": "new_value"
}

Response: 200 OK
```

### 4. List All MR1 Forms

```http
GET /api/mr1/?skip=0&limit=100
Authorization: Bearer {token}

Response: 200 OK
[
  { "id": 123, ... },
  { "id": 124, ... }
]
```

### 5. Get by Company

```http
GET /api/mr1/company/{company_id}
Authorization: Bearer {token}

Response: 200 OK
[
  { "id": 123, ... }
]
```

### 6. Change Status

```http
PATCH /api/mr1/{id}/status/{status}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": 123,
  "is_active": true
}
```

### 7. Delete MR1

```http
DELETE /api/mr1/{id}
Authorization: Bearer {token}

Response: 204 No Content
```


---


## Database Schema

### Table: `tbl_mr1`

```sql
CREATE TABLE tbl_mr1 (
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
    CONSTRAINT ck_mr1_cin_length CHECK (LENGTH(cin) = 21),
    
    -- Indexes
    INDEX idx_mr1_company (company_id),
    INDEX idx_mr1_cin (cin),
    INDEX idx_mr1_active (is_active),
    INDEX idx_mr1_created (created_on)
);

-- View for joined data
CREATE VIEW vw_mr1 AS
SELECT 
    f.*,
    u.name as ref_user_name,
    c.name as company_name,
    c.email as company_email
FROM tbl_mr1 f
LEFT JOIN tbl_app_user u ON f.ref_user = u.id
LEFT JOIN tbl_company c ON f.company_id = c.id
WHERE f.is_active = TRUE;
```

### Relationships

```
tbl_mr1
  ├─▶ tbl_company (many-to-one)
  ├─▶ tbl_app_user (many-to-one, via ref_user)
  └─▶ tbl_app_user (many-to-one, via created_by)
```


---


## Code Examples

### Angular Component (TypeScript)

```typescript
// File: frontend/apps/portal/src/app/forms/mr1/mr1.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MR1Service } from './mr1.service';

@Component({
  selector: 'app-mr1',
  templateUrl: './mr1.component.html',
  styleUrls: ['./mr1.component.scss']
})
export class MR1Component implements OnInit {
  mr1Form!: FormGroup;
  isEditMode = false;
  activeTab = 'details';
  
  constructor(
    private fb: FormBuilder,
    private mr1Service: MR1Service
  ) {
    this.initializeForm();
  }
  
  ngOnInit(): void {
    // Load form data if editing
  }
  
  initializeForm(): void {
    this.mr1Form = this.fb.group({
      companyId: [null, Validators.required],
      cin: ['', [Validators.required, Validators.minLength(21)]],
      companyName: ['', Validators.required],
      companyAddress: ['', Validators.required],
      companyEmail: ['', [Validators.required, Validators.email]],
      // Form-specific fields...
    });
  }
  
  onSubmit(): void {
    if (this.mr1Form.valid) {
      this.mr1Service.createMR1(this.mr1Form.value)
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
# File: services/forms/app/services/mr1_service.py

from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.mr1 import MR1, MR1Create, MR1Update
import logging

logger = logging.getLogger(__name__)

class MR1Service:
    def __init__(self, db: Session):
        self.db = db
    
    async def create_mr1(
        self, 
        mr1_data: MR1Create, 
        user_id: int
    ) -> MR1:
        """Create a new MR1 record"""
        try:
            mr1 = MR1(
                **mr1_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add(mr1)
            await self.db.commit()
            await self.db.refresh(mr1)
            logger.info(f"Created MR1 with ID: {mr1.id}")
            return mr1
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating MR1: {str(e)}")
            raise
    
    async def get_mr1(self, mr1_id: int) -> Optional[MR1]:
        """Get MR1 by ID"""
        return await self.db.query(MR1).filter(
            and_(
                MR1.id == mr1_id,
                MR1.is_active == True
            )
        ).first()
    
    async def get_mr1s_by_company(
        self, 
        company_id: int
    ) -> List[MR1]:
        """Get all MR1 forms for a company"""
        return await self.db.query(MR1).filter(
            and_(
                MR1.company_id == company_id,
                MR1.is_active == True
            )
        ).all()
```

### FastAPI Routes

```python
# File: services/forms/app/api/routes/mr1.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..dependencies import get_current_user, get_db
from ...models.mr1 import MR1, MR1Create
from ...services.mr1_service import MR1Service

router = APIRouter(prefix="/mr1", tags=["mr1"])

@router.post("/", response_model=MR1View, status_code=status.HTTP_201_CREATED)
async def create_mr1(
    mr1_data: MR1Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new MR1 form"""
    mr1_service = MR1Service(db)
    return await mr1_service.create_mr1(
        mr1_data, 
        current_user.id
    )

@router.get("/{id}", response_model=MR1View)
async def get_mr1(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get MR1 by ID"""
    mr1_service = MR1Service(db)
    mr1 = await mr1_service.get_mr1(id)
    if not mr1:
        raise HTTPException(status_code=404, detail="MR1 not found")
    return mr1
```

### Pydantic Models

```python
# File: services/forms/app/models/mr1.py

from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime
from enum import Enum

class MR1Base(BaseModel):
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

class MR1Create(MR1Base):
    pass

class MR1Update(MR1Base):
    company_id: Optional[int] = None
    cin: Optional[str] = None
    # All fields optional for partial updates

class MR1Response(MR1Base):
    id: int
    created_by: int
    created_on: datetime
    is_active: bool

class MR1View(MR1Response):
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
Step 2: Navigate to Forms → MR1
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

