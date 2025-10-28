import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { INC4Service } from './inc4.service';
import { INC4 } from './inc4.model';

@Component({
  selector: 'app-inc4',
  templateUrl: './inc4.component.html',
  styleUrls: ['./inc4.component.scss']
})
export class INC4Component implements OnInit {
  inc4Form!: FormGroup;
  isEditMode = false;
  inc4Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private inc4Service: INC4Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.inc4Id = +params['id'];
        this.isEditMode = true;
        this.loadINC4();
      }
    });
  }

  initializeForm(): void {
    this.inc4Form = this.fb.group({
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

  loadINC4(): void {
    if (this.inc4Id) {
      this.inc4Service.getINC4(this.inc4Id).subscribe({
        next: (inc4) => {
          this.inc4Form.patchValue(inc4);
        },
        error: (error) => {
          console.error('Error loading inc4:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.inc4Form.valid) {
      const inc4Data = this.inc4Form.value;
      
      if (this.isEditMode && this.inc4Id) {
        this.inc4Service.updateINC4(this.inc4Id, inc4Data).subscribe({
          next: (response) => {
            console.log('INC4 updated successfully:', response);
            this.router.navigate(['/forms/inc4']);
          },
          error: (error) => {
            console.error('Error updating inc4:', error);
          }
        });
      } else {
        this.inc4Service.createINC4(inc4Data).subscribe({
          next: (response) => {
            console.log('INC4 created successfully:', response);
            this.router.navigate(['/forms/inc4']);
          },
          error: (error) => {
            console.error('Error creating inc4:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.inc4Form.controls).forEach(key => {
      const control = this.inc4Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}