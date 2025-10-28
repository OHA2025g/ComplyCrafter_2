import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SH8Service } from './sh8.service';
import { SH8 } from './sh8.model';

@Component({
  selector: 'app-sh8',
  templateUrl: './sh8.component.html',
  styleUrls: ['./sh8.component.scss']
})
export class SH8Component implements OnInit {
  sh8Form!: FormGroup;
  isEditMode = false;
  sh8Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private sh8Service: SH8Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.sh8Id = +params['id'];
        this.isEditMode = true;
        this.loadSH8();
      }
    });
  }

  initializeForm(): void {
    this.sh8Form = this.fb.group({
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

  loadSH8(): void {
    if (this.sh8Id) {
      this.sh8Service.getSH8(this.sh8Id).subscribe({
        next: (sh8) => {
          this.sh8Form.patchValue(sh8);
        },
        error: (error) => {
          console.error('Error loading sh8:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.sh8Form.valid) {
      const sh8Data = this.sh8Form.value;
      
      if (this.isEditMode && this.sh8Id) {
        this.sh8Service.updateSH8(this.sh8Id, sh8Data).subscribe({
          next: (response) => {
            console.log('SH8 updated successfully:', response);
            this.router.navigate(['/forms/sh8']);
          },
          error: (error) => {
            console.error('Error updating sh8:', error);
          }
        });
      } else {
        this.sh8Service.createSH8(sh8Data).subscribe({
          next: (response) => {
            console.log('SH8 created successfully:', response);
            this.router.navigate(['/forms/sh8']);
          },
          error: (error) => {
            console.error('Error creating sh8:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.sh8Form.controls).forEach(key => {
      const control = this.sh8Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}