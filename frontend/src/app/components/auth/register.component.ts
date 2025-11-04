import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/ecommerce.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Create Account</h2>
        <form (ngSubmit)="onSubmit()" #registerForm="ngForm" class="auth-form">
          <div class="form-group">
            <label for="name">Full Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              [(ngModel)]="userData.name"
              required
              minlength="2"
              maxlength="50"
              #name="ngModel"
              class="form-control"
              [class.error]="name.invalid && name.touched"
            />
            <div *ngIf="name.invalid && name.touched" class="error-message">
              <span *ngIf="name.errors?.['required']">Name is required</span>
              <span *ngIf="name.errors?.['minlength']">Name must be at least 2 characters</span>
              <span *ngIf="name.errors?.['maxlength']">Name cannot exceed 50 characters</span>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="userData.email"
              required
              email
              #email="ngModel"
              class="form-control"
              [class.error]="email.invalid && email.touched"
            />
            <div *ngIf="email.invalid && email.touched" class="error-message">
              <span *ngIf="email.errors?.['required']">Email is required</span>
              <span *ngIf="email.errors?.['email']">Please enter a valid email</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="userData.password"
              required
              minlength="3"
              #password="ngModel"
              class="form-control"
              [class.error]="password.invalid && password.touched"
            />
            <div *ngIf="password.invalid && password.touched" class="error-message">
              <span *ngIf="password.errors?.['required']">Password is required</span>
              <span *ngIf="password.errors?.['minlength']">Password must be at least 3 characters</span>
            </div>
          </div>

          <div class="form-group">
            <label for="role">Account Type:</label>
            <select
              id="role"
              name="role"
              [(ngModel)]="userData.role"
              required
              #role="ngModel"
              class="form-control"
              [class.error]="role.invalid && role.touched"
            >
              <option value="">Select account type</option>
              <option value="client">Client (Buy products)</option>
              <option value="seller">Seller (Sell products)</option>
            </select>
            <div *ngIf="role.invalid && role.touched" class="error-message">
              <span *ngIf="role.errors?.['required']">Please select an account type</span>
            </div>
          </div>

          <div *ngIf="userData.role === 'seller'" class="form-group">
            <label for="avatar">Avatar URL (Optional):</label>
            <input
              type="url"
              id="avatar"
              name="avatar"
              [(ngModel)]="userData.avatar"
              #avatar="ngModel"
              class="form-control"
              placeholder="https://example.com/avatar.jpg"
            />
            <small class="form-hint">Provide a URL to your profile picture</small>
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="registerForm.invalid || isLoading"
          >
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </button>

          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </form>

        <p class="auth-link">
          Already have an account? <a routerLink="/login">Sign in here</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 20px;
    }

    .auth-card {
      background: white;
      border-radius: 10px;
      padding: 40px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 450px;
    }

    h2 {
      text-align: center;
      margin-bottom: 30px;
      color: #333;
      font-weight: 600;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label {
      font-weight: 500;
      color: #555;
    }

    .form-control {
      padding: 12px;
      border: 2px solid #e1e1e1;
      border-radius: 6px;
      font-size: 16px;
      transition: border-color 0.3s;
    }

    .form-control:focus {
      outline: none;
      border-color: #4CAF50;
    }

    .form-control.error {
      border-color: #f44336;
    }

    .form-hint {
      color: #888;
      font-size: 12px;
      margin-top: 4px;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn-primary {
      background-color: #4CAF50;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #45a049;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error-message {
      color: #f44336;
      font-size: 14px;
      margin-top: 5px;
    }

    .auth-link {
      text-align: center;
      margin-top: 20px;
      color: #666;
    }

    .auth-link a {
      color: #4CAF50;
      text-decoration: none;
      font-weight: 500;
    }

    .auth-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  userData: RegisterRequest = {
    name: '',
    email: '',
    password: '',
    role: 'client'
  };
  
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.userData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}