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
import { APP_CONSTANTS } from '../../../shared/constants/app.constants';

@Component({
  selector: 'app-lead-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lead-form.component.html',
  styleUrls: ['./lead-form.component.scss'],
})
export class LeadFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly leadsService = inject(LeadsService);

  // Form and state
  leadForm!: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  leadId: string | null = null;

  // Constants
  readonly LeadStatus = LeadStatus;
  readonly routes = APP_CONSTANTS.ROUTES;

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  /**
   * Initialize the form with validators
   */
  private initializeForm(): void {
    this.leadForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: [''], // No validation - completely optional
      phone: [''], // No validation - completely optional
      source: [''], // No validation - completely optional
      status: [''], // No validation - completely optional
      notes: [''],
    });
  }

  /**
   * Check if we're in edit mode and load data
   */
  private checkEditMode(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.leadId = id;
        this.loadLeadData(id);
      }
    });
  }

  /**
   * Load lead data for editing
   */
  private loadLeadData(id: string): void {
    const lead = this.leadsService.getLeadById(id);
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
    }
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.isFormValid() && !this.isSubmitting) {
      this.isSubmitting = true;

      const formValue = this.leadForm.value;

      if (this.isEditMode && this.leadId) {
        const updatedLead = this.leadsService.updateLead(
          this.leadId,
          formValue
        );
        if (updatedLead) {
          this.router.navigate([this.routes.LEADS]);
        } else {
          this.isSubmitting = false;
        }
      } else {
        this.leadsService.createLead(formValue);
        this.router.navigate([this.routes.LEADS]);
      }
    } else if (!this.isFormValid()) {
      this.markFormGroupTouched();
    }
  }

  /**
   * Check if form is valid (only firstName and lastName required)
   */
  isFormValid(): boolean {
    const firstName = this.leadForm.get('firstName');
    const lastName = this.leadForm.get('lastName');

    return !!(firstName?.valid && lastName?.valid);
  }

  /**
   * Check if field should show success styling (has value and is valid)
   */
  shouldShowSuccess(fieldName: string): boolean {
    const field = this.leadForm.get(fieldName);
    if (!field) return false;

    // Only show success for fields that have value and are valid
    return !!(field.value && field.valid && (field.dirty || field.touched));
  }

  /**
   * Check if field is invalid
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.leadForm.get(fieldName);
    if (!field) return false;

    // Only show errors for firstName and lastName
    if (fieldName === 'firstName' || fieldName === 'lastName') {
      return !!(field.invalid && (field.dirty || field.touched));
    }

    // For all other fields, only show error if they have value but are invalid
    return !!(field.value && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Get field error message
   */
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

  /**
   * Mark all form controls as touched
   */
  private markFormGroupTouched(): void {
    Object.keys(this.leadForm.controls).forEach((key) => {
      const control = this.leadForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Cancel form and navigate back
   */
  goBack(): void {
    this.router.navigate([this.routes.LEADS]);
  }
}
