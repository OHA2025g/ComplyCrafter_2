import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DIR12Service } from './dir12.service';
import { DIR12 } from './dir12.model';

@Component({
  selector: 'app-dir12',
  templateUrl: './dir12.component.html',
  styleUrls: ['./dir12.component.scss']
})
export class DIR12Component implements OnInit {
  dir12Form!: FormGroup;
  isEditMode = false;
  dir12Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private dir12Service: DIR12Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.dir12Id = +params['id'];
        this.isEditMode = true;
        this.loadDIR12();
      }
    });
  }

  initializeForm(): void {
    this.dir12Form = this.fb.group({
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

  loadDIR12(): void {
    if (this.dir12Id) {
      this.dir12Service.getDIR12(this.dir12Id).subscribe({
        next: (dir12) => {
          this.dir12Form.patchValue(dir12);
        },
        error: (error) => {
          console.error('Error loading dir12:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.dir12Form.valid) {
      const dir12Data = this.dir12Form.value;
      
      if (this.isEditMode && this.dir12Id) {
        this.dir12Service.updateDIR12(this.dir12Id, dir12Data).subscribe({
          next: (response) => {
            console.log('DIR12 updated successfully:', response);
            this.router.navigate(['/forms/dir12']);
          },
          error: (error) => {
            console.error('Error updating dir12:', error);
          }
        });
      } else {
        this.dir12Service.createDIR12(dir12Data).subscribe({
          next: (response) => {
            console.log('DIR12 created successfully:', response);
            this.router.navigate(['/forms/dir12']);
          },
          error: (error) => {
            console.error('Error creating dir12:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.dir12Form.controls).forEach(key => {
      const control = this.dir12Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}