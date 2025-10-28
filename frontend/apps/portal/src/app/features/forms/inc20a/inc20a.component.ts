import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { INC20AService } from './inc20a.service';
import { INC20A } from './inc20a.model';

@Component({
  selector: 'app-inc20a',
  templateUrl: './inc20a.component.html',
  styleUrls: ['./inc20a.component.scss']
})
export class INC20AComponent implements OnInit {
  inc20aForm!: FormGroup;
  isEditMode = false;
  inc20aId: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private inc20aService: INC20AService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.inc20aId = +params['id'];
        this.isEditMode = true;
        this.loadINC20A();
      }
    });
  }

  initializeForm(): void {
    this.inc20aForm = this.fb.group({
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

  loadINC20A(): void {
    if (this.inc20aId) {
      this.inc20aService.getINC20A(this.inc20aId).subscribe({
        next: (inc20a) => {
          this.inc20aForm.patchValue(inc20a);
        },
        error: (error) => {
          console.error('Error loading inc20a:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.inc20aForm.valid) {
      const inc20aData = this.inc20aForm.value;
      
      if (this.isEditMode && this.inc20aId) {
        this.inc20aService.updateINC20A(this.inc20aId, inc20aData).subscribe({
          next: (response) => {
            console.log('INC20A updated successfully:', response);
            this.router.navigate(['/forms/inc20a']);
          },
          error: (error) => {
            console.error('Error updating inc20a:', error);
          }
        });
      } else {
        this.inc20aService.createINC20A(inc20aData).subscribe({
          next: (response) => {
            console.log('INC20A created successfully:', response);
            this.router.navigate(['/forms/inc20a']);
          },
          error: (error) => {
            console.error('Error creating inc20a:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.inc20aForm.controls).forEach(key => {
      const control = this.inc20aForm.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}