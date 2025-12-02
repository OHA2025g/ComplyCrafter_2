import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Form3Service } from './form3.service';
import { Form3 } from './form3.model';

@Component({
  selector: 'app-form3',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form3.component.html',
  styleUrls: ['./form3.component.scss']
})
export class Form3Component implements OnInit {
  form3Form!: FormGroup;
  isEditMode = false;
  form3Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private form3Service: Form3Service,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.form3Id = +params['id'];
        this.isEditMode = true;
        this.loadForm3();
      }
    });
  }

  initializeForm(): void {
    this.form3Form = this.fb.group({
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

  loadForm3(): void {
    if (this.form3Id) {
      this.form3Service.getForm3(this.form3Id).subscribe({
        next: (form3) => {
          this.form3Form.patchValue(form3);
        },
        error: (error) => {
          console.error('Error loading form3:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form3Form.valid) {
      const form3Data = this.form3Form.value;
      
      if (this.isEditMode && this.form3Id) {
        this.form3Service.updateForm3(this.form3Id, form3Data).subscribe({
          next: (response) => {
            console.log('Form3 updated successfully:', response);
            this.router.navigate(['/forms/form3']);
          },
          error: (error) => {
            console.error('Error updating form3:', error);
          }
        });
      } else {
        this.form3Service.createForm3(form3Data).subscribe({
          next: (response) => {
            console.log('Form3 created successfully:', response);
            this.router.navigate(['/forms/form3']);
          },
          error: (error) => {
            console.error('Error creating form3:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.form3Form.controls).forEach(key => {
      const control = this.form3Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}