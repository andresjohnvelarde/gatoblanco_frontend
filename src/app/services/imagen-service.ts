import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ImagenService {
  private apiUrl = `${environment.apiUrl}/api/imagenes`;

  constructor(private http: HttpClient) { }

  uploadImagen(file: File) {
    const formData = new FormData();
    formData.append('imagen', file);

    return this.http.post<{ url: string }>(
      `${this.apiUrl}`,
      formData,
      { withCredentials: true }
    );
  }

  deleteImagen(url: string) {
    return this.http.delete(
      `${this.apiUrl}`,
      {
        withCredentials: true,
        body: { url } // Se envía en el body según tu backend
      }
    );
  }
}
