import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MSC3Service } from './msc3.service';
import { MSC3 } from './msc3.model';

@Component({
  selector: 'app-msc3',
  templateUrl: './msc3.component.html',
  styleUrls: ['./msc3.component.scss']
})
export class MSC3Component implements OnInit {
  msc3Form!: FormGroup;
  isEditMode = false;
  msc3Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private msc3Service: MSC3Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.msc3Id = +params['id'];
        this.isEditMode = true;
        this.loadMSC3();
      }
    });
  }

  initializeForm(): void {
    this.msc3Form = this.fb.group({
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

  loadMSC3(): void {
    if (this.msc3Id) {
      this.msc3Service.getMSC3(this.msc3Id).subscribe({
        next: (msc3) => {
          this.msc3Form.patchValue(msc3);
        },
        error: (error) => {
          console.error('Error loading msc3:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.msc3Form.valid) {
      const msc3Data = this.msc3Form.value;
      
      if (this.isEditMode && this.msc3Id) {
        this.msc3Service.updateMSC3(this.msc3Id, msc3Data).subscribe({
          next: (response) => {
            console.log('MSC3 updated successfully:', response);
            this.router.navigate(['/forms/msc3']);
          },
          error: (error) => {
            console.error('Error updating msc3:', error);
          }
        });
      } else {
        this.msc3Service.createMSC3(msc3Data).subscribe({
          next: (response) => {
            console.log('MSC3 created successfully:', response);
            this.router.navigate(['/forms/msc3']);
          },
          error: (error) => {
            console.error('Error creating msc3:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.msc3Form.controls).forEach(key => {
      const control = this.msc3Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}