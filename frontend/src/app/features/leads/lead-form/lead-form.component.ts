import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadsService } from '../../../core/services/leads.service';
import { LeadStatus } from '../../../shared/models/lead.model';

@Component({
  selector: 'app-lead-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lead-form.component.html',
  styleUrl: './lead-form.component.css',
})
export class LeadFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private leadsService = inject(LeadsService);

  leadForm!: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  leadId: string | null = null;
  LeadStatus = LeadStatus;

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  private initializeForm(): void {
    this.leadForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.email]],
      phone: ['', [Validators.pattern(/^[0-9\-\+\(\)\s]+$/)]],
      source: ['', [Validators.required]],
      status: ['', [Validators.required]],
      notes: [''],
    });
  }

  private checkEditMode(): void {
    this.leadId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.leadId;

    if (this.isEditMode && this.leadId) {
      const lead = this.leadsService.getLeadById(this.leadId);
      if (lead) {
        this.leadForm.patchValue({
          firstName: lead.firstName,
          lastName: lead.lastName,
          email: lead.email || '',
          phone: lead.phone || '',
          source: lead.source,
          status: lead.status,
          notes: lead.notes || '',
        });
      } else {
        // Lead not found, redirect to leads list
        this.router.navigate(['/leads']);
      }
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.leadForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.leadForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) {
      return 'שדה זה הוא חובה';
    }
    if (field.errors['email']) {
      return 'אנא הכנס כתובת אימייל תקינה';
    }
    if (field.errors['pattern']) {
      switch (fieldName) {
        case 'phone':
          return 'אנא הכנס מספר טלפון תקין';
        default:
          return 'פורמט לא תקין';
      }
    }
    if (field.errors['minlength']) {
      return `שדה זה חייב להכיל לפחות ${field.errors['minlength'].requiredLength} תווים`;
    }

    return 'שדה זה אינו תקין';
  }

  onSubmit(): void {
    if (this.leadForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formValue = this.leadForm.value;

      if (this.isEditMode && this.leadId) {
        const updatedLead = this.leadsService.updateLead(
          this.leadId,
          formValue
        );
        if (updatedLead) {
          this.router.navigate(['/leads']);
        } else {
          this.isSubmitting = false;
        }
      } else {
        this.leadsService.createLead(formValue);
        this.router.navigate(['/leads']);
      }
    } else if (!this.leadForm.valid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.leadForm.controls).forEach((key) => {
        const control = this.leadForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/leads']);
  }
}
