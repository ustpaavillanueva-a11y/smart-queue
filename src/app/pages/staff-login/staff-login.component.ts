import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-staff-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './staff-login.component.html',
  styleUrl: './staff-login.component.css'
})
export class StaffLoginComponent {
  loginForm: FormGroup;
  submitted = signal(false);
  loading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted.set(true);
    this.errorMessage.set('');

    if (this.loginForm.invalid) {
      return;
    }

    this.loading.set(true);

    // Simulate API call to Firebase Authentication
    setTimeout(() => {
      this.loading.set(false);

      // Mock authentication - in real app, this would be Firebase Auth
      const email = this.loginForm.get('email')?.value;
      if (email.includes('admin')) {
        // Redirect admin to admin dashboard
        this.router.navigate(['/admin/dashboard']);
      } else {
        // Redirect staff to staff dashboard
        this.router.navigate(['/staff/dashboard']);
      }
    }, 1500);
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }
}
