import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DIR9Service } from './dir9.service';
import { DIR9 } from './dir9.model';

@Component({
  selector: 'app-dir9',
  templateUrl: './dir9.component.html',
  styleUrls: ['./dir9.component.scss']
})
export class DIR9Component implements OnInit {
  dir9Form!: FormGroup;
  isEditMode = false;
  dir9Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private dir9Service: DIR9Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.dir9Id = +params['id'];
        this.isEditMode = true;
        this.loadDIR9();
      }
    });
  }

  initializeForm(): void {
    this.dir9Form = this.fb.group({
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

  loadDIR9(): void {
    if (this.dir9Id) {
      this.dir9Service.getDIR9(this.dir9Id).subscribe({
        next: (dir9) => {
          this.dir9Form.patchValue(dir9);
        },
        error: (error) => {
          console.error('Error loading dir9:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.dir9Form.valid) {
      const dir9Data = this.dir9Form.value;
      
      if (this.isEditMode && this.dir9Id) {
        this.dir9Service.updateDIR9(this.dir9Id, dir9Data).subscribe({
          next: (response) => {
            console.log('DIR9 updated successfully:', response);
            this.router.navigate(['/forms/dir9']);
          },
          error: (error) => {
            console.error('Error updating dir9:', error);
          }
        });
      } else {
        this.dir9Service.createDIR9(dir9Data).subscribe({
          next: (response) => {
            console.log('DIR9 created successfully:', response);
            this.router.navigate(['/forms/dir9']);
          },
          error: (error) => {
            console.error('Error creating dir9:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.dir9Form.controls).forEach(key => {
      const control = this.dir9Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}