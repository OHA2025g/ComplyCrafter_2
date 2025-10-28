import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MGT8Service } from './mgt8.service';
import { MGT8 } from './mgt8.model';

@Component({
  selector: 'app-mgt8',
  templateUrl: './mgt8.component.html',
  styleUrls: ['./mgt8.component.scss']
})
export class MGT8Component implements OnInit {
  mgt8Form!: FormGroup;
  isEditMode = false;
  mgt8Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private mgt8Service: MGT8Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.mgt8Id = +params['id'];
        this.isEditMode = true;
        this.loadMGT8();
      }
    });
  }

  initializeForm(): void {
    this.mgt8Form = this.fb.group({
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

  loadMGT8(): void {
    if (this.mgt8Id) {
      this.mgt8Service.getMGT8(this.mgt8Id).subscribe({
        next: (mgt8) => {
          this.mgt8Form.patchValue(mgt8);
        },
        error: (error) => {
          console.error('Error loading mgt8:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.mgt8Form.valid) {
      const mgt8Data = this.mgt8Form.value;
      
      if (this.isEditMode && this.mgt8Id) {
        this.mgt8Service.updateMGT8(this.mgt8Id, mgt8Data).subscribe({
          next: (response) => {
            console.log('MGT8 updated successfully:', response);
            this.router.navigate(['/forms/mgt8']);
          },
          error: (error) => {
            console.error('Error updating mgt8:', error);
          }
        });
      } else {
        this.mgt8Service.createMGT8(mgt8Data).subscribe({
          next: (response) => {
            console.log('MGT8 created successfully:', response);
            this.router.navigate(['/forms/mgt8']);
          },
          error: (error) => {
            console.error('Error creating mgt8:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.mgt8Form.controls).forEach(key => {
      const control = this.mgt8Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}