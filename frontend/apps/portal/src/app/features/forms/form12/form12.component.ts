import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Form12Service } from './form12.service';
import { Form12 } from './form12.model';

@Component({
  selector: 'app-form12',
  templateUrl: './form12.component.html',
  styleUrls: ['./form12.component.scss']
})
export class Form12Component implements OnInit {
  form12Form!: FormGroup;
  isEditMode = false;
  form12Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private form12Service: Form12Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.form12Id = +params['id'];
        this.isEditMode = true;
        this.loadForm12();
      }
    });
  }

  initializeForm(): void {
    this.form12Form = this.fb.group({
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

  loadForm12(): void {
    if (this.form12Id) {
      this.form12Service.getForm12(this.form12Id).subscribe({
        next: (form12) => {
          this.form12Form.patchValue(form12);
        },
        error: (error) => {
          console.error('Error loading form12:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form12Form.valid) {
      const form12Data = this.form12Form.value;
      
      if (this.isEditMode && this.form12Id) {
        this.form12Service.updateForm12(this.form12Id, form12Data).subscribe({
          next: (response) => {
            console.log('Form12 updated successfully:', response);
            this.router.navigate(['/forms/form12']);
          },
          error: (error) => {
            console.error('Error updating form12:', error);
          }
        });
      } else {
        this.form12Service.createForm12(form12Data).subscribe({
          next: (response) => {
            console.log('Form12 created successfully:', response);
            this.router.navigate(['/forms/form12']);
          },
          error: (error) => {
            console.error('Error creating form12:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.form12Form.controls).forEach(key => {
      const control = this.form12Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}