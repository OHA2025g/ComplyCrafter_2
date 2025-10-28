import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { STK2Service } from './stk2.service';
import { STK2 } from './stk2.model';

@Component({
  selector: 'app-stk2',
  templateUrl: './stk2.component.html',
  styleUrls: ['./stk2.component.scss']
})
export class STK2Component implements OnInit {
  stk2Form!: FormGroup;
  isEditMode = false;
  stk2Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private stk2Service: STK2Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.stk2Id = +params['id'];
        this.isEditMode = true;
        this.loadSTK2();
      }
    });
  }

  initializeForm(): void {
    this.stk2Form = this.fb.group({
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

  loadSTK2(): void {
    if (this.stk2Id) {
      this.stk2Service.getSTK2(this.stk2Id).subscribe({
        next: (stk2) => {
          this.stk2Form.patchValue(stk2);
        },
        error: (error) => {
          console.error('Error loading stk2:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.stk2Form.valid) {
      const stk2Data = this.stk2Form.value;
      
      if (this.isEditMode && this.stk2Id) {
        this.stk2Service.updateSTK2(this.stk2Id, stk2Data).subscribe({
          next: (response) => {
            console.log('STK2 updated successfully:', response);
            this.router.navigate(['/forms/stk2']);
          },
          error: (error) => {
            console.error('Error updating stk2:', error);
          }
        });
      } else {
        this.stk2Service.createSTK2(stk2Data).subscribe({
          next: (response) => {
            console.log('STK2 created successfully:', response);
            this.router.navigate(['/forms/stk2']);
          },
          error: (error) => {
            console.error('Error creating stk2:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.stk2Form.controls).forEach(key => {
      const control = this.stk2Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}