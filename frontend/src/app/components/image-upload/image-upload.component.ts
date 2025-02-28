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
      >
        <mat-icon>cloud_upload</mat-icon>
        <p>Drag and drop an image here or</p>
        <button
          mat-raised-button
          color="primary"
          type="button"
          (click)="openFileInput()"
        >
          Choose File
        </button>
        <input
          #fileInput
          type="file"
          [accept]="acceptedFileTypes"
          (change)="onFileSelected($event)"
          style="display: none"
        />
      </div>

      <mat-progress-bar
        *ngIf="uploading"
        mode="indeterminate"
        class="upload-progress"
      ></mat-progress-bar>
    </div>
  `,
  styles: [
    `
      .upload-container {
        padding: 20px;
      }
      .upload-area {
        border: 2px dashed #ccc;
        border-radius: 4px;
        padding: 40px;
        text-align: center;
        transition: all 0.3s ease;

        &:hover {
          border-color: #2196f3;
          background-color: rgba(33, 150, 243, 0.05);
        }
      }
      .upload-area.dragover {
        border-color: #2196f3;
        background-color: rgba(33, 150, 243, 0.1);
      }
      .upload-area mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #666;
        margin-bottom: 16px;
      }
      .upload-area p {
        margin: 16px 0;
        color: #666;
      }
      .upload-progress {
        margin-top: 20px;
      }
      button[mat-raised-button] {
        margin-top: 16px;
      }
    `,
  ],
})
export class ImageUploadComponent {
  @Output() uploaded = new EventEmitter<void>();
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
    if (!file.type.startsWith('image/')) {
      this.showError('Please select an image file');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.showError('File size should not exceed 5MB');
      return;
    }

    this.uploading = true;
    this.imageService.uploadImage(file).subscribe({
      next: () => {
        this.uploading = false;
        this.showSuccess('Image uploaded successfully');
        this.uploaded.emit();
      },
      error: (error) => {
        this.uploading = false;
        this.showError('Failed to upload image');
        console.error('Error uploading image:', error);
      },
    });
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
