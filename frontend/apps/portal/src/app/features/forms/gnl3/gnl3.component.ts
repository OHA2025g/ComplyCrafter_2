import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GNL3Service } from './gnl3.service';
import { GNL3 } from './gnl3.model';

@Component({
  selector: 'app-gnl3',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './gnl3.component.html',
  styleUrls: ['./gnl3.component.scss']
})
export class GNL3Component implements OnInit {
  gnl3Form!: FormGroup;
  isEditMode = false;
  gnl3Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private gnl3Service: GNL3Service,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.gnl3Id = +params['id'];
        this.isEditMode = true;
        this.loadGNL3();
      }
    });
  }

  initializeForm(): void {
    this.gnl3Form = this.fb.group({
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

  loadGNL3(): void {
    if (this.gnl3Id) {
      this.gnl3Service.getGNL3(this.gnl3Id).subscribe({
        next: (gnl3) => {
          this.gnl3Form.patchValue(gnl3);
        },
        error: (error) => {
          console.error('Error loading gnl3:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.gnl3Form.valid) {
      const gnl3Data = this.gnl3Form.value;
      
      if (this.isEditMode && this.gnl3Id) {
        this.gnl3Service.updateGNL3(this.gnl3Id, gnl3Data).subscribe({
          next: (response) => {
            console.log('GNL3 updated successfully:', response);
            this.router.navigate(['/forms/gnl3']);
          },
          error: (error) => {
            console.error('Error updating gnl3:', error);
          }
        });
      } else {
        this.gnl3Service.createGNL3(gnl3Data).subscribe({
          next: (response) => {
            console.log('GNL3 created successfully:', response);
            this.router.navigate(['/forms/gnl3']);
          },
          error: (error) => {
            console.error('Error creating gnl3:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.gnl3Form.controls).forEach(key => {
      const control = this.gnl3Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}