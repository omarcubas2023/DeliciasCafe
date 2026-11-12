import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-cocina',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cocina.html',
  styleUrl: './cocina.css'
})
export class Cocina implements OnInit {

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
    if (!usuario || usuario.rol !== 'cocinero') {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.http.get<any[]>(`${this.apiUrl}/pedidos/todos`).subscribe({
      next: (data) => {
        this.pedidos = data.filter(p => p.estado === 'en_cocina');
        this.cdr.detectChanges();
      },
      error: () => {
        this.pedidos = [];
        this.cdr.detectChanges();
      }
    });
  }

  marcarCocinando(pedido: any) {
    this.registrarLog(`Comenzó a preparar el pedido #${pedido.id}`);
    this.mostrarMensaje(`Pedido #${pedido.id} en preparación`, 'exito');
    pedido.estadoCocina = 'cocinando';
    this.cdr.detectChanges();
  }

  marcarListo(pedido: any) {
    this.http.put(`${this.apiUrl}/pedidos/${pedido.id}/estado`,
      { estado: 'listo' }).subscribe({
      next: () => {
        this.registrarLog(`El pedido #${pedido.id} está listo para servir`);
        this.mostrarMensaje(`Pedido #${pedido.id} listo`, 'exito');
        pedido.estado = 'listo';
        pedido.estadoCocina = 'listo';
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