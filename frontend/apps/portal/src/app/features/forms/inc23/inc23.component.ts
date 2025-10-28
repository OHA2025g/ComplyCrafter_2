import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { INC23Service } from './inc23.service';
import { INC23 } from './inc23.model';

@Component({
  selector: 'app-inc23',
  templateUrl: './inc23.component.html',
  styleUrls: ['./inc23.component.scss']
})
export class INC23Component implements OnInit {
  inc23Form!: FormGroup;
  isEditMode = false;
  inc23Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private inc23Service: INC23Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.inc23Id = +params['id'];
        this.isEditMode = true;
        this.loadINC23();
      }
    });
  }

  initializeForm(): void {
    this.inc23Form = this.fb.group({
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

  loadINC23(): void {
    if (this.inc23Id) {
      this.inc23Service.getINC23(this.inc23Id).subscribe({
        next: (inc23) => {
          this.inc23Form.patchValue(inc23);
        },
        error: (error) => {
          console.error('Error loading inc23:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.inc23Form.valid) {
      const inc23Data = this.inc23Form.value;
      
      if (this.isEditMode && this.inc23Id) {
        this.inc23Service.updateINC23(this.inc23Id, inc23Data).subscribe({
          next: (response) => {
            console.log('INC23 updated successfully:', response);
            this.router.navigate(['/forms/inc23']);
          },
          error: (error) => {
            console.error('Error updating inc23:', error);
          }
        });
      } else {
        this.inc23Service.createINC23(inc23Data).subscribe({
          next: (response) => {
            console.log('INC23 created successfully:', response);
            this.router.navigate(['/forms/inc23']);
          },
          error: (error) => {
            console.error('Error creating inc23:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.inc23Form.controls).forEach(key => {
      const control = this.inc23Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}