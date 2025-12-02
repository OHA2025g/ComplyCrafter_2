import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SH7Service } from './sh7.service';
import { SH7 } from './sh7.model';

@Component({
  selector: 'app-sh7',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sh7.component.html',
  styleUrls: ['./sh7.component.scss']
})
export class SH7Component implements OnInit {
  sh7Form!: FormGroup;
  isEditMode = false;
  sh7Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private sh7Service: SH7Service,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.sh7Id = +params['id'];
        this.isEditMode = true;
        this.loadSH7();
      }
    });
  }

  initializeForm(): void {
    this.sh7Form = this.fb.group({
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

  loadSH7(): void {
    if (this.sh7Id) {
      this.sh7Service.getSH7(this.sh7Id).subscribe({
        next: (sh7) => {
          this.sh7Form.patchValue(sh7);
        },
        error: (error) => {
          console.error('Error loading sh7:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.sh7Form.valid) {
      const sh7Data = this.sh7Form.value;
      
      if (this.isEditMode && this.sh7Id) {
        this.sh7Service.updateSH7(this.sh7Id, sh7Data).subscribe({
          next: (response) => {
            console.log('SH7 updated successfully:', response);
            this.router.navigate(['/forms/sh7']);
          },
          error: (error) => {
            console.error('Error updating sh7:', error);
          }
        });
      } else {
        this.sh7Service.createSH7(sh7Data).subscribe({
          next: (response) => {
            console.log('SH7 created successfully:', response);
            this.router.navigate(['/forms/sh7']);
          },
          error: (error) => {
            console.error('Error creating sh7:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.sh7Form.controls).forEach(key => {
      const control = this.sh7Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}