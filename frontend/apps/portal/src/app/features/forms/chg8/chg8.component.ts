import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CHG8Service } from './chg8.service';
import { CHG8 } from './chg8.model';

@Component({
  selector: 'app-chg8',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './chg8.component.html',
  styleUrls: ['./chg8.component.scss']
})
export class CHG8Component implements OnInit {
  chg8Form!: FormGroup;
  isEditMode = false;
  chg8Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private chg8Service: CHG8Service,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.chg8Id = +params['id'];
        this.isEditMode = true;
        this.loadCHG8();
      }
    });
  }

  initializeForm(): void {
    this.chg8Form = this.fb.group({
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

  loadCHG8(): void {
    if (this.chg8Id) {
      this.chg8Service.getCHG8(this.chg8Id).subscribe({
        next: (chg8) => {
          this.chg8Form.patchValue(chg8);
        },
        error: (error) => {
          console.error('Error loading chg8:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.chg8Form.valid) {
      const chg8Data = this.chg8Form.value;
      
      if (this.isEditMode && this.chg8Id) {
        this.chg8Service.updateCHG8(this.chg8Id, chg8Data).subscribe({
          next: (response) => {
            console.log('CHG8 updated successfully:', response);
            this.router.navigate(['/forms/chg8']);
          },
          error: (error) => {
            console.error('Error updating chg8:', error);
          }
        });
      } else {
        this.chg8Service.createCHG8(chg8Data).subscribe({
          next: (response) => {
            console.log('CHG8 created successfully:', response);
            this.router.navigate(['/forms/chg8']);
          },
          error: (error) => {
            console.error('Error creating chg8:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.chg8Form.controls).forEach(key => {
      const control = this.chg8Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}