import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CHG6Service } from './chg6.service';
import { CHG6 } from './chg6.model';

@Component({
  selector: 'app-chg6',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './chg6.component.html',
  styleUrls: ['./chg6.component.scss']
})
export class CHG6Component implements OnInit {
  chg6Form!: FormGroup;
  isEditMode = false;
  chg6Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private chg6Service: CHG6Service,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.chg6Id = +params['id'];
        this.isEditMode = true;
        this.loadCHG6();
      }
    });
  }

  initializeForm(): void {
    this.chg6Form = this.fb.group({
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

  loadCHG6(): void {
    if (this.chg6Id) {
      this.chg6Service.getCHG6(this.chg6Id).subscribe({
        next: (chg6) => {
          this.chg6Form.patchValue(chg6);
        },
        error: (error) => {
          console.error('Error loading chg6:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.chg6Form.valid) {
      const chg6Data = this.chg6Form.value;
      
      if (this.isEditMode && this.chg6Id) {
        this.chg6Service.updateCHG6(this.chg6Id, chg6Data).subscribe({
          next: (response) => {
            console.log('CHG6 updated successfully:', response);
            this.router.navigate(['/forms/chg6']);
          },
          error: (error) => {
            console.error('Error updating chg6:', error);
          }
        });
      } else {
        this.chg6Service.createCHG6(chg6Data).subscribe({
          next: (response) => {
            console.log('CHG6 created successfully:', response);
            this.router.navigate(['/forms/chg6']);
          },
          error: (error) => {
            console.error('Error creating chg6:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.chg6Form.controls).forEach(key => {
      const control = this.chg6Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}