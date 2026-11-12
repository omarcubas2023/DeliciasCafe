import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PedidoService {

  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  // Envía el pedido al backend para guardarlo en MySQL
  realizarPedido(pedido: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pedidos`, pedido);
  }

  // Obtiene el historial de pedidos de un usuario
  getPedidosUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pedidos/usuario/${usuarioId}`);
  }
}