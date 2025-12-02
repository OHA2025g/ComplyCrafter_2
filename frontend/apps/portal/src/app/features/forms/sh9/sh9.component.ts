import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SH9Service } from './sh9.service';
import { SH9 } from './sh9.model';

@Component({
  selector: 'app-sh9',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sh9.component.html',
  styleUrls: ['./sh9.component.scss']
})
export class SH9Component implements OnInit {
  sh9Form!: FormGroup;
  isEditMode = false;
  sh9Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private sh9Service: SH9Service,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.sh9Id = +params['id'];
        this.isEditMode = true;
        this.loadSH9();
      }
    });
  }

  initializeForm(): void {
    this.sh9Form = this.fb.group({
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

  loadSH9(): void {
    if (this.sh9Id) {
      this.sh9Service.getSH9(this.sh9Id).subscribe({
        next: (sh9) => {
          this.sh9Form.patchValue(sh9);
        },
        error: (error) => {
          console.error('Error loading sh9:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.sh9Form.valid) {
      const sh9Data = this.sh9Form.value;
      
      if (this.isEditMode && this.sh9Id) {
        this.sh9Service.updateSH9(this.sh9Id, sh9Data).subscribe({
          next: (response) => {
            console.log('SH9 updated successfully:', response);
            this.router.navigate(['/forms/sh9']);
          },
          error: (error) => {
            console.error('Error updating sh9:', error);
          }
        });
      } else {
        this.sh9Service.createSH9(sh9Data).subscribe({
          next: (response) => {
            console.log('SH9 created successfully:', response);
            this.router.navigate(['/forms/sh9']);
          },
          error: (error) => {
            console.error('Error creating sh9:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.sh9Form.controls).forEach(key => {
      const control = this.sh9Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}