import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RUNService } from './run.service';
import { RUN } from './run.model';

@Component({
  selector: 'app-run',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './run.component.html',
  styleUrls: ['./run.component.scss']
})
export class RUNComponent implements OnInit {
  runForm!: FormGroup;
  isEditMode = false;
  runId: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private runService: RUNService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.runId = +params['id'];
        this.isEditMode = true;
        this.loadRUN();
      }
    });
  }

  initializeForm(): void {
    this.runForm = this.fb.group({
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

  loadRUN(): void {
    if (this.runId) {
      this.runService.getRUN(this.runId).subscribe({
        next: (run) => {
          this.runForm.patchValue(run);
        },
        error: (error) => {
          console.error('Error loading run:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.runForm.valid) {
      const runData = this.runForm.value;
      
      if (this.isEditMode && this.runId) {
        this.runService.updateRUN(this.runId, runData).subscribe({
          next: (response) => {
            console.log('RUN updated successfully:', response);
            this.router.navigate(['/forms/run']);
          },
          error: (error) => {
            console.error('Error updating run:', error);
          }
        });
      } else {
        this.runService.createRUN(runData).subscribe({
          next: (response) => {
            console.log('RUN created successfully:', response);
            this.router.navigate(['/forms/run']);
          },
          error: (error) => {
            console.error('Error creating run:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.runForm.controls).forEach(key => {
      const control = this.runForm.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}