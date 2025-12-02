import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-slider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="image-slider" [class.has-multiple]="images.length > 1">
      <!-- Main Image -->
      <div class="slider-container">
        <img
          *ngIf="images.length > 0"
          [src]="images[currentIndex]"
          [alt]="alt + ' ' + (currentIndex + 1)"
          class="slider-image"
        />
        <div *ngIf="images.length === 0" class="no-image">
          <span class="no-image-icon">📷</span>
          <span>No images</span>
        </div>

        <!-- Navigation Arrows -->
        <button
          *ngIf="images.length > 1"
          class="nav-arrow nav-prev"
          (click)="prevImage($event)"
          [attr.aria-label]="'Previous image'"
        >
          ‹
        </button>
        <button
          *ngIf="images.length > 1"
          class="nav-arrow nav-next"
          (click)="nextImage($event)"
          [attr.aria-label]="'Next image'"
        >
          ›
        </button>
      </div>

      <!-- Dots Indicator -->
      <div *ngIf="images.length > 1 && showDots" class="slider-dots">
        <button
          *ngFor="let img of images; let i = index"
          class="dot"
          [class.active]="i === currentIndex"
          (click)="goToImage(i, $event)"
          [attr.aria-label]="'Go to image ' + (i + 1)"
        ></button>
      </div>

      <!-- Image Counter -->
      <div *ngIf="images.length > 1 && showCounter" class="image-counter">
        {{ currentIndex + 1 }} / {{ images.length }}
      </div>
    </div>
  `,
  styles: [
    `
      .image-slider {
        position: relative;
        width: 100%;
        height: 100%;
      }

      .slider-container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: inherit;
      }

      .slider-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .no-image {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #f5f5f5;
        color: #999;
        font-size: 0.875rem;
        gap: 0.5rem;
      }

      .no-image-icon {
        font-size: 2rem;
        opacity: 0.5;
      }

      /* Navigation Arrows */
      .nav-arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        cursor: pointer;
        font-size: 1.25rem;
        color: #333;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s, background 0.2s;
        z-index: 2;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }

      .image-slider:hover .nav-arrow,
      .image-slider.has-multiple:focus-within .nav-arrow {
        opacity: 1;
      }

      .nav-arrow:hover {
        background: white;
      }

      .nav-prev {
        left: 8px;
      }

      .nav-next {
        right: 8px;
      }

      /* Dots Indicator */
      .slider-dots {
        position: absolute;
        bottom: 8px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 6px;
        z-index: 2;
      }

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        border: none;
        cursor: pointer;
        padding: 0;
        transition: background 0.2s, transform 0.2s;
      }

      .dot:hover {
        background: rgba(255, 255, 255, 0.8);
      }

      .dot.active {
        background: white;
        transform: scale(1.2);
      }

      /* Image Counter */
      .image-counter {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(0, 0, 0, 0.6);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.75rem;
        z-index: 2;
      }
    `,
  ],
})
export class ImageSliderComponent {
  @Input() images: string[] = [];
  @Input() alt: string = 'Product image';
  @Input() showDots: boolean = true;
  @Input() showCounter: boolean = false;

  currentIndex = 0;

  nextImage(event: Event): void {
    event.stopPropagation();
    if (this.images.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }
  }

  prevImage(event: Event): void {
    event.stopPropagation();
    if (this.images.length > 0) {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    }
  }

  goToImage(index: number, event: Event): void {
    event.stopPropagation();
    this.currentIndex = index;
  }
}

