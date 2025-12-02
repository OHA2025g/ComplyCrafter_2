import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DIR3Service } from './dir3.service';
import { DIR3 } from './dir3.model';

@Component({
  selector: 'app-dir3',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './dir3.component.html',
  styleUrls: ['./dir3.component.scss']
})
export class DIR3Component implements OnInit {
  dir3Form!: FormGroup;
  isEditMode = false;
  dir3Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private dir3Service: DIR3Service,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.dir3Id = +params['id'];
        this.isEditMode = true;
        this.loadDIR3();
      }
    });
  }

  initializeForm(): void {
    this.dir3Form = this.fb.group({
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

  loadDIR3(): void {
    if (this.dir3Id) {
      this.dir3Service.getDIR3(this.dir3Id).subscribe({
        next: (dir3) => {
          this.dir3Form.patchValue(dir3);
        },
        error: (error) => {
          console.error('Error loading dir3:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.dir3Form.valid) {
      const dir3Data = this.dir3Form.value;
      
      if (this.isEditMode && this.dir3Id) {
        this.dir3Service.updateDIR3(this.dir3Id, dir3Data).subscribe({
          next: (response) => {
            console.log('DIR3 updated successfully:', response);
            this.router.navigate(['/forms/dir3']);
          },
          error: (error) => {
            console.error('Error updating dir3:', error);
          }
        });
      } else {
        this.dir3Service.createDIR3(dir3Data).subscribe({
          next: (response) => {
            console.log('DIR3 created successfully:', response);
            this.router.navigate(['/forms/dir3']);
          },
          error: (error) => {
            console.error('Error creating dir3:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.dir3Form.controls).forEach(key => {
      const control = this.dir3Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}