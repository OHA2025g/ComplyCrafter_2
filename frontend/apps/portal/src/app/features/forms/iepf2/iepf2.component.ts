import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IEPF2Service } from './iepf2.service';
import { IEPF2 } from './iepf2.model';

@Component({
  selector: 'app-iepf2',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './iepf2.component.html',
  styleUrls: ['./iepf2.component.scss']
})
export class IEPF2Component implements OnInit {
  iepf2Form!: FormGroup;
  isEditMode = false;
  iepf2Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private iepf2Service: IEPF2Service,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.iepf2Id = +params['id'];
        this.isEditMode = true;
        this.loadIEPF2();
      }
    });
  }

  initializeForm(): void {
    this.iepf2Form = this.fb.group({
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

  loadIEPF2(): void {
    if (this.iepf2Id) {
      this.iepf2Service.getIEPF2(this.iepf2Id).subscribe({
        next: (iepf2) => {
          this.iepf2Form.patchValue(iepf2);
        },
        error: (error) => {
          console.error('Error loading iepf2:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.iepf2Form.valid) {
      const iepf2Data = this.iepf2Form.value;
      
      if (this.isEditMode && this.iepf2Id) {
        this.iepf2Service.updateIEPF2(this.iepf2Id, iepf2Data).subscribe({
          next: (response) => {
            console.log('IEPF2 updated successfully:', response);
            this.router.navigate(['/forms/iepf2']);
          },
          error: (error) => {
            console.error('Error updating iepf2:', error);
          }
        });
      } else {
        this.iepf2Service.createIEPF2(iepf2Data).subscribe({
          next: (response) => {
            console.log('IEPF2 created successfully:', response);
            this.router.navigate(['/forms/iepf2']);
          },
          error: (error) => {
            console.error('Error creating iepf2:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.iepf2Form.controls).forEach(key => {
      const control = this.iepf2Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}