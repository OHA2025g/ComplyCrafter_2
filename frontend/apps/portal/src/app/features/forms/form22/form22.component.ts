import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Form22Service } from './form22.service';
import { Form22 } from './form22.model';

@Component({
  selector: 'app-form22',
  templateUrl: './form22.component.html',
  styleUrls: ['./form22.component.scss']
})
export class Form22Component implements OnInit {
  form22Form!: FormGroup;
  isEditMode = false;
  form22Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private form22Service: Form22Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.form22Id = +params['id'];
        this.isEditMode = true;
        this.loadForm22();
      }
    });
  }

  initializeForm(): void {
    this.form22Form = this.fb.group({
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

  loadForm22(): void {
    if (this.form22Id) {
      this.form22Service.getForm22(this.form22Id).subscribe({
        next: (form22) => {
          this.form22Form.patchValue(form22);
        },
        error: (error) => {
          console.error('Error loading form22:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form22Form.valid) {
      const form22Data = this.form22Form.value;
      
      if (this.isEditMode && this.form22Id) {
        this.form22Service.updateForm22(this.form22Id, form22Data).subscribe({
          next: (response) => {
            console.log('Form22 updated successfully:', response);
            this.router.navigate(['/forms/form22']);
          },
          error: (error) => {
            console.error('Error updating form22:', error);
          }
        });
      } else {
        this.form22Service.createForm22(form22Data).subscribe({
          next: (response) => {
            console.log('Form22 created successfully:', response);
            this.router.navigate(['/forms/form22']);
          },
          error: (error) => {
            console.error('Error creating form22:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.form22Form.controls).forEach(key => {
      const control = this.form22Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}