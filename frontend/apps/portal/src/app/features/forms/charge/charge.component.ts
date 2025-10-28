import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CHARGEService } from './charge.service';
import { CHARGE } from './charge.model';

@Component({
  selector: 'app-charge',
  templateUrl: './charge.component.html',
  styleUrls: ['./charge.component.scss']
})
export class CHARGEComponent implements OnInit {
  chargeForm!: FormGroup;
  isEditMode = false;
  chargeId: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private chargeService: CHARGEService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.chargeId = +params['id'];
        this.isEditMode = true;
        this.loadCHARGE();
      }
    });
  }

  initializeForm(): void {
    this.chargeForm = this.fb.group({
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

  loadCHARGE(): void {
    if (this.chargeId) {
      this.chargeService.getCHARGE(this.chargeId).subscribe({
        next: (charge) => {
          this.chargeForm.patchValue(charge);
        },
        error: (error) => {
          console.error('Error loading charge:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.chargeForm.valid) {
      const chargeData = this.chargeForm.value;
      
      if (this.isEditMode && this.chargeId) {
        this.chargeService.updateCHARGE(this.chargeId, chargeData).subscribe({
          next: (response) => {
            console.log('CHARGE updated successfully:', response);
            this.router.navigate(['/forms/charge']);
          },
          error: (error) => {
            console.error('Error updating charge:', error);
          }
        });
      } else {
        this.chargeService.createCHARGE(chargeData).subscribe({
          next: (response) => {
            console.log('CHARGE created successfully:', response);
            this.router.navigate(['/forms/charge']);
          },
          error: (error) => {
            console.error('Error creating charge:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.chargeForm.controls).forEach(key => {
      const control = this.chargeForm.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}