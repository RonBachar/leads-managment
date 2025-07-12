import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../../core/services/clients.service';
import { PackageType } from '../../../shared/models/client.model';
import { FormValidationService } from '../../../shared/services/form-validation.service';
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
  private readonly validationService = inject(FormValidationService);
  private readonly utils = inject(UtilsService);

  // Form and state
  clientForm!: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  clientId: string | null = null;
  selectedFile: File | null = null;
  existingFile: File | null = null;

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
    this.clientForm = this.fb.group(
      this.validationService.getClientValidators()
    );
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
    } else if (!this.clientForm.valid) {
      this.validationService.markFormGroupTouched(this.clientForm.controls);
    }
  }

  /**
   * Get validation error message
   */
  getErrorMessage(controlName: string, fieldName: string): string {
    const control = this.clientForm.get(controlName);
    return control
      ? this.validationService.getErrorMessage(control, fieldName)
      : '';
  }

  /**
   * Check if field has error
   */
  hasError(controlName: string): boolean {
    const control = this.clientForm.get(controlName);
    return control ? this.validationService.hasError(control) : false;
  }

  /**
   * Check if field is invalid
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Get field error
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
        case 'domain':
          return 'אנא הכנס דומיין תקין (לדוגמה: example.co.il)';
        case 'packagePrice':
          return 'אנא הכנס מחיר תקין';
        default:
          return 'פורמט לא תקין';
      }
    }
    if (field.errors['minlength']) {
      return `שדה זה חייב להכיל לפחות ${field.errors['minlength'].requiredLength} תווים`;
    }
    if (field.errors['min']) {
      return 'הערך חייב להיות גדול מ-0';
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
}
