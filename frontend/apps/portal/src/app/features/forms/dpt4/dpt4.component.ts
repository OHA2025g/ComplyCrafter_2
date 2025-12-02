import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DPT4Service } from './dpt4.service';
import { DPT4 } from './dpt4.model';

@Component({
  selector: 'app-dpt4',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './dpt4.component.html',
  styleUrls: ['./dpt4.component.scss']
})
export class DPT4Component implements OnInit {
  dpt4Form!: FormGroup;
  isEditMode = false;
  dpt4Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private dpt4Service: DPT4Service,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.dpt4Id = +params['id'];
        this.isEditMode = true;
        this.loadDPT4();
      }
    });
  }

  initializeForm(): void {
    this.dpt4Form = this.fb.group({
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

  loadDPT4(): void {
    if (this.dpt4Id) {
      this.dpt4Service.getDPT4(this.dpt4Id).subscribe({
        next: (dpt4) => {
          this.dpt4Form.patchValue(dpt4);
        },
        error: (error) => {
          console.error('Error loading dpt4:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.dpt4Form.valid) {
      const dpt4Data = this.dpt4Form.value;
      
      if (this.isEditMode && this.dpt4Id) {
        this.dpt4Service.updateDPT4(this.dpt4Id, dpt4Data).subscribe({
          next: (response) => {
            console.log('DPT4 updated successfully:', response);
            this.router.navigate(['/forms/dpt4']);
          },
          error: (error) => {
            console.error('Error updating dpt4:', error);
          }
        });
      } else {
        this.dpt4Service.createDPT4(dpt4Data).subscribe({
          next: (response) => {
            console.log('DPT4 created successfully:', response);
            this.router.navigate(['/forms/dpt4']);
          },
          error: (error) => {
            console.error('Error creating dpt4:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.dpt4Form.controls).forEach(key => {
      const control = this.dpt4Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}