import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Form15Service } from './form15.service';
import { Form15 } from './form15.model';

@Component({
  selector: 'app-form15',
  templateUrl: './form15.component.html',
  styleUrls: ['./form15.component.scss']
})
export class Form15Component implements OnInit {
  form15Form!: FormGroup;
  isEditMode = false;
  form15Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private form15Service: Form15Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.form15Id = +params['id'];
        this.isEditMode = true;
        this.loadForm15();
      }
    });
  }

  initializeForm(): void {
    this.form15Form = this.fb.group({
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

  loadForm15(): void {
    if (this.form15Id) {
      this.form15Service.getForm15(this.form15Id).subscribe({
        next: (form15) => {
          this.form15Form.patchValue(form15);
        },
        error: (error) => {
          console.error('Error loading form15:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form15Form.valid) {
      const form15Data = this.form15Form.value;
      
      if (this.isEditMode && this.form15Id) {
        this.form15Service.updateForm15(this.form15Id, form15Data).subscribe({
          next: (response) => {
            console.log('Form15 updated successfully:', response);
            this.router.navigate(['/forms/form15']);
          },
          error: (error) => {
            console.error('Error updating form15:', error);
          }
        });
      } else {
        this.form15Service.createForm15(form15Data).subscribe({
          next: (response) => {
            console.log('Form15 created successfully:', response);
            this.router.navigate(['/forms/form15']);
          },
          error: (error) => {
            console.error('Error creating form15:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.form15Form.controls).forEach(key => {
      const control = this.form15Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}