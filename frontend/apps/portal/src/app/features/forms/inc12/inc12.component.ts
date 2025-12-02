import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { INC12Service } from './inc12.service';
import { INC12 } from './inc12.model';

@Component({
  selector: 'app-inc12',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './inc12.component.html',
  styleUrls: ['./inc12.component.scss']
})
export class INC12Component implements OnInit {
  inc12Form!: FormGroup;
  isEditMode = false;
  inc12Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private inc12Service: INC12Service,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.inc12Id = +params['id'];
        this.isEditMode = true;
        this.loadINC12();
      }
    });
  }

  initializeForm(): void {
    this.inc12Form = this.fb.group({
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

  loadINC12(): void {
    if (this.inc12Id) {
      this.inc12Service.getINC12(this.inc12Id).subscribe({
        next: (inc12) => {
          this.inc12Form.patchValue(inc12);
        },
        error: (error) => {
          console.error('Error loading inc12:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.inc12Form.valid) {
      const inc12Data = this.inc12Form.value;
      
      if (this.isEditMode && this.inc12Id) {
        this.inc12Service.updateINC12(this.inc12Id, inc12Data).subscribe({
          next: (response) => {
            console.log('INC12 updated successfully:', response);
            this.router.navigate(['/forms/inc12']);
          },
          error: (error) => {
            console.error('Error updating inc12:', error);
          }
        });
      } else {
        this.inc12Service.createINC12(inc12Data).subscribe({
          next: (response) => {
            console.log('INC12 created successfully:', response);
            this.router.navigate(['/forms/inc12']);
          },
          error: (error) => {
            console.error('Error creating inc12:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.inc12Form.controls).forEach(key => {
      const control = this.inc12Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}