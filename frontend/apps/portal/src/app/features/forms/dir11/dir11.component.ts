import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DIR11Service } from './dir11.service';
import { DIR11 } from './dir11.model';

@Component({
  selector: 'app-dir11',
  templateUrl: './dir11.component.html',
  styleUrls: ['./dir11.component.scss']
})
export class DIR11Component implements OnInit {
  dir11Form!: FormGroup;
  isEditMode = false;
  dir11Id: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private dir11Service: DIR11Service,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.dir11Id = +params['id'];
        this.isEditMode = true;
        this.loadDIR11();
      }
    });
  }

  initializeForm(): void {
    this.dir11Form = this.fb.group({
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

  loadDIR11(): void {
    if (this.dir11Id) {
      this.dir11Service.getDIR11(this.dir11Id).subscribe({
        next: (dir11) => {
          this.dir11Form.patchValue(dir11);
        },
        error: (error) => {
          console.error('Error loading dir11:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.dir11Form.valid) {
      const dir11Data = this.dir11Form.value;
      
      if (this.isEditMode && this.dir11Id) {
        this.dir11Service.updateDIR11(this.dir11Id, dir11Data).subscribe({
          next: (response) => {
            console.log('DIR11 updated successfully:', response);
            this.router.navigate(['/forms/dir11']);
          },
          error: (error) => {
            console.error('Error updating dir11:', error);
          }
        });
      } else {
        this.dir11Service.createDIR11(dir11Data).subscribe({
          next: (response) => {
            console.log('DIR11 created successfully:', response);
            this.router.navigate(['/forms/dir11']);
          },
          error: (error) => {
            console.error('Error creating dir11:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.dir11Form.controls).forEach(key => {
      const control = this.dir11Form.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}