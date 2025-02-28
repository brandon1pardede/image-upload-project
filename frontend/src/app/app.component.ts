import { Component, ViewChild } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { ImageListComponent } from './components/image-list/image-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatToolbarModule, ImageUploadComponent, ImageListComponent],
  template: `
    <mat-toolbar color="primary">
      <span>Image Upload Application</span>
    </mat-toolbar>

    <div class="content">
      <app-image-upload (uploaded)="onImageUploaded()"></app-image-upload>
      <app-image-list #imageList></app-image-list>
    </div>
  `,
  styles: [
    `
      .content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      mat-toolbar {
        margin-bottom: 20px;
      }
    `,
  ],
})
export class AppComponent {
  @ViewChild('imageList') imageList!: ImageListComponent;

  onImageUploaded(): void {
    if (this.imageList) {
      this.imageList.loadImages();
    }
  }
}
