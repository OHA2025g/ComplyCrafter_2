import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BOARDREPORTService } from './boardreport.service';
import { BOARDREPORT } from './boardreport.model';

@Component({
  selector: 'app-boardreport',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './boardreport.component.html',
  styleUrls: ['./boardreport.component.scss']
})
export class BOARDREPORTComponent implements OnInit {
  boardreportForm!: FormGroup;
  isEditMode = false;
  boardreportId: number | null = null;
  activeTab = 'details';

  constructor(
    private fb: FormBuilder,
    private boardreportService: BOARDREPORTService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.boardreportId = +params['id'];
        this.isEditMode = true;
        this.loadBOARDREPORT();
      }
    });
  }

  initializeForm(): void {
    this.boardreportForm = this.fb.group({
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

  loadBOARDREPORT(): void {
    if (this.boardreportId) {
      this.boardreportService.getBOARDREPORT(this.boardreportId).subscribe({
        next: (boardreport) => {
          this.boardreportForm.patchValue(boardreport);
        },
        error: (error) => {
          console.error('Error loading boardreport:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.boardreportForm.valid) {
      const boardreportData = this.boardreportForm.value;
      
      if (this.isEditMode && this.boardreportId) {
        this.boardreportService.updateBOARDREPORT(this.boardreportId, boardreportData).subscribe({
          next: (response) => {
            console.log('BOARDREPORT updated successfully:', response);
            this.router.navigate(['/forms/boardreport']);
          },
          error: (error) => {
            console.error('Error updating boardreport:', error);
          }
        });
      } else {
        this.boardreportService.createBOARDREPORT(boardreportData).subscribe({
          next: (response) => {
            console.log('BOARDREPORT created successfully:', response);
            this.router.navigate(['/forms/boardreport']);
          },
          error: (error) => {
            console.error('Error creating boardreport:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.boardreportForm.controls).forEach(key => {
      const control = this.boardreportForm.get(key);
      control?.markAsTouched();
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}