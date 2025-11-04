import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { User } from './models/ecommerce.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a routerLink="/" class="nav-brand">Buy-01</a>
        
        <div class="nav-links">
          <a routerLink="/" class="nav-link">Home</a>
          <a routerLink="/products" class="nav-link">Products</a>
          
          <div *ngIf="currentUser$ | async as user; else authLinks" class="user-menu">
            <span class="welcome">Hello, {{ user.name }}</span>
            <a *ngIf="user.role === 'seller'" routerLink="/seller/dashboard" class="nav-link">Dashboard</a>
            <button (click)="logout()" class="btn btn-logout">Logout</button>
          </div>
          
          <ng-template #authLinks>
            <a routerLink="/login" class="nav-link">Sign In</a>
            <a routerLink="/register" class="btn btn-primary">Sign Up</a>
          </ng-template>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <router-outlet></router-outlet>
    </main>

    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 Buy-01 Marketplace. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .navbar {
      background-color: #fff;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 70px;
    }

    .nav-brand {
      font-size: 1.8rem;
      font-weight: 700;
      color: #4CAF50;
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .nav-link {
      color: #333;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s;
    }

    .nav-link:hover {
      color: #4CAF50;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .welcome {
      color: #666;
      font-weight: 500;
    }

    .btn {
      padding: 8px 16px;
      border-radius: 20px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
      border: none;
      cursor: pointer;
    }

    .btn-primary {
      background-color: #4CAF50;
      color: white;
    }

    .btn-primary:hover {
      background-color: #45a049;
    }

    .btn-logout {
      background-color: #f44336;
      color: white;
      font-size: 14px;
    }

    .btn-logout:hover {
      background-color: #da190b;
    }

    .main-content {
      min-height: calc(100vh - 140px);
    }

    .footer {
      background-color: #333;
      color: white;
      padding: 20px 0;
      text-align: center;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    @media (max-width: 768px) {
      .nav-container {
        flex-direction: column;
        height: auto;
        padding: 15px 20px;
      }

      .nav-links {
        margin-top: 15px;
        flex-wrap: wrap;
        justify-content: center;
      }

      .user-menu {
        flex-direction: column;
        gap: 10px;
      }
    }
  `]
})
export class App {
  protected readonly title = signal('buy-01');
  currentUser$;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
      },
      error: (error) => {
        console.error('Logout failed:', error);
      }
    });
  }
}
