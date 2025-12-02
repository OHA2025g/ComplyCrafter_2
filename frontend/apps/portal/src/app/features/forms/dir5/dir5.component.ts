import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DIR5Service } from './dir5.service';
import { DIR5 } from './dir5.model';

@Component({
  selector: 'app-dir5',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './dir5.component.html',
  styleUrls: ['./dir5.component.scss']
})
export class DIR5Component implements OnInit {
  dir5Form!: FormGroup;
  isEditMode = false;
  dir5Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private dir5Service: DIR5Service,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.dir5Id = +params['id'];
        this.isEditMode = true;
        this.loadDIR5();
      }
    });
  }

  initializeForm(): void {
    this.dir5Form = this.fb.group({
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

  loadDIR5(): void {
    if (this.dir5Id) {
      this.dir5Service.getDIR5(this.dir5Id).subscribe({
        next: (dir5) => {
          this.dir5Form.patchValue(dir5);
        },
        error: (error) => {
          console.error('Error loading dir5:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.dir5Form.valid) {
      const dir5Data = this.dir5Form.value;
      
      if (this.isEditMode && this.dir5Id) {
        this.dir5Service.updateDIR5(this.dir5Id, dir5Data).subscribe({
          next: (response) => {
            console.log('DIR5 updated successfully:', response);
            this.router.navigate(['/forms/dir5']);
          },
          error: (error) => {
            console.error('Error updating dir5:', error);
          }
        });
      } else {
        this.dir5Service.createDIR5(dir5Data).subscribe({
          next: (response) => {
            console.log('DIR5 created successfully:', response);
            this.router.navigate(['/forms/dir5']);
          },
          error: (error) => {
            console.error('Error creating dir5:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.dir5Form.controls).forEach(key => {
      const control = this.dir5Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}