import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { NgFor, NgIf, DatePipe, NgStyle } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageService } from '../../services/image.service';
import type { Image } from '../../services/image.service';
import { ImagePreviewModalComponent } from '../image-preview-modal/image-preview-modal.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-image-list',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgStyle,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ImagePreviewModalComponent,
    ConfirmationModalComponent,
  ],
  template: `
    <div class="image-grid">
      <div *ngFor="let image of images; let i = index" class="image-card">
        <div class="image-container">
          <div class="image-placeholder" [style.backgroundColor]="'#f0f0f0'">
            <div class="loading-shimmer"></div>
          </div>
          <img
            #lazyImage
            [attr.data-src]="getImageUrl(image._id)"
            [attr.data-thumb]="getImageThumbnailUrl(image._id)"
            [alt]="image.filename"
            class="image"
            [class.loaded]="isImageLoaded(image._id)"
            (load)="onImageLoad(image._id)"
          />
          <div class="image-overlay">
            <div class="action-buttons">
              <button
                class="action-button preview"
                (click)="openPreview(i)"
                title="Preview"
              >
                <mat-icon>visibility</mat-icon>
              </button>
              <button
                class="action-button download"
                (click)="downloadImage(image)"
                title="Download"
              >
                <mat-icon>download</mat-icon>
              </button>
              <button
                class="action-button delete"
                (click)="confirmDelete(image)"
                title="Delete"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
        </div>
        <div class="image-info">
          <h3 class="filename">{{ image.filename }}</h3>
          <div class="details">
            <span class="detail">
              <mat-icon class="detail-icon">straighten</mat-icon>
              {{ formatFileSize(image.metadata.size) }}
            </span>
            <span class="detail">
              <mat-icon class="detail-icon">schedule</mat-icon>
              {{ image.uploadDate | date : 'MMM d, y' }}
            </span>
          </div>
        </div>
      </div>

      <div *ngIf="images.length === 0" class="empty-state">
        <div class="empty-state-content">
          <div class="empty-icon-container">
            <mat-icon class="empty-icon">photo_library</mat-icon>
            <mat-icon class="empty-icon-overlay">add</mat-icon>
          </div>
          <h3 class="empty-title">No images yet</h3>
          <p class="empty-description">
            Upload your first image by dragging and dropping files above or
            using the upload button
          </p>
        </div>
      </div>
    </div>

    <app-image-preview-modal
      [isOpen]="isPreviewOpen"
      [images]="previewImages"
      [currentIndex]="currentPreviewIndex"
      (close)="closePreview()"
      (indexChange)="currentPreviewIndex = $event"
    ></app-image-preview-modal>

    <app-confirmation-modal
      [isOpen]="isDeleteModalOpen"
      [title]="'Delete Image'"
      [message]="
        'Are you sure you want to delete ' +
        (imageToDelete?.filename || 'this image') +
        '?'
      "
      (confirm)="onDeleteConfirmed()"
      (cancel)="closeDeleteModal()"
    ></app-confirmation-modal>
  `,
  styles: [
    `
      :host {
        --card-bg: #ffffff;
        --card-hover: #fafafa;
        --overlay-bg: rgba(0, 0, 0, 0.6);
        --text-primary: #111111;
        --text-secondary: #666666;
        --primary-color: #000000;
        --primary-hover: #333333;
        --danger: #dc2626;
        --danger-hover: #b91c1c;
        display: block;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
          Roboto, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
      }

      .image-card {
        background: var(--card-bg);
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .image-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }

      .image-container {
        position: relative;
        padding-top: 75%;
        overflow: hidden;
        cursor: pointer;
        background: #f0f0f0;
      }

      .image-placeholder {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        filter: blur(10px);
        transform: scale(1.1);
        transition: opacity 0.3s ease;
      }

      .loading-shimmer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.2) 50%,
          rgba(255, 255, 255, 0) 100%
        );
        animation: shimmer 1.5s infinite;
      }

      @keyframes shimmer {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }

      .image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease, opacity 0.3s ease;
        opacity: 0;
      }

      .image.loaded {
        opacity: 1;
      }

      .image-card:hover .image {
        transform: scale(1.05);
      }

      .image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--overlay-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      .image-card:hover .image-overlay {
        opacity: 1;
      }

      .action-buttons {
        display: flex;
        gap: 12px;
      }

      .action-button {
        background: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        color: var(--text-primary);
      }

      .action-button:hover {
        transform: scale(1.1);
      }

      .action-button.preview:hover {
        background: var(--primary-color);
        color: white;
      }

      .action-button.download:hover {
        background: var(--primary-color);
        color: white;
      }

      .action-button.delete:hover {
        background: var(--danger);
        color: white;
      }

      .image-info {
        padding: 1rem;
      }

      .filename {
        margin: 0;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        letter-spacing: -0.011em;
      }

      .details {
        display: flex;
        gap: 1rem;
        margin-top: 0.5rem;
      }

      .detail {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        color: var(--text-secondary);
        font-size: 0.75rem;
        letter-spacing: -0.011em;
      }

      .detail-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .empty-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: 4rem 1rem;
        color: var(--text-secondary);
        background: var(--card-bg);
        border: 2px dashed var(--border-color);
        border-radius: 12px;
        transition: all 0.2s ease;
      }

      .empty-state-content {
        max-width: 400px;
        margin: 0 auto;
      }

      .empty-icon-container {
        position: relative;
        display: inline-block;
        margin-bottom: 1.5rem;
      }

      .empty-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: var(--text-secondary);
        opacity: 0.5;
      }

      .empty-icon-overlay {
        position: absolute;
        bottom: -6px;
        right: -6px;
        font-size: 24px;
        width: 24px;
        height: 24px;
        background: var(--card-bg);
        border-radius: 50%;
        color: var(--text-secondary);
        opacity: 0.8;
      }

      .empty-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 0.75rem;
        letter-spacing: -0.02em;
      }

      .empty-description {
        font-size: 0.875rem;
        line-height: 1.5;
        color: var(--text-secondary);
        margin: 0;
        letter-spacing: -0.011em;
      }

      @media (max-width: 640px) {
        .image-grid {
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1rem;
        }

        .action-buttons {
          gap: 8px;
        }

        .action-button {
          width: 36px;
          height: 36px;
        }

        .empty-state {
          padding: 3rem 1rem;
        }

        .empty-icon {
          font-size: 48px;
          width: 48px;
          height: 48px;
        }

        .empty-icon-overlay {
          font-size: 20px;
          width: 20px;
          height: 20px;
          bottom: -4px;
          right: -4px;
        }

        .empty-title {
          font-size: 1.125rem;
        }
      }
    `,
  ],
})
export class ImageListComponent implements OnInit, AfterViewInit {
  @ViewChildren('lazyImage') lazyImages!: QueryList<ElementRef>;

