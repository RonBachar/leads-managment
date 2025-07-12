import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../../core/services/clients.service';
import { PackageType } from '../../../shared/models/client.model';
import { UtilsService } from '../../../shared/services/utils.service';
import {
  APP_CONSTANTS,
  PACKAGE_LABELS,
} from '../../../shared/constants/app.constants';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss'],
})
export class ClientFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly clientsService = inject(ClientsService);
  private readonly utils = inject(UtilsService);

  // Form and state
  clientForm!: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  clientId: string | null = null;
  selectedFile: File | null = null;
  existingFile: File | null = null;
  daysUntilRenewal: number | null = null;

  // Constants
  readonly PackageType = PackageType;
  readonly routes = APP_CONSTANTS.ROUTES;

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  /**
   * Initialize the form with validators
   */
  private initializeForm(): void {
    this.clientForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9-+\s()]+$/)]],
      domain: [''],
      packageType: [''],
      packagePrice: [''],
      renewalDate: [''],
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
        this.clientId = id;
        this.loadClientData(id);
      }
    });
  }

  /**
   * Load client data for editing
   */
  private loadClientData(id: string): void {
    const client = this.clientsService.getClientById(id);
    if (client) {
      this.clientForm.patchValue({
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
        domain: client.domain,
        packageType: client.packageType,
        packagePrice: client.packagePrice,
        renewalDate: this.formatDateForInput(client.renewalDate),
      });
      this.existingFile = client.contractFile;

      // Calculate days until renewal for existing client
      const today = new Date();
      const daysUntilRenewal = Math.ceil(
        (client.renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      this.daysUntilRenewal = daysUntilRenewal;
    }
  }

  /**
   * Format date for input field
   */
  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Handle file selection
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const validation = this.utils.validateFile(file);

      if (validation.isValid) {
        this.selectedFile = file;
      } else {
        alert(validation.error);
        input.value = '';
      }
    }
  }

  /**
   * Remove selected file
   */
  removeFile(): void {
    this.selectedFile = null;
    const fileInput = document.getElementById(
      'contractFile'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  /**
   * Remove existing file
   */
  removeExistingFile(): void {
    this.existingFile = null;
    this.selectedFile = null;
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.clientForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formValue = this.clientForm.value;
      const contractFile = this.selectedFile || this.existingFile;

      const clientData = {
        ...formValue,
        packagePrice: parseFloat(formValue.packagePrice),
        renewalDate: new Date(formValue.renewalDate),
        contractFile: contractFile,
      };

      if (this.isEditMode && this.clientId) {
        const updatedClient = this.clientsService.updateClient(
          this.clientId,
          clientData
        );
        if (updatedClient) {
          this.router.navigate([this.routes.CLIENTS]);
        } else {
          this.isSubmitting = false;
        }
      } else {
        this.clientsService.createClient(clientData);
        this.router.navigate([this.routes.CLIENTS]);
      }
    } else if (!this.isFormValid()) {
      this.markFormGroupTouched();
    }
  }

  /**
   * Check if field is invalid
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    if (!field) return false;

    // Only show errors for required fields: firstName, lastName, email, phone
    if (['firstName', 'lastName', 'email', 'phone'].includes(fieldName)) {
      return !!(field.invalid && (field.dirty || field.touched));
    }

    // For all other fields, only show error if they have value but are invalid
    return !!(field.value && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Get field error message
   */
  getFieldError(fieldName: string): string {
    const field = this.clientForm.get(fieldName);
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
   * Get package Hebrew label
   */
  getPackageHebrew(packageType: PackageType): string {
    return PACKAGE_LABELS[packageType] || packageType;
  }

  /**
   * Cancel form and navigate back
   */
  goBack(): void {
    this.router.navigate([this.routes.CLIENTS]);
  }

  /**
   * Handle renewal date change
   */
  onRenewalDateChange(): void {
    const renewalDateControl = this.clientForm.get('renewalDate');
    if (renewalDateControl && renewalDateControl.value) {
      const renewalDate = new Date(renewalDateControl.value);
      const today = new Date();
      const daysUntilRenewal = Math.ceil(
        (renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      this.daysUntilRenewal = daysUntilRenewal;
    } else {
      this.daysUntilRenewal = null;
    }
  }

  /**
   * Get days until renewal text
   */
  getDaysUntilRenewalText(): string {
    if (this.daysUntilRenewal === null) return '';

    if (this.daysUntilRenewal < 0) {
      return `${Math.abs(this.daysUntilRenewal)} ימים באיחור`;
    } else if (this.daysUntilRenewal === 0) {
      return 'היום';
    } else if (this.daysUntilRenewal === 1) {
      return 'מחר';
    } else {
      return `${this.daysUntilRenewal} ימים עד לחידוש`;
    }
  }

  /**
   * Check if form is valid
   */
  isFormValid(): boolean {
    // Only check required fields: firstName, lastName, email, phone
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    return requiredFields.every((field) => {
      const control = this.clientForm.get(field);
      return control && control.valid;
    });
  }

  /**
   * Check if field should show success state
   */
  shouldShowSuccess(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    if (!field) return false;

    // Only show success for fields that have value and are valid
    return !!(field.value && field.valid && (field.dirty || field.touched));
  }

  /**
   * Mark all form controls as touched
   */
  private markFormGroupTouched(): void {
    Object.keys(this.clientForm.controls).forEach((key) => {
      const control = this.clientForm.get(key);
      control?.markAsTouched();
    });
  }
}
