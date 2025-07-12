import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadsService } from '../../../core/services/leads.service';
import { LeadStatus } from '../../../shared/models/lead.model';
import { FormValidationService } from '../../../shared/services/form-validation.service';
import { UtilsService } from '../../../shared/services/utils.service';
import {
  APP_CONSTANTS,
  LEAD_SOURCES,
} from '../../../shared/constants/app.constants';

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
  private readonly validationService = inject(FormValidationService);
  private readonly utils = inject(UtilsService);

  // Form and state
  leadForm!: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  leadId: string | null = null;

  // Constants
  readonly LeadStatus = LeadStatus;
  readonly leadSources = Object.values(LEAD_SOURCES);
  readonly routes = APP_CONSTANTS.ROUTES;

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  /**
   * Initialize the form with validators
   */
  private initializeForm(): void {
    this.leadForm = this.fb.group(this.validationService.getLeadValidators());
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
    if (this.leadForm.valid && !this.isSubmitting) {
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
    } else if (!this.leadForm.valid) {
      this.validationService.markFormGroupTouched(this.leadForm.controls);
    }
  }

  /**
   * Get validation error message
   */
  getErrorMessage(controlName: string, fieldName: string): string {
    const control = this.leadForm.get(controlName);
    return control
      ? this.validationService.getErrorMessage(control, fieldName)
      : '';
  }

  /**
   * Check if field has error
   */
  hasError(controlName: string): boolean {
    const control = this.leadForm.get(controlName);
    return control ? this.validationService.hasError(control) : false;
  }

  /**
   * Check if field is invalid
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.leadForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Get field error
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
   * Cancel form and navigate back
   */
  goBack(): void {
    this.router.navigate([this.routes.LEADS]);
  }
}
