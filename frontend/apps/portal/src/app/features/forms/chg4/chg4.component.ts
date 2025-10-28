import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CHG4Service } from './chg4.service';
import { CHG4 } from './chg4.model';

@Component({
  selector: 'app-chg4',
  templateUrl: './chg4.component.html',
  styleUrls: ['./chg4.component.scss']
})
export class CHG4Component implements OnInit {
  chg4Form!: FormGroup;
  isEditMode = false;
  chg4Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private chg4Service: CHG4Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.chg4Id = +params['id'];
        this.isEditMode = true;
        this.loadCHG4();
      }
    });
  }

  initializeForm(): void {
    this.chg4Form = this.fb.group({
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

  loadCHG4(): void {
    if (this.chg4Id) {
      this.chg4Service.getCHG4(this.chg4Id).subscribe({
        next: (chg4) => {
          this.chg4Form.patchValue(chg4);
        },
        error: (error) => {
          console.error('Error loading chg4:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.chg4Form.valid) {
      const chg4Data = this.chg4Form.value;
      
      if (this.isEditMode && this.chg4Id) {
        this.chg4Service.updateCHG4(this.chg4Id, chg4Data).subscribe({
          next: (response) => {
            console.log('CHG4 updated successfully:', response);
            this.router.navigate(['/forms/chg4']);
          },
          error: (error) => {
            console.error('Error updating chg4:', error);
          }
        });
      } else {
        this.chg4Service.createCHG4(chg4Data).subscribe({
          next: (response) => {
            console.log('CHG4 created successfully:', response);
            this.router.navigate(['/forms/chg4']);
          },
          error: (error) => {
            console.error('Error creating chg4:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.chg4Form.controls).forEach(key => {
      const control = this.chg4Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}