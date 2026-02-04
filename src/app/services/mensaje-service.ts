import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MensajeService {
  private apiUrl = `${environment.apiUrl}/api/mensajes`;

  constructor(private http: HttpClient) { }

  crearMensaje(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  getMensajes() {
    return this.http.get<any[]>(`${this.apiUrl}`, {
      withCredentials: true
    });
  }

  deleteMensaje(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      withCredentials: true,
    });
  }
}
