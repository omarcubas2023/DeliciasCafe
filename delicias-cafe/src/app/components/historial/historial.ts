import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './historial.html',
  styleUrl: './historial.css'
})
export class Historial implements OnInit {

  pedidos: any[] = [];
  pedidoExpandido: number | null = null;
  cargando: boolean = true;

  private apiUrl = '/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const usuario = this.authService.getUsuario();
    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarHistorial(usuario.id);
  }

  cargarHistorial(usuarioId: number) {
    this.http.get<any[]>(`${this.apiUrl}/pedidos/usuario/${usuarioId}/detalle-completo`)
      .subscribe({
        next: (data) => {
          this.pedidos = data;
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
  }

  toggleExpandir(pedidoId: number) {
    this.pedidoExpandido = this.pedidoExpandido === pedidoId ? null : pedidoId;
    this.cdr.detectChanges();
  }

  imprimirRecibo(pedido: any) {
    window.print();
  }

  iconoEstado(estado: string): string {
    switch (estado) {
      case 'pendiente': return '⏳';
      case 'pagado': return '💰';
      case 'en_cocina': return '🍳';
      case 'listo': return '✅';
      case 'entregado': return '🎉';
      case 'cancelado': return '❌';
      default: return '📋';
    }
  }

  iconoMetodo(metodo: string): string {
    switch (metodo) {
      case 'efectivo': return '💵';
      case 'tarjeta': return '💳';
      case 'yape': return '📱';
      case 'plin': return '📲';
      default: return '💰';
    }
  }
}