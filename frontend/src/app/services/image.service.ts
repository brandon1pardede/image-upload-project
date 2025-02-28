import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Image {
  _id: string;
  filename: string;
  contentType: string;
  uploadDate: string;
  metadata: {
    size: number;
    uploadedBy?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private apiUrl = `${environment.apiUrl}/api/images`;
  private headers = new HttpHeaders().set('Accept', 'application/json');

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<Image> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<Image>(`${this.apiUrl}/upload`, formData);
  }

  getImages(): Observable<Image[]> {
    return this.http.get<Image[]>(this.apiUrl, { headers: this.headers });
  }

  getImage(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}`, { responseType: 'blob' });
  }

  deleteImage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
