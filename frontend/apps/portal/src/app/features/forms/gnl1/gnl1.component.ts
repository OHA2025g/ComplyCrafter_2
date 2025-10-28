import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GNL1Service } from './gnl1.service';
import { GNL1 } from './gnl1.model';

@Component({
  selector: 'app-gnl1',
  templateUrl: './gnl1.component.html',
  styleUrls: ['./gnl1.component.scss']
})
export class GNL1Component implements OnInit {
  gnl1Form!: FormGroup;
  isEditMode = false;
  gnl1Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private gnl1Service: GNL1Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.gnl1Id = +params['id'];
        this.isEditMode = true;
        this.loadGNL1();
      }
    });
  }

  initializeForm(): void {
    this.gnl1Form = this.fb.group({
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

  loadGNL1(): void {
    if (this.gnl1Id) {
      this.gnl1Service.getGNL1(this.gnl1Id).subscribe({
        next: (gnl1) => {
          this.gnl1Form.patchValue(gnl1);
        },
        error: (error) => {
          console.error('Error loading gnl1:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.gnl1Form.valid) {
      const gnl1Data = this.gnl1Form.value;
      
      if (this.isEditMode && this.gnl1Id) {
        this.gnl1Service.updateGNL1(this.gnl1Id, gnl1Data).subscribe({
          next: (response) => {
            console.log('GNL1 updated successfully:', response);
            this.router.navigate(['/forms/gnl1']);
          },
          error: (error) => {
            console.error('Error updating gnl1:', error);
          }
        });
      } else {
        this.gnl1Service.createGNL1(gnl1Data).subscribe({
          next: (response) => {
            console.log('GNL1 created successfully:', response);
            this.router.navigate(['/forms/gnl1']);
          },
          error: (error) => {
            console.error('Error creating gnl1:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.gnl1Form.controls).forEach(key => {
      const control = this.gnl1Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}