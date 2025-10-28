import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RUNLLPService } from './runllp.service';
import { RUNLLP } from './runllp.model';

@Component({
  selector: 'app-runllp',
  templateUrl: './runllp.component.html',
  styleUrls: ['./runllp.component.scss']
})
export class RUNLLPComponent implements OnInit {
  runllpForm!: FormGroup;
  isEditMode = false;
  runllpId: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private runllpService: RUNLLPService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.runllpId = +params['id'];
        this.isEditMode = true;
        this.loadRUNLLP();
      }
    });
  }

  initializeForm(): void {
    this.runllpForm = this.fb.group({
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

  loadRUNLLP(): void {
    if (this.runllpId) {
      this.runllpService.getRUNLLP(this.runllpId).subscribe({
        next: (runllp) => {
          this.runllpForm.patchValue(runllp);
        },
        error: (error) => {
          console.error('Error loading runllp:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.runllpForm.valid) {
      const runllpData = this.runllpForm.value;
      
      if (this.isEditMode && this.runllpId) {
        this.runllpService.updateRUNLLP(this.runllpId, runllpData).subscribe({
          next: (response) => {
            console.log('RUNLLP updated successfully:', response);
            this.router.navigate(['/forms/runllp']);
          },
          error: (error) => {
            console.error('Error updating runllp:', error);
          }
        });
      } else {
        this.runllpService.createRUNLLP(runllpData).subscribe({
          next: (response) => {
            console.log('RUNLLP created successfully:', response);
            this.router.navigate(['/forms/runllp']);
          },
          error: (error) => {
            console.error('Error creating runllp:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.runllpForm.controls).forEach(key => {
      const control = this.runllpForm.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}