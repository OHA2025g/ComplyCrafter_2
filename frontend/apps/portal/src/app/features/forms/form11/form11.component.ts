import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Form11Service } from './form11.service';
import { Form11 } from './form11.model';

@Component({
  selector: 'app-form11',
  templateUrl: './form11.component.html',
  styleUrls: ['./form11.component.scss']
})
export class Form11Component implements OnInit {
  form11Form!: FormGroup;
  isEditMode = false;
  form11Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private form11Service: Form11Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.form11Id = +params['id'];
        this.isEditMode = true;
        this.loadForm11();
      }
    });
  }

  initializeForm(): void {
    this.form11Form = this.fb.group({
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

  loadForm11(): void {
    if (this.form11Id) {
      this.form11Service.getForm11(this.form11Id).subscribe({
        next: (form11) => {
          this.form11Form.patchValue(form11);
        },
        error: (error) => {
          console.error('Error loading form11:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form11Form.valid) {
      const form11Data = this.form11Form.value;
      
      if (this.isEditMode && this.form11Id) {
        this.form11Service.updateForm11(this.form11Id, form11Data).subscribe({
          next: (response) => {
            console.log('Form11 updated successfully:', response);
            this.router.navigate(['/forms/form11']);
          },
          error: (error) => {
            console.error('Error updating form11:', error);
          }
        });
      } else {
        this.form11Service.createForm11(form11Data).subscribe({
          next: (response) => {
            console.log('Form11 created successfully:', response);
            this.router.navigate(['/forms/form11']);
          },
          error: (error) => {
            console.error('Error creating form11:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.form11Form.controls).forEach(key => {
      const control = this.form11Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}