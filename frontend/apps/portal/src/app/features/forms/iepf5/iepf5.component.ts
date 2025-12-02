import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IEPF5Service } from './iepf5.service';
import { IEPF5 } from './iepf5.model';

@Component({
  selector: 'app-iepf5',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './iepf5.component.html',
  styleUrls: ['./iepf5.component.scss']
})
export class IEPF5Component implements OnInit {
  iepf5Form!: FormGroup;
  isEditMode = false;
  iepf5Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private iepf5Service: IEPF5Service,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.iepf5Id = +params['id'];
        this.isEditMode = true;
        this.loadIEPF5();
      }
    });
  }

  initializeForm(): void {
    this.iepf5Form = this.fb.group({
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

  loadIEPF5(): void {
    if (this.iepf5Id) {
      this.iepf5Service.getIEPF5(this.iepf5Id).subscribe({
        next: (iepf5) => {
          this.iepf5Form.patchValue(iepf5);
        },
        error: (error) => {
          console.error('Error loading iepf5:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.iepf5Form.valid) {
      const iepf5Data = this.iepf5Form.value;
      
      if (this.isEditMode && this.iepf5Id) {
        this.iepf5Service.updateIEPF5(this.iepf5Id, iepf5Data).subscribe({
          next: (response) => {
            console.log('IEPF5 updated successfully:', response);
            this.router.navigate(['/forms/iepf5']);
          },
          error: (error) => {
            console.error('Error updating iepf5:', error);
          }
        });
      } else {
        this.iepf5Service.createIEPF5(iepf5Data).subscribe({
          next: (response) => {
            console.log('IEPF5 created successfully:', response);
            this.router.navigate(['/forms/iepf5']);
          },
          error: (error) => {
            console.error('Error creating iepf5:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.iepf5Form.controls).forEach(key => {
      const control = this.iepf5Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}