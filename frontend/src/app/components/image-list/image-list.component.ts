import { Component, OnInit } from '@angular/core';
import { NgFor, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageService, Image } from '../../services/image.service';

@Component({
  selector: 'app-image-list',
  standalone: true,
  imports: [NgFor, DatePipe, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="container">
      <h2>Uploaded Images</h2>
      <div class="image-grid">
        <mat-card *ngFor="let image of images" class="image-card">
          <img
            [src]="getImageUrl(image._id)"
            alt="{{ image.filename }}"
            mat-card-image
          />
          <mat-card-content>
            <p>{{ image.filename }}</p>
            <p>Size: {{ formatFileSize(image.metadata.size) }}</p>
            <p>Uploaded: {{ image.uploadDate | date }}</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" (click)="downloadImage(image)">
              <mat-icon>download</mat-icon> Download
            </button>
            <button mat-button color="warn" (click)="deleteImage(image)">
              <mat-icon>delete</mat-icon> Delete
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 20px;
      }
      .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        padding: 20px;
      }
      .image-card {
        max-width: 100%;
      }
      .image-card img {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }
      mat-card-actions {
        display: flex;
        justify-content: space-between;
        padding: 8px;
      }
    `,
  ],
})
export class ImageListComponent implements OnInit {
  images: Image[] = [];

  constructor(
    private imageService: ImageService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadImages();
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
    return `${this.imageService['apiUrl']}/${id}`;
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
    if (confirm(`Are you sure you want to delete ${image.filename}?`)) {
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
}
