import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgIf } from '@angular/common';
import { ImageService } from '../../services/image.service';
import type { Image } from '../../services/image.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatProgressBarModule, NgIf],
  template: `
    <div class="upload-container">
      <div
        class="upload-area"
        [class.dragover]="isDragOver"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        (click)="openFileInput()"
      >
        <div class="upload-content">
          <div class="upload-icon">
            <mat-icon>cloud_upload</mat-icon>
          </div>
          <div class="upload-text">
            <h3>Upload your images</h3>
            <p>Drag and drop your images here or click anywhere to browse</p>
            <span class="file-info">Supports: JPG, PNG, GIF (max 5MB)</span>
          </div>
          <button
            mat-raised-button
            class="upload-button"
            type="button"
            (click)="openFileInput(); $event.stopPropagation()"
          >
            Choose Files
          </button>
          <input
            #fileInput
            type="file"
            [accept]="acceptedFileTypes"
            (change)="onFileSelected($event)"
            style="display: none"
          />
        </div>
      </div>

      <div class="progress-container" *ngIf="uploading">
        <mat-progress-bar
          mode="indeterminate"
          class="upload-progress"
        ></mat-progress-bar>
        <span class="progress-text">Uploading...</span>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        --primary-color: #000000;
        --primary-hover: #333333;
        --border-color: #e5e7eb;
        --text-primary: #111111;
        --text-secondary: #666666;
        --bg-hover: #fafafa;
        --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06);
        display: block;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
          Roboto, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .upload-container {
        width: 100%;
      }

      .upload-area {
        position: relative;
        border: 2px dashed var(--border-color);
        border-radius: 12px;
        background: white;
        transition: all 0.2s ease;
        cursor: pointer;
        overflow: hidden;
        user-select: none;
      }

      .upload-area:hover {
        border-color: var(--primary-color);
        background: var(--bg-hover);
      }

      .upload-area.dragover {
        border-color: var(--primary-color);
        background: var(--bg-hover);
        box-shadow: var(--shadow-md);
      }

      .upload-content {
        padding: 2.5rem 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }

      .upload-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: var(--bg-hover);
        margin-bottom: 1rem;
        transition: transform 0.2s ease;
      }

      .upload-area:hover .upload-icon {
        transform: scale(1.05);
      }

      .upload-icon mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: var(--primary-color);
      }

      .upload-text {
        text-align: center;
      }

      .upload-text h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 0.5rem 0;
        letter-spacing: -0.02em;
      }

      .upload-text p {
        color: var(--text-secondary);
        margin: 0;
        font-size: 0.875rem;
        letter-spacing: -0.011em;
      }

      .file-info {
        display: block;
        font-size: 0.75rem;
        color: var(--text-secondary);
        margin-top: 0.5rem;
        letter-spacing: -0.011em;
      }

      .upload-button {
        background-color: var(--primary-color) !important;
        color: white !important;
        padding: 0 1.5rem !important;
        height: 40px !important;
        font-weight: 500 !important;
        border-radius: 6px !important;
        margin-top: 1rem !important;
        transition: background-color 0.2s ease !important;
        font-family: inherit !important;
        letter-spacing: -0.011em !important;
        z-index: 1;
      }

      .upload-button:hover {
        background-color: var(--primary-hover) !important;
      }

      .progress-container {
        margin-top: 1rem;
      }

      .upload-progress {
        height: 6px !important;
        border-radius: 3px;
      }

      .progress-text {
        display: block;
        text-align: center;
        color: var(--text-secondary);
        font-size: 0.875rem;
        margin-top: 0.5rem;
        letter-spacing: -0.011em;
      }

      ::ng-deep .mat-mdc-progress-bar {
        --mdc-linear-progress-active-indicator-color: var(--primary-color);
      }
    `,
  ],
})
export class ImageUploadComponent {
  @Output() uploaded = new EventEmitter<Image>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  isDragOver = false;
  uploading = false;
  acceptedFileTypes = 'image/*';

  constructor(
    private imageService: ImageService,
    private snackBar: MatSnackBar
  ) {}

  openFileInput(): void {
    // Ensure the element exists and is properly initialized
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.click();
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.uploadFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadFile(input.files[0]);
      // Reset the input value so the same file can be uploaded again if needed
      input.value = '';
    }
  }

  private uploadFile(file: File): void {
    if (!this.validateFile(file)) {
      return;
    }

    this.uploading = true;

    // Create an optimistic image object
    const optimisticImage: Image = {
      _id: 'temp_' + Date.now(), // Temporary ID
      filename: file.name,
      contentType: file.type,
      uploadDate: new Date().toISOString(),
      metadata: {
        size: file.size,
      },
    };

    // Emit the optimistic image immediately
    this.uploaded.emit(optimisticImage);

    // Create object URL for immediate display
    const objectUrl = URL.createObjectURL(file);

    this.imageService.uploadImage(file).subscribe({
      next: (actualImage) => {
        this.uploading = false;
        this.showSuccess('Image uploaded successfully');
        // Update the image with actual data
        this.uploaded.emit(actualImage);
        // Clean up object URL
        URL.revokeObjectURL(objectUrl);
      },
      error: (error) => {
        this.uploading = false;
        this.showError('Failed to upload image');
        console.error('Error uploading image:', error);
        // Could emit a failure event here if needed
      },
    });
  }

  private validateFile(file: File): boolean {
    if (!file.type.startsWith('image/')) {
      this.showError('Please select an image file');
      return false;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.showError('File size should not exceed 5MB');
      return false;
    }

    return true;
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
