import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PAS6Service } from './pas6.service';
import { PAS6 } from './pas6.model';

@Component({
  selector: 'app-pas6',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './pas6.component.html',
  styleUrls: ['./pas6.component.scss']
})
export class PAS6Component implements OnInit {
  pas6Form!: FormGroup;
  isEditMode = false;
  pas6Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private pas6Service: PAS6Service,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.pas6Id = +params['id'];
        this.isEditMode = true;
        this.loadPAS6();
      }
    });
  }

  initializeForm(): void {
    this.pas6Form = this.fb.group({
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

  loadPAS6(): void {
    if (this.pas6Id) {
      this.pas6Service.getPAS6(this.pas6Id).subscribe({
        next: (pas6) => {
          this.pas6Form.patchValue(pas6);
        },
        error: (error) => {
          console.error('Error loading pas6:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.pas6Form.valid) {
      const pas6Data = this.pas6Form.value;
      
      if (this.isEditMode && this.pas6Id) {
        this.pas6Service.updatePAS6(this.pas6Id, pas6Data).subscribe({
          next: (response) => {
            console.log('PAS6 updated successfully:', response);
            this.router.navigate(['/forms/pas6']);
          },
          error: (error) => {
            console.error('Error updating pas6:', error);
          }
        });
      } else {
        this.pas6Service.createPAS6(pas6Data).subscribe({
          next: (response) => {
            console.log('PAS6 created successfully:', response);
            this.router.navigate(['/forms/pas6']);
          },
          error: (error) => {
            console.error('Error creating pas6:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.pas6Form.controls).forEach(key => {
      const control = this.pas6Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}