import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PAS2Service } from './pas2.service';
import { PAS2 } from './pas2.model';

@Component({
  selector: 'app-pas2',
  templateUrl: './pas2.component.html',
  styleUrls: ['./pas2.component.scss']
})
export class PAS2Component implements OnInit {
  pas2Form!: FormGroup;
  isEditMode = false;
  pas2Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private pas2Service: PAS2Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.pas2Id = +params['id'];
        this.isEditMode = true;
        this.loadPAS2();
      }
    });
  }

  initializeForm(): void {
    this.pas2Form = this.fb.group({
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

  loadPAS2(): void {
    if (this.pas2Id) {
      this.pas2Service.getPAS2(this.pas2Id).subscribe({
        next: (pas2) => {
          this.pas2Form.patchValue(pas2);
        },
        error: (error) => {
          console.error('Error loading pas2:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.pas2Form.valid) {
      const pas2Data = this.pas2Form.value;
      
      if (this.isEditMode && this.pas2Id) {
        this.pas2Service.updatePAS2(this.pas2Id, pas2Data).subscribe({
          next: (response) => {
            console.log('PAS2 updated successfully:', response);
            this.router.navigate(['/forms/pas2']);
          },
          error: (error) => {
            console.error('Error updating pas2:', error);
          }
        });
      } else {
        this.pas2Service.createPAS2(pas2Data).subscribe({
          next: (response) => {
            console.log('PAS2 created successfully:', response);
            this.router.navigate(['/forms/pas2']);
          },
          error: (error) => {
            console.error('Error creating pas2:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.pas2Form.controls).forEach(key => {
      const control = this.pas2Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}