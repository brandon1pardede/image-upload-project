import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Image } from '../../services/image.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-image-preview-modal',
  standalone: true,
  imports: [NgIf, MatIconModule],
  template: `
    <div
      class="modal-overlay"
      [class.visible]="isOpen"
      (click)="closeModal()"
      [@fadeInOut]="isOpen"
    >
      <div class="modal-content" (click)="$event.stopPropagation()">
        <!-- Navigation Buttons -->
        <button
          *ngIf="hasPrevious"
          class="nav-button prev"
          (click)="navigate('prev')"
          [@fadeInOut]
        >
          <mat-icon>chevron_left</mat-icon>
        </button>
        <button
          *ngIf="hasNext"
          class="nav-button next"
          (click)="navigate('next')"
          [@fadeInOut]
        >
          <mat-icon>chevron_right</mat-icon>
        </button>

        <!-- Close Button -->
        <button class="close-button" (click)="closeModal()">
          <mat-icon>close</mat-icon>
        </button>

        <!-- Image Container -->
        <div class="image-container">
          <img
            *ngIf="currentImage"
            [src]="currentImage.url"
            [alt]="currentImage.filename"
            class="preview-image"
            [@fadeInOut]
          />
        </div>

        <!-- Image Info -->
        <div class="image-info" [@fadeInOut]>
          <div class="filename">{{ currentImage?.filename }}</div>
          <div class="metadata">
            <span>{{ currentImage?.size }}</span>
            <span class="dot">•</span>
            <span>{{ currentImage?.date }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        --modal-bg: rgba(0, 0, 0, 0.95);
        --text-light: rgba(255, 255, 255, 0.9);
        --text-dim: rgba(255, 255, 255, 0.6);
        --button-bg: rgba(255, 255, 255, 0.1);
        --button-hover: rgba(255, 255, 255, 0.2);
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
          Roboto, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--modal-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s ease, visibility 0.2s ease;
      }

      .modal-overlay.visible {
        opacity: 1;
        visibility: visible;
      }

      .modal-content {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .image-container {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .preview-image {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 4px;
      }

      .nav-button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: var(--button-bg);
        border: none;
        color: var(--text-light);
        width: 48px;
        height: 48px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        z-index: 2;
      }

      .nav-button:hover {
        background: var(--button-hover);
        transform: translateY(-50%) scale(1.1);
      }

      .nav-button.prev {
        left: 24px;
      }

      .nav-button.next {
        right: 24px;
      }

      .close-button {
        position: absolute;
        top: 24px;
        right: 24px;
        background: var(--button-bg);
        border: none;
        color: var(--text-light);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        z-index: 2;
      }

      .close-button:hover {
        background: var(--button-hover);
        transform: scale(1.1);
      }

      .image-info {
        position: absolute;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        color: var(--text-light);
        background: var(--button-bg);
        padding: 12px 24px;
        border-radius: 8px;
        backdrop-filter: blur(8px);
      }

      .filename {
        font-size: 0.875rem;
        font-weight: 500;
        margin-bottom: 4px;
        letter-spacing: -0.011em;
      }

      .metadata {
        font-size: 0.75rem;
        color: var(--text-dim);
        letter-spacing: -0.011em;
      }

      .dot {
        margin: 0 6px;
      }

      @media (max-width: 640px) {
        .nav-button {
          width: 40px;
          height: 40px;
        }

        .nav-button.prev {
          left: 16px;
        }

        .nav-button.next {
          right: 16px;
        }

        .close-button {
          top: 16px;
          right: 16px;
        }

        .image-info {
          bottom: 16px;
          padding: 8px 16px;
        }
      }
    `,
  ],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('200ms ease', style({ opacity: 0 }))]),
    ]),
  ],
})
export class ImagePreviewModalComponent {
  @Input() isOpen = false;
  @Input() images: {
    url: string;
    filename: string;
    size: string;
    date: string;
  }[] = [];
  @Input() currentIndex = 0;
  @Output() close = new EventEmitter<void>();
  @Output() indexChange = new EventEmitter<number>();

  get currentImage() {
    return this.images[this.currentIndex];
  }

  get hasPrevious() {
    return this.currentIndex > 0;
  }

  get hasNext() {
    return this.currentIndex < this.images.length - 1;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.isOpen) return;

    switch (event.key) {
      case 'ArrowLeft':
        this.navigate('prev');
        break;
      case 'ArrowRight':
        this.navigate('next');
        break;
      case 'Escape':
        this.closeModal();
        break;
    }
  }

  navigate(direction: 'prev' | 'next') {
    if (direction === 'prev' && this.hasPrevious) {
      this.currentIndex--;
      this.indexChange.emit(this.currentIndex);
    } else if (direction === 'next' && this.hasNext) {
      this.currentIndex++;
      this.indexChange.emit(this.currentIndex);
    }
  }

  closeModal() {
    this.close.emit();
  }
}
