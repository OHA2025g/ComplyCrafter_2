import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SH11Service } from './sh11.service';
import { SH11 } from './sh11.model';

@Component({
  selector: 'app-sh11',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sh11.component.html',
  styleUrls: ['./sh11.component.scss']
})
export class SH11Component implements OnInit {
  sh11Form!: FormGroup;
  isEditMode = false;
  sh11Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private sh11Service: SH11Service,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.sh11Id = +params['id'];
        this.isEditMode = true;
        this.loadSH11();
      }
    });
  }

  initializeForm(): void {
    this.sh11Form = this.fb.group({
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

  loadSH11(): void {
    if (this.sh11Id) {
      this.sh11Service.getSH11(this.sh11Id).subscribe({
        next: (sh11) => {
          this.sh11Form.patchValue(sh11);
        },
        error: (error) => {
          console.error('Error loading sh11:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.sh11Form.valid) {
      const sh11Data = this.sh11Form.value;
      
      if (this.isEditMode && this.sh11Id) {
        this.sh11Service.updateSH11(this.sh11Id, sh11Data).subscribe({
          next: (response) => {
            console.log('SH11 updated successfully:', response);
            this.router.navigate(['/forms/sh11']);
          },
          error: (error) => {
            console.error('Error updating sh11:', error);
          }
        });
      } else {
        this.sh11Service.createSH11(sh11Data).subscribe({
          next: (response) => {
            console.log('SH11 created successfully:', response);
            this.router.navigate(['/forms/sh11']);
          },
          error: (error) => {
            console.error('Error creating sh11:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.sh11Form.controls).forEach(key => {
      const control = this.sh11Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}