import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { INC28Service } from './inc28.service';
import { INC28 } from './inc28.model';

@Component({
  selector: 'app-inc28',
  templateUrl: './inc28.component.html',
  styleUrls: ['./inc28.component.scss']
})
export class INC28Component implements OnInit {
  inc28Form!: FormGroup;
  isEditMode = false;
  inc28Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private inc28Service: INC28Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.inc28Id = +params['id'];
        this.isEditMode = true;
        this.loadINC28();
      }
    });
  }

  initializeForm(): void {
    this.inc28Form = this.fb.group({
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

  loadINC28(): void {
    if (this.inc28Id) {
      this.inc28Service.getINC28(this.inc28Id).subscribe({
        next: (inc28) => {
          this.inc28Form.patchValue(inc28);
        },
        error: (error) => {
          console.error('Error loading inc28:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.inc28Form.valid) {
      const inc28Data = this.inc28Form.value;
      
      if (this.isEditMode && this.inc28Id) {
        this.inc28Service.updateINC28(this.inc28Id, inc28Data).subscribe({
          next: (response) => {
            console.log('INC28 updated successfully:', response);
            this.router.navigate(['/forms/inc28']);
          },
          error: (error) => {
            console.error('Error updating inc28:', error);
          }
        });
      } else {
        this.inc28Service.createINC28(inc28Data).subscribe({
          next: (response) => {
            console.log('INC28 created successfully:', response);
            this.router.navigate(['/forms/inc28']);
          },
          error: (error) => {
            console.error('Error creating inc28:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.inc28Form.controls).forEach(key => {
      const control = this.inc28Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}