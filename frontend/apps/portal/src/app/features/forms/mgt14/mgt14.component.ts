import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MGT14Service } from './mgt14.service';
import { MGT14 } from './mgt14.model';

@Component({
  selector: 'app-mgt14',
  templateUrl: './mgt14.component.html',
  styleUrls: ['./mgt14.component.scss']
})
export class MGT14Component implements OnInit {
  mgt14Form!: FormGroup;
  isEditMode = false;
  mgt14Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private mgt14Service: MGT14Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.mgt14Id = +params['id'];
        this.isEditMode = true;
        this.loadMGT14();
      }
    });
  }

  initializeForm(): void {
    this.mgt14Form = this.fb.group({
      // Company Information
      companyId: [null, Validators.required],
      cin: ['', Validators.required],
      companyName: ['', Validators.required],
      companyAddress: ['', Validators.required],
      companyEmail: ['', [Validators.required, Validators.email]],
      
      // Form-specific fields will be added based on the actual form structure
      // This is a template that needs to be customized for each form
    });
  }

  loadMGT14(): void {
    if (this.mgt14Id) {
      this.mgt14Service.getMGT14(this.mgt14Id).subscribe({
        next: (mgt14) => {
          this.mgt14Form.patchValue(mgt14);
        },
        error: (error) => {
          console.error('Error loading mgt14:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.mgt14Form.valid) {
      const mgt14Data = this.mgt14Form.value;
      
      if (this.isEditMode && this.mgt14Id) {
        this.mgt14Service.updateMGT14(this.mgt14Id, mgt14Data).subscribe({
          next: (response) => {
            console.log('MGT14 updated successfully:', response);
            this.router.navigate(['/forms/mgt14']);
          },
          error: (error) => {
            console.error('Error updating mgt14:', error);
          }
        });
      } else {
        this.mgt14Service.createMGT14(mgt14Data).subscribe({
          next: (response) => {
            console.log('MGT14 created successfully:', response);
            this.router.navigate(['/forms/mgt14']);
          },
          error: (error) => {
            console.error('Error creating mgt14:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.mgt14Form.controls).forEach(key => {
      const control = this.mgt14Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}