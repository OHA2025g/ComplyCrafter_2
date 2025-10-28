import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CHG9Service } from './chg9.service';
import { CHG9 } from './chg9.model';

@Component({
  selector: 'app-chg9',
  templateUrl: './chg9.component.html',
  styleUrls: ['./chg9.component.scss']
})
export class CHG9Component implements OnInit {
  chg9Form!: FormGroup;
  isEditMode = false;
  chg9Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private chg9Service: CHG9Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.chg9Id = +params['id'];
        this.isEditMode = true;
        this.loadCHG9();
      }
    });
  }

  initializeForm(): void {
    this.chg9Form = this.fb.group({
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

  loadCHG9(): void {
    if (this.chg9Id) {
      this.chg9Service.getCHG9(this.chg9Id).subscribe({
        next: (chg9) => {
          this.chg9Form.patchValue(chg9);
        },
        error: (error) => {
          console.error('Error loading chg9:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.chg9Form.valid) {
      const chg9Data = this.chg9Form.value;
      
      if (this.isEditMode && this.chg9Id) {
        this.chg9Service.updateCHG9(this.chg9Id, chg9Data).subscribe({
          next: (response) => {
            console.log('CHG9 updated successfully:', response);
            this.router.navigate(['/forms/chg9']);
          },
          error: (error) => {
            console.error('Error updating chg9:', error);
          }
        });
      } else {
        this.chg9Service.createCHG9(chg9Data).subscribe({
          next: (response) => {
            console.log('CHG9 created successfully:', response);
            this.router.navigate(['/forms/chg9']);
          },
          error: (error) => {
            console.error('Error creating chg9:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.chg9Form.controls).forEach(key => {
      const control = this.chg9Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}