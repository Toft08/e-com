import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { MediaService } from '../../services/media.service';
import { Product, Media, User } from '../../models/ecommerce.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1>Welcome to Buy-01 Marketplace</h1>
          <p class="hero-subtitle">Discover amazing products from sellers around the world</p>
          
          <div *ngIf="!isLoggedIn()" class="hero-actions">
            <a routerLink="/register" class="btn btn-primary">Join as Seller</a>
            <a routerLink="/login" class="btn btn-secondary">Sign In</a>
          </div>

          <div *ngIf="isLoggedIn() && currentUser" class="welcome-back">
            <h2>Welcome back, {{ currentUser.name }}!</h2>
            <div class="user-actions">
              <a *ngIf="isSeller()" routerLink="/seller/dashboard" class="btn btn-primary">
                Manage Products
              </a>
              <a routerLink="/products" class="btn btn-secondary">Browse Products</a>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Products -->
      <section class="featured-products">
        <h2>Featured Products</h2>
        <div *ngIf="isLoading" class="loading">Loading products...</div>
        
        <div *ngIf="!isLoading" class="products-grid">
          <div *ngFor="let product of featuredProducts" class="product-card">
            <div class="product-image">
              <img 
                *ngIf="getProductImage(product.id!)" 
                [src]="getProductImage(product.id!)" 
                [alt]="product.name"
                class="product-img"
              />
              <div *ngIf="!getProductImage(product.id!)" class="no-image">
                No Image
              </div>
            </div>
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="product-description">{{ product.description }}</p>
              <div class="product-details">
                <span class="price">\${{ product.price }}</span>
                <span class="quality">Quality: {{ product.quality }}%</span>
              </div>
              <p class="seller">Sold by: {{ product.user }}</p>
            </div>
          </div>
        </div>

        <div *ngIf="featuredProducts.length === 0 && !isLoading" class="no-products">
          <p>No products available yet. Be the first to <a routerLink="/register">sell something</a>!</p>
        </div>

        <div class="view-all">
          <a routerLink="/products" class="btn btn-outline">View All Products</a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
    }

    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 80px 20px;
      text-align: center;
    }

    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .hero h1 {
      font-size: 3.5rem;
      margin-bottom: 20px;
      font-weight: 700;
    }

    .hero-subtitle {
      font-size: 1.3rem;
      margin-bottom: 40px;
      opacity: 0.9;
    }

    .hero-actions {
      display: flex;
      gap: 20px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .welcome-back {
      margin-top: 20px;
    }

    .welcome-back h2 {
      font-size: 2rem;
      margin-bottom: 20px;
    }

    .user-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 12px 30px;
      border-radius: 25px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
      border: 2px solid transparent;
      display: inline-block;
    }

    .btn-primary {
      background-color: #4CAF50;
      color: white;
    }

    .btn-primary:hover {
      background-color: #45a049;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background-color: transparent;
      color: white;
      border-color: white;
    }

    .btn-secondary:hover {
      background-color: white;
      color: #667eea;
    }

    .btn-outline {
      background-color: transparent;
      color: #667eea;
      border-color: #667eea;
    }

    .btn-outline:hover {
      background-color: #667eea;
      color: white;
    }

    .featured-products {
      padding: 80px 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .featured-products h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 50px;
      color: #333;
    }

    .loading {
      text-align: center;
      padding: 40px;
      font-size: 1.2rem;
      color: #666;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      margin-bottom: 50px;
    }

    .product-card {
      background: white;
      border-radius: 15px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    .product-image {
      height: 200px;
      background-color: #f5f5f5;
      position: relative;
      overflow: hidden;
    }

    .product-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .no-image {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #999;
      font-size: 1.1rem;
    }

    .product-info {
      padding: 20px;
    }

    .product-info h3 {
      font-size: 1.3rem;
      margin-bottom: 10px;
      color: #333;
    }

    .product-description {
      color: #666;
      margin-bottom: 15px;
      line-height: 1.4;
    }

    .product-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .price {
      font-size: 1.5rem;
      font-weight: 700;
      color: #4CAF50;
    }

    .quality {
      background-color: #e3f2fd;
      color: #1976d2;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.9rem;
    }

    .seller {
      color: #888;
      font-size: 0.9rem;
      margin: 0;
    }

    .no-products {
      text-align: center;
      padding: 60px 20px;
      color: #666;
      font-size: 1.1rem;
    }

    .no-products a {
      color: #4CAF50;
      text-decoration: none;
      font-weight: 600;
    }

    .view-all {
      text-align: center;
      margin-top: 30px;
    }

    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2.5rem;
      }

      .hero-subtitle {
        font-size: 1.1rem;
      }

      .hero-actions {
        flex-direction: column;
        align-items: center;
      }

      .products-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  productImages: { [productId: string]: string } = {};
  isLoading = true;
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private mediaService: MediaService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadFeaturedProducts();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isSeller(): boolean {
    return this.authService.isSeller();
  }

  private loadFeaturedProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.featuredProducts = products.slice(0, 6); // Show first 6 products
        this.loadProductImages();
      },
      error: (error) => {
        console.error('Failed to load products:', error);
        this.isLoading = false;
      }
    });
  }

  private loadProductImages(): void {
    const imagePromises = this.featuredProducts.map(product => {
      if (!product.id) return Promise.resolve();
      
      return this.mediaService.getMediaByProduct(product.id).toPromise()
        .then(media => {
          if (media && media.length > 0) {
            this.productImages[product.id!] = this.mediaService.getMediaFile(media[0].id!);
          }
        })
        .catch(error => {
          console.error(`Failed to load media for product ${product.id}:`, error);
        });
    });

    Promise.all(imagePromises).finally(() => {
      this.isLoading = false;
    });
  }

  getProductImage(productId: string): string | null {
    return this.productImages[productId] || null;
  }
}