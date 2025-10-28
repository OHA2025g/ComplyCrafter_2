import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DIR6Service } from './dir6.service';
import { DIR6 } from './dir6.model';

@Component({
  selector: 'app-dir6',
  templateUrl: './dir6.component.html',
  styleUrls: ['./dir6.component.scss']
})
export class DIR6Component implements OnInit {
  dir6Form!: FormGroup;
  isEditMode = false;
  dir6Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private dir6Service: DIR6Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.dir6Id = +params['id'];
        this.isEditMode = true;
        this.loadDIR6();
      }
    });
  }

  initializeForm(): void {
    this.dir6Form = this.fb.group({
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

  loadDIR6(): void {
    if (this.dir6Id) {
      this.dir6Service.getDIR6(this.dir6Id).subscribe({
        next: (dir6) => {
          this.dir6Form.patchValue(dir6);
        },
        error: (error) => {
          console.error('Error loading dir6:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.dir6Form.valid) {
      const dir6Data = this.dir6Form.value;
      
      if (this.isEditMode && this.dir6Id) {
        this.dir6Service.updateDIR6(this.dir6Id, dir6Data).subscribe({
          next: (response) => {
            console.log('DIR6 updated successfully:', response);
            this.router.navigate(['/forms/dir6']);
          },
          error: (error) => {
            console.error('Error updating dir6:', error);
          }
        });
      } else {
        this.dir6Service.createDIR6(dir6Data).subscribe({
          next: (response) => {
            console.log('DIR6 created successfully:', response);
            this.router.navigate(['/forms/dir6']);
          },
          error: (error) => {
            console.error('Error creating dir6:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.dir6Form.controls).forEach(key => {
      const control = this.dir6Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}