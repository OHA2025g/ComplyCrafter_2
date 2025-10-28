import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { INC24Service } from './inc24.service';
import { INC24 } from './inc24.model';

@Component({
  selector: 'app-inc24',
  templateUrl: './inc24.component.html',
  styleUrls: ['./inc24.component.scss']
})
export class INC24Component implements OnInit {
  inc24Form!: FormGroup;
  isEditMode = false;
  inc24Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private inc24Service: INC24Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.inc24Id = +params['id'];
        this.isEditMode = true;
        this.loadINC24();
      }
    });
  }

  initializeForm(): void {
    this.inc24Form = this.fb.group({
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

  loadINC24(): void {
    if (this.inc24Id) {
      this.inc24Service.getINC24(this.inc24Id).subscribe({
        next: (inc24) => {
          this.inc24Form.patchValue(inc24);
        },
        error: (error) => {
          console.error('Error loading inc24:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.inc24Form.valid) {
      const inc24Data = this.inc24Form.value;
      
      if (this.isEditMode && this.inc24Id) {
        this.inc24Service.updateINC24(this.inc24Id, inc24Data).subscribe({
          next: (response) => {
            console.log('INC24 updated successfully:', response);
            this.router.navigate(['/forms/inc24']);
          },
          error: (error) => {
            console.error('Error updating inc24:', error);
          }
        });
      } else {
        this.inc24Service.createINC24(inc24Data).subscribe({
          next: (response) => {
            console.log('INC24 created successfully:', response);
            this.router.navigate(['/forms/inc24']);
          },
          error: (error) => {
            console.error('Error creating inc24:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.inc24Form.controls).forEach(key => {
      const control = this.inc24Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}