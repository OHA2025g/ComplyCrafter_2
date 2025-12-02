import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { INC22Service } from './inc22.service';
import { INC22 } from './inc22.model';

@Component({
  selector: 'app-inc22',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './inc22.component.html',
  styleUrls: ['./inc22.component.scss']
})
export class INC22Component implements OnInit {
  inc22Form!: FormGroup;
  isEditMode = false;
  inc22Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private inc22Service: INC22Service,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.inc22Id = +params['id'];
        this.isEditMode = true;
        this.loadINC22();
      }
    });
  }

  initializeForm(): void {
    this.inc22Form = this.fb.group({
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

  loadINC22(): void {
    if (this.inc22Id) {
      this.inc22Service.getINC22(this.inc22Id).subscribe({
        next: (inc22) => {
          this.inc22Form.patchValue(inc22);
        },
        error: (error) => {
          console.error('Error loading inc22:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.inc22Form.valid) {
      const inc22Data = this.inc22Form.value;
      
      if (this.isEditMode && this.inc22Id) {
        this.inc22Service.updateINC22(this.inc22Id, inc22Data).subscribe({
          next: (response) => {
            console.log('INC22 updated successfully:', response);
            this.router.navigate(['/forms/inc22']);
          },
          error: (error) => {
            console.error('Error updating inc22:', error);
          }
        });
      } else {
        this.inc22Service.createINC22(inc22Data).subscribe({
          next: (response) => {
            console.log('INC22 created successfully:', response);
            this.router.navigate(['/forms/inc22']);
          },
          error: (error) => {
            console.error('Error creating inc22:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.inc22Form.controls).forEach(key => {
      const control = this.inc22Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}