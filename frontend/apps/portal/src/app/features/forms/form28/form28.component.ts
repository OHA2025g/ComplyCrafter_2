import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Form28Service } from './form28.service';
import { Form28 } from './form28.model';

@Component({
  selector: 'app-form28',
  templateUrl: './form28.component.html',
  styleUrls: ['./form28.component.scss']
})
export class Form28Component implements OnInit {
  form28Form!: FormGroup;
  isEditMode = false;
  form28Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private form28Service: Form28Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.form28Id = +params['id'];
        this.isEditMode = true;
        this.loadForm28();
      }
    });
  }

  initializeForm(): void {
    this.form28Form = this.fb.group({
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

  loadForm28(): void {
    if (this.form28Id) {
      this.form28Service.getForm28(this.form28Id).subscribe({
        next: (form28) => {
          this.form28Form.patchValue(form28);
        },
        error: (error) => {
          console.error('Error loading form28:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form28Form.valid) {
      const form28Data = this.form28Form.value;
      
      if (this.isEditMode && this.form28Id) {
        this.form28Service.updateForm28(this.form28Id, form28Data).subscribe({
          next: (response) => {
            console.log('Form28 updated successfully:', response);
            this.router.navigate(['/forms/form28']);
          },
          error: (error) => {
            console.error('Error updating form28:', error);
          }
        });
      } else {
        this.form28Service.createForm28(form28Data).subscribe({
          next: (response) => {
            console.log('Form28 created successfully:', response);
            this.router.navigate(['/forms/form28']);
          },
          error: (error) => {
            console.error('Error creating form28:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.form28Form.controls).forEach(key => {
      const control = this.form28Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}