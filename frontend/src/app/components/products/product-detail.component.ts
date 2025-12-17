import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Media, Product } from '../../models/ecommerce.model';
import { MediaService } from '../../services/media.service';
import { ProductService } from '../../services/product.service';
import { ImageSliderComponent } from '../shared/image-slider/image-slider.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ImageSliderComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  productMedia: Media[] = [];
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private mediaService: MediaService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    } else {
      this.error = 'Product not found';
      this.loading = false;
    }
  }

  loadProduct(productId: string): void {
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
        this.loadProductMedia(productId);
      },
      error: () => {
        this.error = 'Failed to load product';
        this.loading = false;
      },
    });
  }

  loadProductMedia(productId: string): void {
    this.mediaService.getMediaByProduct(productId).subscribe({
      next: (media) => {
        this.productMedia = media;
      },
      error: () => {
        // Silently fail - product can exist without images
      },
    });
  }

  getProductImageUrls(): string[] {
    return this.productMedia.map((m) => this.mediaService.getMediaFile(m.id!));
  }

  addToCart(): void {
    alert('Shopping cart functionality is coming soon!');
  }
}

