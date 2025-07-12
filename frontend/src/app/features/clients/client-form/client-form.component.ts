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

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css',
})
export class ClientFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private clientsService = inject(ClientsService);

  clientForm!: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  clientId: string | null = null;
  PackageType = PackageType;
  selectedFile: File | null = null;
  existingFile: File | null = null;

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  private initializeForm(): void {
    this.clientForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^[0-9\-\+\(\)\s]+$/)],
      ],
      domain: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}$/),
        ],
      ],
      packageType: ['', [Validators.required]],
      packagePrice: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ],
      ],
      renewalDate: ['', [Validators.required]],
    });
  }

  private checkEditMode(): void {
    this.clientId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.clientId;

    if (this.isEditMode && this.clientId) {
      const client = this.clientsService.getClientById(this.clientId);
      if (client) {
        this.clientForm.patchValue({
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          phone: client.phone,
          domain: client.domain,
          packageType: client.packageType,
          packagePrice: client.packagePrice.toString(),
          renewalDate: this.formatDateForInput(client.renewalDate),
        });
        this.existingFile = client.contractFile;
      } else {
        // Client not found, redirect to clients list
        this.router.navigate(['/clients']);
      }
    }
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getPackageHebrew(packageType: PackageType): string {
    const packageMap: { [key: string]: string } = {
      [PackageType.HOSTING]: 'אחסון',
      [PackageType.ELEMENTOR_PRO]: 'Elementor Pro',
      [PackageType.HOSTING_ELEMENTOR_PRO]: 'אחסון + Elementor Pro',
    };
    return packageMap[packageType] || packageType;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.existingFile = null;
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    const fileInput = document.getElementById(
      'contractFile'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  removeExistingFile(): void {
    this.existingFile = null;
    this.selectedFile = null;
  }

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
          this.router.navigate(['/clients']);
        } else {
          this.isSubmitting = false;
        }
      } else {
        this.clientsService.createClient(clientData);
        this.router.navigate(['/clients']);
      }
    } else if (!this.clientForm.valid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.clientForm.controls).forEach((key) => {
        const control = this.clientForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/clients']);
  }
}
