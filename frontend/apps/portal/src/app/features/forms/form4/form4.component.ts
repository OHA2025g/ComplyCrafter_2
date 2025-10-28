import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Form4Service } from './form4.service';
import { Form4 } from './form4.model';

@Component({
  selector: 'app-form4',
  templateUrl: './form4.component.html',
  styleUrls: ['./form4.component.scss']
})
export class Form4Component implements OnInit {
  form4Form!: FormGroup;
  isEditMode = false;
  form4Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private form4Service: Form4Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.form4Id = +params['id'];
        this.isEditMode = true;
        this.loadForm4();
      }
    });
  }

  initializeForm(): void {
    this.form4Form = this.fb.group({
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

  loadForm4(): void {
    if (this.form4Id) {
      this.form4Service.getForm4(this.form4Id).subscribe({
        next: (form4) => {
          this.form4Form.patchValue(form4);
        },
        error: (error) => {
          console.error('Error loading form4:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form4Form.valid) {
      const form4Data = this.form4Form.value;
      
      if (this.isEditMode && this.form4Id) {
        this.form4Service.updateForm4(this.form4Id, form4Data).subscribe({
          next: (response) => {
            console.log('Form4 updated successfully:', response);
            this.router.navigate(['/forms/form4']);
          },
          error: (error) => {
            console.error('Error updating form4:', error);
          }
        });
      } else {
        this.form4Service.createForm4(form4Data).subscribe({
          next: (response) => {
            console.log('Form4 created successfully:', response);
            this.router.navigate(['/forms/form4']);
          },
          error: (error) => {
            console.error('Error creating form4:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.form4Form.controls).forEach(key => {
      const control = this.form4Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}