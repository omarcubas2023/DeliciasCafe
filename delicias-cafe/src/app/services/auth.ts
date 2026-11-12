import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

  registro(nombre: string, email: string, password: string, rol: string = 'cliente'): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/registro`, { nombre, email, password, rol });
  }

  loginORegistrarGoogle(nombre: string, email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/google`, { nombre, email });
  }

  // Guarda el usuario y el token recibidos del backend
  guardarSesion(usuario: any, token?: string) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    if (token) {
      localStorage.setItem('token', token);
    }
  }

  getUsuario() {
    const u = localStorage.getItem('usuario');
    return u ? JSON.parse(u) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  estaLogueado(): boolean {
    return !!localStorage.getItem('usuario') && !!localStorage.getItem('token');
  }

  cerrarSesion() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  }
}