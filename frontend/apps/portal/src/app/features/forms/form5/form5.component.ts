import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Form5Service } from './form5.service';
import { Form5 } from './form5.model';

@Component({
  selector: 'app-form5',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form5.component.html',
  styleUrls: ['./form5.component.scss']
})
export class Form5Component implements OnInit {
  form5Form!: FormGroup;
  isEditMode = false;
  form5Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private form5Service: Form5Service,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.form5Id = +params['id'];
        this.isEditMode = true;
        this.loadForm5();
      }
    });
  }

  initializeForm(): void {
    this.form5Form = this.fb.group({
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

  loadForm5(): void {
    if (this.form5Id) {
      this.form5Service.getForm5(this.form5Id).subscribe({
        next: (form5) => {
          this.form5Form.patchValue(form5);
        },
        error: (error) => {
          console.error('Error loading form5:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form5Form.valid) {
      const form5Data = this.form5Form.value;
      
      if (this.isEditMode && this.form5Id) {
        this.form5Service.updateForm5(this.form5Id, form5Data).subscribe({
          next: (response) => {
            console.log('Form5 updated successfully:', response);
            this.router.navigate(['/forms/form5']);
          },
          error: (error) => {
            console.error('Error updating form5:', error);
          }
        });
      } else {
        this.form5Service.createForm5(form5Data).subscribe({
          next: (response) => {
            console.log('Form5 created successfully:', response);
            this.router.navigate(['/forms/form5']);
          },
          error: (error) => {
            console.error('Error creating form5:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.form5Form.controls).forEach(key => {
      const control = this.form5Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}