import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  idusuario: number;
  nombres: string;
  apellidos: string;
  username: string;
  rol: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/api/usuarios`, {
      withCredentials: true, // clave: envia la cookie HttpOnly
    });
  }

  createUsuario(usuario: any) {
    return this.http.post(`${this.apiUrl}/api/usuarios`, usuario, {
      withCredentials: true,
    });
  }

  updateUsuario(id: number, usuario: any) {
    return this.http.put(`${this.apiUrl}/api/usuarios/${id}`, usuario, {
      withCredentials: true,
    });
  }

  deleteUsuario(id: number) {
    return this.http.delete(`${this.apiUrl}/api/usuarios/${id}`, {
      withCredentials: true,
    });
  }
}
