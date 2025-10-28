import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MGT6Service } from './mgt6.service';
import { MGT6 } from './mgt6.model';

@Component({
  selector: 'app-mgt6',
  templateUrl: './mgt6.component.html',
  styleUrls: ['./mgt6.component.scss']
})
export class MGT6Component implements OnInit {
  mgt6Form!: FormGroup;
  isEditMode = false;
  mgt6Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private mgt6Service: MGT6Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.mgt6Id = +params['id'];
        this.isEditMode = true;
        this.loadMGT6();
      }
    });
  }

  initializeForm(): void {
    this.mgt6Form = this.fb.group({
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

  loadMGT6(): void {
    if (this.mgt6Id) {
      this.mgt6Service.getMGT6(this.mgt6Id).subscribe({
        next: (mgt6) => {
          this.mgt6Form.patchValue(mgt6);
        },
        error: (error) => {
          console.error('Error loading mgt6:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.mgt6Form.valid) {
      const mgt6Data = this.mgt6Form.value;
      
      if (this.isEditMode && this.mgt6Id) {
        this.mgt6Service.updateMGT6(this.mgt6Id, mgt6Data).subscribe({
          next: (response) => {
            console.log('MGT6 updated successfully:', response);
            this.router.navigate(['/forms/mgt6']);
          },
          error: (error) => {
            console.error('Error updating mgt6:', error);
          }
        });
      } else {
        this.mgt6Service.createMGT6(mgt6Data).subscribe({
          next: (response) => {
            console.log('MGT6 created successfully:', response);
            this.router.navigate(['/forms/mgt6']);
          },
          error: (error) => {
            console.error('Error creating mgt6:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.mgt6Form.controls).forEach(key => {
      const control = this.mgt6Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}