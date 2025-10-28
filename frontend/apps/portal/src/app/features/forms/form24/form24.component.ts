import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Form24Service } from './form24.service';
import { Form24 } from './form24.model';

@Component({
  selector: 'app-form24',
  templateUrl: './form24.component.html',
  styleUrls: ['./form24.component.scss']
})
export class Form24Component implements OnInit {
  form24Form!: FormGroup;
  isEditMode = false;
  form24Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private form24Service: Form24Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.form24Id = +params['id'];
        this.isEditMode = true;
        this.loadForm24();
      }
    });
  }

  initializeForm(): void {
    this.form24Form = this.fb.group({
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

  loadForm24(): void {
    if (this.form24Id) {
      this.form24Service.getForm24(this.form24Id).subscribe({
        next: (form24) => {
          this.form24Form.patchValue(form24);
        },
        error: (error) => {
          console.error('Error loading form24:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form24Form.valid) {
      const form24Data = this.form24Form.value;
      
      if (this.isEditMode && this.form24Id) {
        this.form24Service.updateForm24(this.form24Id, form24Data).subscribe({
          next: (response) => {
            console.log('Form24 updated successfully:', response);
            this.router.navigate(['/forms/form24']);
          },
          error: (error) => {
            console.error('Error updating form24:', error);
          }
        });
      } else {
        this.form24Service.createForm24(form24Data).subscribe({
          next: (response) => {
            console.log('Form24 created successfully:', response);
            this.router.navigate(['/forms/form24']);
          },
          error: (error) => {
            console.error('Error creating form24:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.form24Form.controls).forEach(key => {
      const control = this.form24Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}