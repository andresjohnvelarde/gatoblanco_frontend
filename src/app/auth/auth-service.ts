import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/login`,
      { username, password },
      { withCredentials: true } // 🔥 IMPORTANTE
    ).pipe(
      tap((res: any) => {
        localStorage.setItem('user_name', res.data.username);
        localStorage.setItem('user_role', res.data.rol);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user_role');
  }

  logout() {
    localStorage.clear();
  }

  getRole(): string | null {
    return localStorage.getItem('user_role');
  }

  getUserName(): string | null {
    return localStorage.getItem('user_name');
  }
}
