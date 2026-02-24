import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PublicacionService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) { }
  //PÚBLICO
  getRecientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/publicaciones/recientes`);
  }

  getMasVistos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/publicaciones/vistos`);
  }

  getPublicaciones(tipo: 'noticia' | 'reportaje'): Observable<any[]> {
    let params = new HttpParams().set('tipo', tipo);
    return this.http.get<any[]>(`${this.apiUrl}/publicaciones`, { params });
  }

  getPublicacionPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/publicaciones/${id}`);
  }

  incrementarVisualizacion(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/vista/publicaciones/${id}`, {});
  }

  //ADMIN
  crearPublicacion(payload: any) {
    return this.http.post(
      `${this.apiUrl}/publicaciones`,
      payload,
      { withCredentials: true }
    );
  }

  editarPublicacion(payload: any, id: number) {
    return this.http.put(
      `${this.apiUrl}/publicaciones/${id}`,
      payload,
      { withCredentials: true }
    );
  }

  listarAdmin(tipo: 'noticia' | 'reportaje'): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/admin/publicaciones`,
      {
        params: { tipo },
        withCredentials: true
      }
    );
  }

  listarAdminPublicacionId(id: number): Observable<any> {
    return this.http.get<any[]>(
      `${this.apiUrl}/admin/publicaciones/${id}`,
      { withCredentials: true }
    );
  }

  eliminar(id: number) {
    return this.http.delete(
      `${this.apiUrl}/publicaciones/${id}`,
      { withCredentials: true }
    );
  }

  cambiarEstado(id: number, estado: number) {
    return this.http.patch(
      `${this.apiUrl}/publicaciones/${id}`,
      { estado },
      { withCredentials: true }
    );
  }

  intercambiarDimensiones(id: number) {
    return this.http.patch(
      `${this.apiUrl}/bloques/${id}`,
      {},
      { withCredentials: true }
    );
  }
}
