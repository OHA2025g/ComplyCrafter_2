import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MR1Service } from './mr1.service';
import { MR1 } from './mr1.model';

@Component({
  selector: 'app-mr1',
  templateUrl: './mr1.component.html',
  styleUrls: ['./mr1.component.scss']
})
export class MR1Component implements OnInit {
  mr1Form!: FormGroup;
  isEditMode = false;
  mr1Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private mr1Service: MR1Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.mr1Id = +params['id'];
        this.isEditMode = true;
        this.loadMR1();
      }
    });
  }

  initializeForm(): void {
    this.mr1Form = this.fb.group({
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

  loadMR1(): void {
    if (this.mr1Id) {
      this.mr1Service.getMR1(this.mr1Id).subscribe({
        next: (mr1) => {
          this.mr1Form.patchValue(mr1);
        },
        error: (error) => {
          console.error('Error loading mr1:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.mr1Form.valid) {
      const mr1Data = this.mr1Form.value;
      
      if (this.isEditMode && this.mr1Id) {
        this.mr1Service.updateMR1(this.mr1Id, mr1Data).subscribe({
          next: (response) => {
            console.log('MR1 updated successfully:', response);
            this.router.navigate(['/forms/mr1']);
          },
          error: (error) => {
            console.error('Error updating mr1:', error);
          }
        });
      } else {
        this.mr1Service.createMR1(mr1Data).subscribe({
          next: (response) => {
            console.log('MR1 created successfully:', response);
            this.router.navigate(['/forms/mr1']);
          },
          error: (error) => {
            console.error('Error creating mr1:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.mr1Form.controls).forEach(key => {
      const control = this.mr1Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}