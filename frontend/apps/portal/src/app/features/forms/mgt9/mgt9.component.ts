import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MGT9Service } from './mgt9.service';
import { MGT9 } from './mgt9.model';

@Component({
  selector: 'app-mgt9',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './mgt9.component.html',
  styleUrls: ['./mgt9.component.scss']
})
export class MGT9Component implements OnInit {
  mgt9Form!: FormGroup;
  isEditMode = false;
  mgt9Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private mgt9Service: MGT9Service,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.mgt9Id = +params['id'];
        this.isEditMode = true;
        this.loadMGT9();
      }
    });
  }

  initializeForm(): void {
    this.mgt9Form = this.fb.group({
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

  loadMGT9(): void {
    if (this.mgt9Id) {
      this.mgt9Service.getMGT9(this.mgt9Id).subscribe({
        next: (mgt9) => {
          this.mgt9Form.patchValue(mgt9);
        },
        error: (error) => {
          console.error('Error loading mgt9:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.mgt9Form.valid) {
      const mgt9Data = this.mgt9Form.value;
      
      if (this.isEditMode && this.mgt9Id) {
        this.mgt9Service.updateMGT9(this.mgt9Id, mgt9Data).subscribe({
          next: (response) => {
            console.log('MGT9 updated successfully:', response);
            this.router.navigate(['/forms/mgt9']);
          },
          error: (error) => {
            console.error('Error updating mgt9:', error);
          }
        });
      } else {
        this.mgt9Service.createMGT9(mgt9Data).subscribe({
          next: (response) => {
            console.log('MGT9 created successfully:', response);
            this.router.navigate(['/forms/mgt9']);
          },
          error: (error) => {
            console.error('Error creating mgt9:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.mgt9Form.controls).forEach(key => {
      const control = this.mgt9Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}