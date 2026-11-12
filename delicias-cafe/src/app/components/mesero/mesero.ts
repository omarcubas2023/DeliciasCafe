import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-mesero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mesero.html',
  styleUrl: './mesero.css'
})
export class Mesero implements OnInit {

  pedidos: any[] = [];
  mensaje: string = '';
  mensajeTipo: string = '';
  private apiUrl = '/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const usuario = this.authService.getUsuario();
    if (!usuario || usuario.rol !== 'mesero') {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.http.get<any[]>(`${this.apiUrl}/pedidos/todos`).subscribe({
      next: (data) => {
        this.pedidos = data.filter(p =>
          p.estado === 'pagado' || p.estado === 'en_cocina' || p.estado === 'listo');
        this.cdr.detectChanges();
      },
      error: () => {
        this.pedidos = [];
        this.cdr.detectChanges();
      }
    });
  }

  mandarACocina(pedido: any) {
    this.http.put(`${this.apiUrl}/pedidos/${pedido.id}/estado`,
      { estado: 'en_cocina' }).subscribe({
      next: () => {
        this.registrarLog(`Mandó el pedido #${pedido.id} a cocina`);
        this.mostrarMensaje(`Pedido #${pedido.id} enviado a cocina`, 'exito');
        pedido.estado = 'en_cocina';
        this.cdr.detectChanges();
      }
    });
  }

  marcarEntregado(pedido: any) {
    this.http.put(`${this.apiUrl}/pedidos/${pedido.id}/estado`,
      { estado: 'entregado' }).subscribe({
      next: () => {
        this.registrarLog(`Entregó el pedido #${pedido.id} al cliente`);
        this.mostrarMensaje(`Pedido #${pedido.id} entregado`, 'exito');
        pedido.estado = 'entregado';
        this.cdr.detectChanges();
      }
    });
  }

  registrarLog(accion: string) {
    const usuario = this.authService.getUsuario();
    this.http.post(`${this.apiUrl}/logs`, {
      usuario_id: usuario.id,
      nombre_usuario: usuario.nombre,
      rol: usuario.rol,
      accion: accion
    }).subscribe();
  }

  mostrarMensaje(texto: string, tipo: string) {
    this.mensaje = texto;
    this.mensajeTipo = tipo;
    this.cdr.detectChanges();
    setTimeout(() => { this.mensaje = ''; this.cdr.detectChanges(); }, 3000);
  }
}