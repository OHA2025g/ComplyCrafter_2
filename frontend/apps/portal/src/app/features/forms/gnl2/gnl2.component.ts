import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GNL2Service } from './gnl2.service';
import { GNL2 } from './gnl2.model';

@Component({
  selector: 'app-gnl2',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './gnl2.component.html',
  styleUrls: ['./gnl2.component.scss']
})
export class GNL2Component implements OnInit {
  gnl2Form!: FormGroup;
  isEditMode = false;
  gnl2Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private gnl2Service: GNL2Service,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.gnl2Id = +params['id'];
        this.isEditMode = true;
        this.loadGNL2();
      }
    });
  }

  initializeForm(): void {
    this.gnl2Form = this.fb.group({
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

  loadGNL2(): void {
    if (this.gnl2Id) {
      this.gnl2Service.getGNL2(this.gnl2Id).subscribe({
        next: (gnl2) => {
          this.gnl2Form.patchValue(gnl2);
        },
        error: (error) => {
          console.error('Error loading gnl2:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.gnl2Form.valid) {
      const gnl2Data = this.gnl2Form.value;
      
      if (this.isEditMode && this.gnl2Id) {
        this.gnl2Service.updateGNL2(this.gnl2Id, gnl2Data).subscribe({
          next: (response) => {
            console.log('GNL2 updated successfully:', response);
            this.router.navigate(['/forms/gnl2']);
          },
          error: (error) => {
            console.error('Error updating gnl2:', error);
          }
        });
      } else {
        this.gnl2Service.createGNL2(gnl2Data).subscribe({
          next: (response) => {
            console.log('GNL2 created successfully:', response);
            this.router.navigate(['/forms/gnl2']);
          },
          error: (error) => {
            console.error('Error creating gnl2:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.gnl2Form.controls).forEach(key => {
      const control = this.gnl2Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}