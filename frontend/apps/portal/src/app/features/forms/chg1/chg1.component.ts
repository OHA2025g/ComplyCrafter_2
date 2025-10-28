import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CHG1Service } from './chg1.service';
import { CHG1 } from './chg1.model';

@Component({
  selector: 'app-chg1',
  templateUrl: './chg1.component.html',
  styleUrls: ['./chg1.component.scss']
})
export class CHG1Component implements OnInit {
  chg1Form!: FormGroup;
  isEditMode = false;
  chg1Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private chg1Service: CHG1Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.chg1Id = +params['id'];
        this.isEditMode = true;
        this.loadCHG1();
      }
    });
  }

  initializeForm(): void {
    this.chg1Form = this.fb.group({
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

  loadCHG1(): void {
    if (this.chg1Id) {
      this.chg1Service.getCHG1(this.chg1Id).subscribe({
        next: (chg1) => {
          this.chg1Form.patchValue(chg1);
        },
        error: (error) => {
          console.error('Error loading chg1:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.chg1Form.valid) {
      const chg1Data = this.chg1Form.value;
      
      if (this.isEditMode && this.chg1Id) {
        this.chg1Service.updateCHG1(this.chg1Id, chg1Data).subscribe({
          next: (response) => {
            console.log('CHG1 updated successfully:', response);
            this.router.navigate(['/forms/chg1']);
          },
          error: (error) => {
            console.error('Error updating chg1:', error);
          }
        });
      } else {
        this.chg1Service.createCHG1(chg1Data).subscribe({
          next: (response) => {
            console.log('CHG1 created successfully:', response);
            this.router.navigate(['/forms/chg1']);
          },
          error: (error) => {
            console.error('Error creating chg1:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.chg1Form.controls).forEach(key => {
      const control = this.chg1Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}