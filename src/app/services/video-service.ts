import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) { }

  uploadVideo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('video_file', file);

    return this.http.post(this.apiUrl+"/videos", formData, {
      withCredentials: true // Crucial para enviar las HttpOnly Cookies
    });
  }
}
