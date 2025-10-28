import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Form23Service } from './form23.service';
import { Form23 } from './form23.model';

@Component({
  selector: 'app-form23',
  templateUrl: './form23.component.html',
  styleUrls: ['./form23.component.scss']
})
export class Form23Component implements OnInit {
  form23Form!: FormGroup;
  isEditMode = false;
  form23Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private form23Service: Form23Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.form23Id = +params['id'];
        this.isEditMode = true;
        this.loadForm23();
      }
    });
  }

  initializeForm(): void {
    this.form23Form = this.fb.group({
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

  loadForm23(): void {
    if (this.form23Id) {
      this.form23Service.getForm23(this.form23Id).subscribe({
        next: (form23) => {
          this.form23Form.patchValue(form23);
        },
        error: (error) => {
          console.error('Error loading form23:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form23Form.valid) {
      const form23Data = this.form23Form.value;
      
      if (this.isEditMode && this.form23Id) {
        this.form23Service.updateForm23(this.form23Id, form23Data).subscribe({
          next: (response) => {
            console.log('Form23 updated successfully:', response);
            this.router.navigate(['/forms/form23']);
          },
          error: (error) => {
            console.error('Error updating form23:', error);
          }
        });
      } else {
        this.form23Service.createForm23(form23Data).subscribe({
          next: (response) => {
            console.log('Form23 created successfully:', response);
            this.router.navigate(['/forms/form23']);
          },
          error: (error) => {
            console.error('Error creating form23:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.form23Form.controls).forEach(key => {
      const control = this.form23Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}