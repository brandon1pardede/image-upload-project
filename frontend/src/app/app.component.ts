import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { ImageListComponent } from './components/image-list/image-list.component';
import type { Image } from './services/image.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    ImageUploadComponent,
    ImageListComponent,
  ],
  template: `
    <div class="app-container">
      <!-- Modern Navbar -->
      <nav class="navbar">
        <div class="navbar-content">
          <div class="logo">
            <mat-icon>photo_library</mat-icon>
            <span>Image Gallery</span>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="main-content">
        <div class="content-wrapper">
          <div class="content-container">
            <!-- Upload Section -->
            <section class="section">
              <h2 class="section-title">Upload Images</h2>
              <app-image-upload
                (uploaded)="onImageUploaded($event)"
              ></app-image-upload>
            </section>

            <!-- Gallery Section -->
            <section class="section">
              <h2 class="section-title">Image Gallery</h2>
              <app-image-list #imageList></app-image-list>
            </section>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

      :host {
        /* Updated color scheme */
        --primary-color: #000000;
        --primary-hover: #333333;
        --border-color: #e5e7eb;
        --text-primary: #111111;
        --text-secondary: #666666;
        --bg-primary: #ffffff;
        --bg-secondary: #fafafa;
        --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06);

        /* Font settings */
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
          Roboto, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';

        display: block;
        height: 100vh;
      }

      .app-container {
        min-height: 100%;
        background-color: var(--bg-secondary);
        letter-spacing: -0.011em;
      }

      .navbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 64px;
        background-color: var(--bg-primary);
        border-bottom: 1px solid var(--border-color);
        z-index: 1000;
      }

      .navbar-content {
        max-width: 1200px;
        margin: 0 auto;
        height: 100%;
        padding: 0 1.5rem;
        display: flex;
        align-items: center;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: var(--primary-color);
        font-size: 1.25rem;
        font-weight: 600;
      }

      .logo mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .main-content {
        padding-top: 64px;
        min-height: calc(100vh - 64px);
      }

      .content-wrapper {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1.5rem;
      }

      .content-container {
        background-color: var(--bg-primary);
        border-radius: 12px;
        box-shadow: var(--shadow-sm);
        overflow: hidden;
      }

      .section {
        padding: 2rem;
      }

      .section:not(:last-child) {
        border-bottom: 1px solid var(--border-color);
      }

      .section-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 1.5rem 0;
        letter-spacing: -0.02em;
      }

      .upload-component {
        display: block;
        max-width: 800px;
        margin: 0 auto;
      }

      @media (max-width: 640px) {
        .content-wrapper {
          padding: 1rem;
        }

        .section {
          padding: 1.5rem;
        }

        .section-title {
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }
      }

      /* Improve button and interactive elements */
      ::ng-deep {
        .mat-mdc-button,
        .mat-mdc-raised-button {
          font-family: 'Inter', sans-serif !important;
          letter-spacing: -0.011em !important;
          font-weight: 500 !important;
        }
      }
    `,
  ],
})
export class AppComponent {
  @ViewChild('imageList') imageList!: ImageListComponent;

  onImageUploaded(image: Image) {
    this.imageList.addNewImage(image);
  }
}
