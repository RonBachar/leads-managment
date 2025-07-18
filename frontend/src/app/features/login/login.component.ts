import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  signInWithEmail() {
    // TODO: Implement email/password sign-in with Firebase
    // Example: this.auth.signInWithEmail(this.loginForm.value.email, this.loginForm.value.password)
    //   .then(() => this.router.navigate(['/home']));
  }

  signInWithGoogle() {
    this.auth.signInWithGoogle().then(() => {
      this.router.navigate(['/home']);
    });
  }

  forgotPassword() {
    // TODO: Implement forgot password logic (e.g., open a dialog or send reset email)
  }
}
