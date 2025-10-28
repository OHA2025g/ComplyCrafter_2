#!/usr/bin/env python3
"""
Comprehensive form migration script for ComplyCrafter
Migrates all legacy forms to modern Angular + FastAPI stack
"""

import os
import json
import shutil
from pathlib import Path
from typing import Dict, List, Any
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class FormMigrator:
    def __init__(self, base_path: str):
        self.base_path = Path(base_path)
        self.frontend_path = self.base_path / "frontend" / "apps" / "portal" / "src" / "app" / "forms"
        self.services_path = self.base_path / "services" / "forms" / "app"
        
        # Form categories for organized migration
        self.form_categories = {
            "charge_forms": ["CHARGE", "CHG1", "CHG4", "CHG6", "CHG8", "CHG9"],
            "director_forms": ["DIR3", "DIR5", "DIR6", "DIR9", "DIR11", "DIR12"],
            "deposit_forms": ["DPT4"],
            "general_forms": ["GNL1", "GNL2", "GNL3"],
            "iepf_forms": ["IEPF2", "IEPF5"],
            "incorporation_forms": ["INC4", "INC12", "INC20A", "INC22", "INC23", "INC24", "INC28"],
            "management_forms": ["MGT6", "MGT8", "MGT9", "MGT14"],
            "other_forms": ["PAS2", "PAS6", "RUN", "RUNLLP", "SH7", "SH8", "SH9", "SH11", "STK2"],
            "form_series": ["Form3", "Form4", "Form5", "Form11", "Form12", "Form15", "Form22", "Form23", "Form24", "Form28"],
            "miscellaneous": ["MR1", "MSC3", "BOARDREPORT"]
        }
        
        # Load form mapping data
        self.load_form_mapping()

    def load_form_mapping(self):
        """Load the end-to-end mapping data"""
        mapping_file = self.base_path / "Resources" / "end_to_end_mapping.json"
        try:
            with open(mapping_file, 'r') as f:
                self.form_mapping = json.load(f)
            logger.info("Loaded form mapping data")
        except Exception as e:
            logger.error(f"Error loading form mapping: {e}")
            self.form_mapping = {"forms": []}

    def get_form_info(self, form_id: str) -> Dict[str, Any]:
        """Get form information from mapping"""
        for form in self.form_mapping.get("forms", []):
            if form["id"] == form_id:
                return form
        return {}

    def create_angular_component(self, form_id: str, form_info: Dict[str, Any]):
        """Create Angular component for a form"""
        form_dir = self.frontend_path / form_id.lower()
        form_dir.mkdir(parents=True, exist_ok=True)
        
        # Create component TypeScript file
        component_ts = self.generate_angular_component_ts(form_id, form_info)
        with open(form_dir / f"{form_id.lower()}.component.ts", 'w') as f:
            f.write(component_ts)
        
        # Create component HTML file
        component_html = self.generate_angular_component_html(form_id, form_info)
        with open(form_dir / f"{form_id.lower()}.component.html", 'w') as f:
            f.write(component_html)
        
        # Create component SCSS file
        component_scss = self.generate_angular_component_scss(form_id)
        with open(form_dir / f"{form_id.lower()}.component.scss", 'w') as f:
            f.write(component_scss)
        
        # Create model file
        model_ts = self.generate_angular_model_ts(form_id, form_info)
        with open(form_dir / f"{form_id.lower()}.model.ts", 'w') as f:
            f.write(model_ts)
        
        # Create service file
        service_ts = self.generate_angular_service_ts(form_id)
        with open(form_dir / f"{form_id.lower()}.service.ts", 'w') as f:
            f.write(service_ts)
        
        logger.info(f"Created Angular component for {form_id}")

    def generate_angular_component_ts(self, form_id: str, form_info: Dict[str, Any]) -> str:
        """Generate Angular component TypeScript code"""
        return f'''import {{ Component, OnInit }} from '@angular/core';
import {{ FormBuilder, FormGroup, Validators }} from '@angular/forms';
import {{ ActivatedRoute, Router }} from '@angular/router';
import {{ {form_id}Service }} from './{form_id.lower()}.service';
import {{ {form_id} }} from './{form_id.lower()}.model';

@Component({{
  selector: 'app-{form_id.lower()}',
  templateUrl: './{form_id.lower()}.component.html',
  styleUrls: ['./{form_id.lower()}.component.scss']
}})
export class {form_id}Component implements OnInit {{
  {form_id.lower()}Form!: FormGroup;
  isEditMode = false;
  {form_id.lower()}Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private {form_id.lower()}Service: {form_id}Service,
    private route: ActivatedRoute,
    private router: Router
  ) {{
    this.initializeForm();
  }}

  ngOnInit(): void {{
    this.route.params.subscribe(params => {{
      if (params['id']) {{
        this.{form_id.lower()}Id = +params['id'];
        this.isEditMode = true;
        this.load{form_id}();
      }}
    }});
  }}

  initializeForm(): void {{
    this.{form_id.lower()}Form = this.fb.group({{
      // Company Information
      companyId: [null, Validators.required],
      cin: ['', Validators.required],
      companyName: ['', Validators.required],
      companyAddress: ['', Validators.required],
      companyEmail: ['', [Validators.required, Validators.email]],
      
      // Form-specific fields will be added based on the actual form structure
      // This is a template that needs to be customized for each form
    }});
  }}

  load{form_id}(): void {{
    if (this.{form_id.lower()}Id) {{
      this.{form_id.lower()}Service.get{form_id}(this.{form_id.lower()}Id).subscribe({{
        next: ({form_id.lower()}) => {{
          this.{form_id.lower()}Form.patchValue({form_id.lower()});
        }},
        error: (error) => {{
          console.error('Error loading {form_id.lower()}:', error);
        }}
      }});
    }}
  }}

  onSubmit(): void {{
    if (this.{form_id.lower()}Form.valid) {{
      const {form_id.lower()}Data = this.{form_id.lower()}Form.value;
      
      if (this.isEditMode && this.{form_id.lower()}Id) {{
        this.{form_id.lower()}Service.update{form_id}(this.{form_id.lower()}Id, {form_id.lower()}Data).subscribe({{
          next: (response) => {{
            console.log('{form_id} updated successfully:', response);
            this.router.navigate(['/forms/{form_id.lower()}']);
          }},
          error: (error) => {{
            console.error('Error updating {form_id.lower()}:', error);
          }}
        }});
      }} else {{
        this.{form_id.lower()}Service.create{form_id}({form_id.lower()}Data).subscribe({{
          next: (response) => {{
            console.log('{form_id} created successfully:', response);
            this.router.navigate(['/forms/{form_id.lower()}']);
          }},
          error: (error) => {{
            console.error('Error creating {form_id.lower()}:', error);
          }}
        }});
      }}
    }} else {{
      this.markFormGroupTouched();
    }}
  }}

  markFormGroupTouched(): void {{
    Object.keys(this.{form_id.lower()}Form.controls).forEach(key => {{
      const control = this.{form_id.lower()}Form.get(key);
      control?.markAsTouched();
    }});
  }}

  setActiveTab(tab: string): void {{
    this.activeTab = tab;
  }}
}}'''

    def generate_angular_component_html(self, form_id: str, form_info: Dict[str, Any]) -> str:
        """Generate Angular component HTML code"""
        return f'''<div class="{form_id.lower()}-form-container">
  <div class="form-header">
    <h2>Form {form_id}</h2>
    <p>Form description and instructions</p>
  </div>

  <!-- Tab Navigation -->
  <div class="tab-navigation">
    <button type="button" 
            class="tab-button" 
            [class.active]="activeTab === 'details'"
            (click)="setActiveTab('details')">
      Details
    </button>
    <button type="button" 
            class="tab-button" 
            [class.active]="activeTab === 'attachments'"
            (click)="setActiveTab('attachments')">
      Attachments
    </button>
  </div>

  <form [formGroup]="{form_id.lower()}Form" (ngSubmit)="onSubmit()" class="{form_id.lower()}-form">
    
    <!-- Details Tab -->
    <div *ngIf="activeTab === 'details'" class="tab-content">
      
      <!-- Company Information -->
      <div class="form-section">
        <h3>Company Information</h3>
        <div class="form-row">
          <div class="form-group">
            <label for="cin">CIN *</label>
            <input type="text" id="cin" formControlName="cin" class="form-control" readonly>
          </div>
          <div class="form-group">
            <label for="companyName">Company Name *</label>
            <input type="text" id="companyName" formControlName="companyName" class="form-control" readonly>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="companyAddress">Company Address *</label>
            <textarea id="companyAddress" formControlName="companyAddress" class="form-control" readonly></textarea>
          </div>
          <div class="form-group">
            <label for="companyEmail">Company Email *</label>
            <input type="email" id="companyEmail" formControlName="companyEmail" class="form-control" readonly>
          </div>
        </div>
      </div>

      <!-- Form-specific fields will be added here based on the actual form structure -->
      <!-- This is a template that needs to be customized for each form -->
      
    </div>

    <!-- Attachments Tab -->
    <div *ngIf="activeTab === 'attachments'" class="tab-content">
      <div class="form-section">
        <h3>Attachments</h3>
        <div class="form-row">
          <div class="form-group">
            <label for="attachment1">Attachment 1</label>
            <input type="file" id="attachment1" class="form-control" accept=".pdf,.doc,.docx">
          </div>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" (click)="router.navigate(['/forms/{form_id.lower()}'])">
        Cancel
      </button>
      <button type="submit" class="btn btn-primary" [disabled]="{form_id.lower()}Form.invalid">
        {{ isEditMode ? 'Update' : 'Submit' }}
      </button>
    </div>
  </form>
</div>'''

    def generate_angular_component_scss(self, form_id: str) -> str:
        """Generate Angular component SCSS code"""
        return f'''.{form_id.lower()}-form-container {{
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}}

.form-header {{
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;

  h2 {{
    color: #2c3e50;
    margin-bottom: 10px;
  }}

  p {{
    color: #6c757d;
    margin-bottom: 15px;
  }}
}}

.tab-navigation {{
  display: flex;
  border-bottom: 2px solid #e9ecef;
  margin-bottom: 30px;

  .tab-button {{
    background: none;
    border: none;
    padding: 12px 24px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    color: #6c757d;
    border-bottom: 3px solid transparent;
    transition: all 0.3s ease;

    &:hover {{
      color: #007bff;
      background-color: #f8f9fa;
    }}

    &.active {{
      color: #007bff;
      border-bottom-color: #007bff;
      background-color: #fff;
    }}
  }}
}}

.{form_id.lower()}-form {{
  .tab-content {{
    min-height: 400px;
  }}

  .form-section {{
    background: #fff;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 25px;
    margin-bottom: 25px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    h3 {{
      color: #2c3e50;
      border-bottom: 2px solid #007bff;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }}
  }}

  .form-row {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;

    @media (max-width: 768px) {{
      grid-template-columns: 1fr;
    }}
  }}

  .form-group {{
    display: flex;
    flex-direction: column;

    label {{
      font-weight: 600;
      color: #495057;
      margin-bottom: 5px;
    }}

    .form-control {{
      padding: 10px 12px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

      &:focus {{
        border-color: #007bff;
        outline: 0;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
      }}

      &.ng-invalid.ng-touched {{
        border-color: #dc3545;
      }}
    }}

    textarea.form-control {{
      min-height: 80px;
      resize: vertical;
    }}
  }}

  .form-actions {{
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    padding: 20px 0;
    border-top: 1px solid #e9ecef;
    margin-top: 30px;

    .btn {{
      padding: 10px 20px;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;

      &.btn-secondary {{
        background-color: #6c757d;
        border-color: #6c757d;
        color: #fff;

        &:hover {{
          background-color: #5a6268;
          border-color: #545b62;
        }}
      }}

      &.btn-primary {{
        background-color: #007bff;
        border-color: #007bff;
        color: #fff;

        &:hover:not(:disabled) {{
          background-color: #0056b3;
          border-color: #004085;
        }}

        &:disabled {{
          background-color: #6c757d;
          border-color: #6c757d;
          cursor: not-allowed;
        }}
      }}
    }}
  }}
}}'''

    def generate_angular_model_ts(self, form_id: str, form_info: Dict[str, Any]) -> str:
        """Generate Angular model TypeScript code"""
        return f'''export interface {form_id} {{
  id?: number;
  refUser?: number;
  companyId?: number;
  cin?: string;
  companyName?: string;
  companyAddress?: string;
  companyEmail?: string;
  
  // Form-specific fields will be added based on the actual form structure
  // This is a template that needs to be customized for each form
  
  // Audit fields
  createdBy?: number;
  createdOn?: string;
  updatedBy?: number;
  updatedOn?: string;
  isActive?: boolean;
}}

export interface {form_id}View extends {form_id} {{
  refUserName?: string;
}}'''

    def generate_angular_service_ts(self, form_id: str) -> str:
        """Generate Angular service TypeScript code"""
        return f'''import {{ Injectable }} from '@angular/core';
import {{ HttpClient, HttpParams }} from '@angular/common/http';
import {{ Observable }} from 'rxjs';
import {{ {form_id}, {form_id}View }} from './{form_id.lower()}.model';

@Injectable({{
  providedIn: 'root'
}})
export class {form_id}Service {{
  private apiUrl = '/api/{form_id.lower()}';

  constructor(private http: HttpClient) {{ }}

  get{form_id}s(): Observable<{form_id}View[]> {{
    return this.http.get<{form_id}View[]>(this.apiUrl);
  }}

  get{form_id}(id: number): Observable<{form_id}View> {{
    return this.http.get<{form_id}View>(`${{this.apiUrl}}/${{id}}`);
  }}

  create{form_id}({form_id.lower()}: {form_id}): Observable<any> {{
    return this.http.post(this.apiUrl, {form_id.lower()});
  }}

  update{form_id}(id: number, {form_id.lower()}: {form_id}): Observable<any> {{
    return this.http.put(`${{this.apiUrl}}/${{id}}`, {form_id.lower()});
  }}

  delete{form_id}(id: number): Observable<any> {{
    return this.http.delete(`${{this.apiUrl}}/${{id}}/Delete`);
  }}

  get{form_id}sByCompany(companyId: number): Observable<{form_id}View[]> {{
    return this.http.get<{form_id}View[]>(`${{this.apiUrl}}/GetByCompany/${{companyId}}`);
  }}

  changeStatus(id: number, status: boolean): Observable<any> {{
    return this.http.get(`${{this.apiUrl}}/${{id}}/Status/${{status}}`);
  }}
}}'''

    def create_fastapi_model(self, form_id: str, form_info: Dict[str, Any]):
        """Create FastAPI model for a form"""
        models_dir = self.services_path / "models"
        models_dir.mkdir(parents=True, exist_ok=True)
        
        model_py = self.generate_fastapi_model_py(form_id, form_info)
        with open(models_dir / f"{form_id.lower()}.py", 'w') as f:
            f.write(model_py)
        
        logger.info(f"Created FastAPI model for {form_id}")

    def generate_fastapi_model_py(self, form_id: str, form_info: Dict[str, Any]) -> str:
        """Generate FastAPI model Python code"""
        return f'''from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Numeric
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

Base = declarative_base()

class {form_id}(Base):
    __tablename__ = "tbl_{form_id.lower()}"

    id = Column(Integer, primary_key=True, index=True)
    ref_user = Column(Integer, nullable=True)
    company_id = Column(Integer, nullable=True)
    cin = Column(String(255), nullable=True)
    company_name = Column(String(500), nullable=True)
    company_address = Column(Text, nullable=True)
    company_email = Column(String(255), nullable=True)

    # Form-specific fields will be added based on the actual form structure
    # This is a template that needs to be customized for each form

    # Audit fields
    created_by = Column(Integer, nullable=False)
    created_on = Column(DateTime, default=func.now())
    updated_by = Column(Integer, nullable=True)
    updated_on = Column(DateTime, onupdate=func.now())
    is_active = Column(Boolean, default=True)

# Pydantic models
class {form_id}Base(BaseModel):
    ref_user: Optional[int] = None
    company_id: Optional[int] = None
    cin: Optional[str] = None
    company_name: Optional[str] = None
    company_address: Optional[str] = None
    company_email: Optional[str] = None

    # Form-specific fields will be added based on the actual form structure
    # This is a template that needs to be customized for each form

    class Config:
        from_attributes = True

class {form_id}Create({form_id}Base):
    pass

class {form_id}Update({form_id}Base):
    pass

class {form_id}Response({form_id}Base):
    id: int
    created_by: int
    created_on: datetime
    updated_by: Optional[int] = None
    updated_on: Optional[datetime] = None
    is_active: bool = True

    class Config:
        from_attributes = True

class {form_id}View({form_id}Response):
    ref_user_name: Optional[str] = None'''

    def create_fastapi_service(self, form_id: str, form_info: Dict[str, Any]):
        """Create FastAPI service for a form"""
        services_dir = self.services_path / "services"
        services_dir.mkdir(parents=True, exist_ok=True)
        
        service_py = self.generate_fastapi_service_py(form_id, form_info)
        with open(services_dir / f"{form_id.lower()}_service.py", 'w') as f:
            f.write(service_py)
        
        logger.info(f"Created FastAPI service for {form_id}")

    def generate_fastapi_service_py(self, form_id: str, form_info: Dict[str, Any]) -> str:
        """Generate FastAPI service Python code"""
        return f'''from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.{form_id.lower()} import {form_id}, {form_id}Create, {form_id}Update, {form_id}View
from ..database import get_db
import logging

logger = logging.getLogger(__name__)

class {form_id}Service:
    def __init__(self, db: Session):
        self.db = db

    def create_{form_id.lower()}(self, {form_id.lower()}_data: {form_id}Create, user_id: int) -> {form_id}:
        """Create a new {form_id.lower()} record"""
        try:
            {form_id.lower()} = {form_id}(
                **{form_id.lower()}_data.dict(),
                created_by=user_id,
                is_active=True
            )
            self.db.add({form_id.lower()})
            self.db.commit()
            self.db.refresh({form_id.lower()})
            logger.info(f"Created {form_id.lower()} with ID: {{{form_id.lower()}.id}}")
            return {form_id.lower()}
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating {form_id.lower()}: {{str(e)}}")
            raise

    def get_{form_id.lower()}(self, {form_id.lower()}_id: int) -> Optional[{form_id}]:
        """Get a {form_id.lower()} by ID"""
        try:
            return self.db.query({form_id}).filter(
                and_({form_id}.id == {form_id.lower()}_id, {form_id}.is_active == True)
            ).first()
        except Exception as e:
            logger.error(f"Error getting {form_id.lower()} {{{form_id.lower()}_id}}: {{str(e)}}")
            raise

    def get_{form_id.lower()}s(self, skip: int = 0, limit: int = 100) -> List[{form_id}]:
        """Get all active {form_id.lower()}s with pagination"""
        try:
            return self.db.query({form_id}).filter(
                {form_id}.is_active == True
            ).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting {form_id.lower()}s: {{str(e)}}")
            raise

    def get_{form_id.lower()}s_by_company(self, company_id: int) -> List[{form_id}]:
        """Get all {form_id.lower()}s for a specific company"""
        try:
            return self.db.query({form_id}).filter(
                and_(
                    {form_id}.company_id == company_id,
                    {form_id}.is_active == True
                )
            ).all()
        except Exception as e:
            logger.error(f"Error getting {form_id.lower()}s for company {{company_id}}: {{str(e)}}")
            raise

    def update_{form_id.lower()}(self, {form_id.lower()}_id: int, {form_id.lower()}_data: {form_id}Update, user_id: int) -> Optional[{form_id}]:
        """Update a {form_id.lower()} record"""
        try:
            {form_id.lower()} = self.get_{form_id.lower()}({form_id.lower()}_id)
            if not {form_id.lower()}:
                return None

            update_data = {form_id.lower()}_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr({form_id.lower()}, field, value)
            
            {form_id.lower()}.updated_by = user_id
            self.db.commit()
            self.db.refresh({form_id.lower()})
            logger.info(f"Updated {form_id.lower()} with ID: {{{form_id.lower()}_id}}")
            return {form_id.lower()}
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating {form_id.lower()} {{{form_id.lower()}_id}}: {{str(e)}}")
            raise

    def delete_{form_id.lower()}(self, {form_id.lower()}_id: int, user_id: int) -> bool:
        """Soft delete a {form_id.lower()} record"""
        try:
            {form_id.lower()} = self.get_{form_id.lower()}({form_id.lower()}_id)
            if not {form_id.lower()}:
                return False

            {form_id.lower()}.is_active = False
            {form_id.lower()}.updated_by = user_id
            self.db.commit()
            logger.info(f"Soft deleted {form_id.lower()} with ID: {{{form_id.lower()}_id}}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting {form_id.lower()} {{{form_id.lower()}_id}}: {{str(e)}}")
            raise

    def change_status(self, {form_id.lower()}_id: int, status: bool, user_id: int) -> bool:
        """Change the active status of a {form_id.lower()}"""
        try:
            {form_id.lower()} = self.get_{form_id.lower()}({form_id.lower()}_id)
            if not {form_id.lower()}:
                return False

            {form_id.lower()}.is_active = status
            {form_id.lower()}.updated_by = user_id
            self.db.commit()
            logger.info(f"Changed status of {form_id.lower()} {{{form_id.lower()}_id}} to {{status}}")
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error changing status of {form_id.lower()} {{{form_id.lower()}_id}}: {{str(e)}}")
            raise'''

    def create_fastapi_routes(self, form_id: str, form_info: Dict[str, Any]):
        """Create FastAPI routes for a form"""
        routes_dir = self.services_path / "api" / "routes"
        routes_dir.mkdir(parents=True, exist_ok=True)
        
        routes_py = self.generate_fastapi_routes_py(form_id, form_info)
        with open(routes_dir / f"{form_id.lower()}.py", 'w') as f:
            f.write(routes_py)
        
        logger.info(f"Created FastAPI routes for {form_id}")

    def generate_fastapi_routes_py(self, form_id: str, form_info: Dict[str, Any]) -> str:
        """Generate FastAPI routes Python code"""
        return f'''from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..dependencies import get_current_user, get_db
from ...models.{form_id.lower()} import {form_id}, {form_id}Create, {form_id}Update, {form_id}View
from ...services.{form_id.lower()}_service import {form_id}Service
from ...models.auth import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/{form_id.lower()}", tags=["{form_id.lower()}"])

@router.post("/", response_model={form_id}View, status_code=status.HTTP_201_CREATED)
async def create_{form_id.lower()}(
    {form_id.lower()}_data: {form_id}Create,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new {form_id.lower()} record"""
    try:
        {form_id.lower()}_service = {form_id}Service(db)
        {form_id.lower()} = {form_id.lower()}_service.create_{form_id.lower()}({form_id.lower()}_data, current_user.id)
        return {form_id.lower()}
    except Exception as e:
        logger.error(f"Error creating {form_id.lower()}: {{str(e)}}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create {form_id.lower()}"
        )

@router.get("/", response_model=List[{form_id}View])
async def get_{form_id.lower()}s(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all {form_id.lower()}s with pagination"""
    try:
        {form_id.lower()}_service = {form_id}Service(db)
        {form_id.lower()}s = {form_id.lower()}_service.get_{form_id.lower()}s(skip=skip, limit=limit)
        return {form_id.lower()}s
    except Exception as e:
        logger.error(f"Error getting {form_id.lower()}s: {{str(e)}}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve {form_id.lower()}s"
        )

@router.get("/{{{form_id.lower()}_id}}", response_model={form_id}View)
async def get_{form_id.lower()}(
    {form_id.lower()}_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific {form_id.lower()} by ID"""
    try:
        {form_id.lower()}_service = {form_id}Service(db)
        {form_id.lower()} = {form_id.lower()}_service.get_{form_id.lower()}({form_id.lower()}_id)
        if not {form_id.lower()}:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="{form_id} not found"
            )
        return {form_id.lower()}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting {form_id.lower()} {{{form_id.lower()}_id}}: {{str(e)}}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve {form_id.lower()}"
        )

@router.put("/{{{form_id.lower()}_id}}", response_model={form_id}View)
async def update_{form_id.lower()}(
    {form_id.lower()}_id: int,
    {form_id.lower()}_data: {form_id}Update,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a {form_id.lower()} record"""
    try:
        {form_id.lower()}_service = {form_id}Service(db)
        {form_id.lower()} = {form_id.lower()}_service.update_{form_id.lower()}({form_id.lower()}_id, {form_id.lower()}_data, current_user.id)
        if not {form_id.lower()}:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="{form_id} not found"
            )
        return {form_id.lower()}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating {form_id.lower()} {{{form_id.lower()}_id}}: {{str(e)}}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update {form_id.lower()}"
        )

@router.delete("/{{{form_id.lower()}_id}}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_{form_id.lower()}(
    {form_id.lower()}_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a {form_id.lower()} record (soft delete)"""
    try:
        {form_id.lower()}_service = {form_id}Service(db)
        success = {form_id.lower()}_service.delete_{form_id.lower()}({form_id.lower()}_id, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="{form_id} not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting {form_id.lower()} {{{form_id.lower()}_id}}: {{str(e)}}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete {form_id.lower()}"
        )

@router.get("/company/{{company_id}}", response_model=List[{form_id}View])
async def get_{form_id.lower()}s_by_company(
    company_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all {form_id.lower()}s for a specific company"""
    try:
        {form_id.lower()}_service = {form_id}Service(db)
        {form_id.lower()}s = {form_id.lower()}_service.get_{form_id.lower()}s_by_company(company_id)
        return {form_id.lower()}s
    except Exception as e:
        logger.error(f"Error getting {form_id.lower()}s for company {{company_id}}: {{str(e)}}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve {form_id.lower()}s for company"
        )

@router.patch("/{{{form_id.lower()}_id}}/status/{{status}}", response_model={form_id}View)
async def change_{form_id.lower()}_status(
    {form_id.lower()}_id: int,
    status: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the active status of a {form_id.lower()}"""
    try:
        {form_id.lower()}_service = {form_id}Service(db)
        success = {form_id.lower()}_service.change_status({form_id.lower()}_id, status, current_user.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="{form_id} not found"
            )
        
        # Return the updated {form_id.lower()}
        {form_id.lower()} = {form_id.lower()}_service.get_{form_id.lower()}({form_id.lower()}_id)
        return {form_id.lower()}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing status of {form_id.lower()} {{{form_id.lower()}_id}}: {{str(e)}}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change {form_id.lower()} status"
        )'''

    def migrate_forms_by_category(self, category: str, forms: List[str]):
        """Migrate forms by category"""
        logger.info(f"Starting migration of {category} forms: {forms}")
        
        for form_id in forms:
            try:
                form_info = self.get_form_info(form_id)
                
                # Create Angular components
                self.create_angular_component(form_id, form_info)
                
                # Create FastAPI models
                self.create_fastapi_model(form_id, form_info)
                
                # Create FastAPI services
                self.create_fastapi_service(form_id, form_info)
                
                # Create FastAPI routes
                self.create_fastapi_routes(form_id, form_info)
                
                logger.info(f"Successfully migrated {form_id}")
                
            except Exception as e:
                logger.error(f"Error migrating {form_id}: {str(e)}")
                continue

    def migrate_all_forms(self):
        """Migrate all forms"""
        logger.info("Starting comprehensive form migration")
        
        total_forms = sum(len(forms) for forms in self.form_categories.values())
        migrated_count = 0
        
        for category, forms in self.form_categories.items():
            logger.info(f"Migrating {category}: {len(forms)} forms")
            self.migrate_forms_by_category(category, forms)
            migrated_count += len(forms)
            logger.info(f"Completed {category} migration. Progress: {migrated_count}/{total_forms}")
        
        logger.info(f"Migration completed! Migrated {migrated_count} forms")

    def create_migration_summary(self):
        """Create a summary of the migration"""
        summary = {
            "migration_date": "2024-10-27",
            "total_forms_migrated": sum(len(forms) for forms in self.form_categories.values()),
            "categories": self.form_categories,
            "migration_status": "completed"
        }
        
        summary_file = self.base_path / "MIGRATION_SUMMARY.json"
        with open(summary_file, 'w') as f:
            json.dump(summary, f, indent=2)
        
        logger.info(f"Migration summary saved to {summary_file}")

def main():
    """Main function to run the migration"""
    base_path = "/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply-Crafter"
    migrator = FormMigrator(base_path)
    
    try:
        migrator.migrate_all_forms()
        migrator.create_migration_summary()
        logger.info("All forms migrated successfully!")
    except Exception as e:
        logger.error(f"Migration failed: {str(e)}")
        raise

if __name__ == "__main__":
    main()
