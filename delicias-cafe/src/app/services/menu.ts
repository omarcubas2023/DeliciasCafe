import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class MenuService {

  private apiUrl = '/api';

  // HttpClient es el que hace las llamadas HTTP al backend
  constructor(private http: HttpClient) {}

  // Obtiene TODOS los productos de la base de datos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos`);
  }

  // Obtiene productos filtrando por categoría
  getProductosPorCategoria(categoria: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos?categoria=${categoria}`);
  }
}