  images: Image[] = [];
  loadedImages: { [key: string]: boolean } = {};
  private observer: IntersectionObserver | null = null;
  isPreviewOpen = false;
  currentPreviewIndex = 0;
  isDeleteModalOpen = false;
  imageToDelete: Image | null = null;

  constructor(
    private imageService: ImageService,
    private snackBar: MatSnackBar
  ) {
    // Move observer setup to ngOnInit to ensure browser environment
  }

  ngOnInit(): void {
    this.loadImages();
    if (typeof window !== 'undefined') {
      this.setupIntersectionObserver();
    }
  }

  ngAfterViewInit() {
    this.observeImages();
    this.lazyImages.changes.subscribe(() => {
      this.observeImages();
    });
  }

  private setupIntersectionObserver() {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      // Fallback for environments without IntersectionObserver
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const thumbUrl = img.getAttribute('data-thumb');
            const fullUrl = img.getAttribute('data-src');

            if (thumbUrl && fullUrl) {
              // Load thumbnail first
              img.src = thumbUrl;

              // Then preload the full image
              const fullImage = new Image();
              fullImage.onload = () => {
                img.src = fullUrl;
              };
              fullImage.src = fullUrl;
            }

            this.observer?.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.1,
      }
    );
  }

  private observeImages() {
    if (this.observer) {
      this.lazyImages.forEach((imageRef) => {
        this.observer?.observe(imageRef.nativeElement);
      });
    }
  }

  onImageLoad(imageId: string) {
    this.loadedImages[imageId] = true;
  }

  isImageLoaded(imageId: string): boolean {
    return this.loadedImages[imageId] || false;
  }

  getImageThumbnailUrl(id: string): string {
    return this.imageService.getImageThumbnailUrl(id);
  }

  loadImages(): void {
    this.imageService.getImages().subscribe({
      next: (images) => {
        this.images = images;
      },
      error: (error) => {
        this.showError('Failed to load images');
        console.error('Error loading images:', error);
      },
    });
  }

  getImageUrl(id: string): string {
    return this.imageService.getImageUrl(id);
  }

  downloadImage(image: Image): void {
    this.imageService.getImage(image._id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = image.filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (error) => {
        this.showError('Failed to download image');
        console.error('Error downloading image:', error);
      },
    });
  }

  deleteImage(image: Image): void {
    this.imageService.deleteImage(image._id).subscribe({
      next: () => {
        this.images = this.images.filter((i) => i._id !== image._id);
        this.showSuccess('Image deleted successfully');
      },
      error: (error) => {
        this.showError('Failed to delete image');
        console.error('Error deleting image:', error);
      },
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  openPreview(index: number) {
    this.currentPreviewIndex = index;
    this.isPreviewOpen = true;
  }

  closePreview() {
    this.isPreviewOpen = false;
  }

  confirmDelete(image: Image) {
    this.imageToDelete = image;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.imageToDelete = null;
  }

  onDeleteConfirmed() {
    if (this.imageToDelete) {
      this.deleteImage(this.imageToDelete);
      this.closeDeleteModal();
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  get previewImages() {
    return this.images.map((image) => ({
      url: this.getImageUrl(image._id),
      filename: image.filename,
      size: this.formatFileSize(image.metadata.size),
      date: new Date(image.uploadDate).toLocaleDateString(),
    }));
  }

  addNewImage(image: Image) {
    if (image._id.startsWith('temp_')) {
      // This is an optimistic update
      this.images = [image, ...this.images];
      this.loadedImages[image._id] = false;
    } else {
      // This is the actual update
      // Find and replace the temporary image if it exists
      const tempIndex = this.images.findIndex((img) =>
        img._id.startsWith('temp_')
      );
      if (tempIndex !== -1) {
        this.images[tempIndex] = image;
        delete this.loadedImages[this.images[tempIndex]._id];
      } else {
        // If no temporary image found, add the new image
        this.images = [image, ...this.images];
      }
      this.loadedImages[image._id] = false;
    }

    // Force change detection and start loading images
    setTimeout(() => {
      const preloadImage = new Image();
      const thumbPreloadImage = new Image();

      thumbPreloadImage.src = this.getImageThumbnailUrl(image._id);
      preloadImage.src = this.getImageUrl(image._id);

      thumbPreloadImage.onload = () => {
        this.loadedImages[image._id] = true;
      };
    });
  }
}
