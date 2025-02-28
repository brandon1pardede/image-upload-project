import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [NgIf, MatIconModule],
  template: `
    <div
      class="modal-overlay"
      [class.visible]="isOpen"
      (click)="onCancel()"
      [@fadeInOut]="isOpen"
    >
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <mat-icon class="warning-icon">warning</mat-icon>
          <h3>{{ title }}</h3>
        </div>

        <div class="modal-body">
          {{ message }}
        </div>

        <div class="modal-actions">
          <button class="btn-secondary" (click)="onCancel()">Cancel</button>
          <button class="btn-danger" (click)="onConfirm()">Delete</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        --modal-bg: rgba(0, 0, 0, 0.5);
        --danger: #dc2626;
        --danger-hover: #b91c1c;
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
        background: white;
        border-radius: 12px;
        padding: 24px;
        width: 90%;
        max-width: 400px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
          0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }

      .modal-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
      }

      .warning-icon {
        color: var(--danger);
        width: 28px;
        height: 28px;
        font-size: 28px;
      }

      h3 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: #111111;
        letter-spacing: -0.02em;
      }

      .modal-body {
        color: #666666;
        font-size: 0.875rem;
        line-height: 1.5;
        margin-bottom: 24px;
        letter-spacing: -0.011em;
      }

      .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }

      button {
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        letter-spacing: -0.011em;
        font-family: inherit;
      }

      .btn-secondary {
        background: #f3f4f6;
        border: 1px solid #e5e7eb;
        color: #111111;
      }

      .btn-secondary:hover {
        background: #e5e7eb;
      }

      .btn-danger {
        background: var(--danger);
        border: none;
        color: white;
      }

      .btn-danger:hover {
        background: var(--danger-hover);
      }

      @media (max-width: 640px) {
        .modal-content {
          padding: 20px;
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
export class ConfirmationModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirm Delete';
  @Input() message = 'Are you sure you want to delete this item?';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
