import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  loginForm: FormGroup;
  submitted = signal(false);
  loading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private firebaseService: FirebaseService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
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
    const { email, password } = this.loginForm.value;

    this.firebaseService.loginUser(email, password)
      .then(() => {
        this.loading.set(false);
        this.errorMessage.set('');
        
        // Wait for role to be fetched from Firestore (increased timeout)
        let attempts = 0;
        const checkRole = setInterval(() => {
          attempts++;
          console.log('Checking role... attempt:', attempts, 'role:', this.firebaseService.userRole());
          
          if (this.firebaseService.userRole() === 'admin') {
            clearInterval(checkRole);
            this.router.navigate(['/admin/dashboard']);
          } else if (attempts >= 20) { // 20 * 250ms = 5 seconds max wait
            clearInterval(checkRole);
            this.firebaseService.logoutUser();
            this.errorMessage.set(`Only admin accounts can access this page. Role: ${this.firebaseService.userRole() || 'not found'}`);
          }
        }, 250);
      })
      .catch((error: any) => {
        this.loading.set(false);
        this.errorMessage.set(error.message);
      });
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }
}
