import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-cajero',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cajero.html',
  styleUrl: './cajero.css'
})
export class Cajero implements OnInit {

  pedidos: any[] = [];
  auditoria: any[] = [];
  auditoriaExpandida: number | null = null;
  mensaje: string = '';
  mensajeTipo: string = '';
  vistaActiva: string = 'pedidos';

  // Modal de pago
  mostrarModalPago: boolean = false;
  pedidoSeleccionado: any = null;
  metodoPagoSeleccionado: string = '';

  // Ventana de cambio (solo efectivo)
  mostrarVentanaCambio: boolean = false;
  montoPagadoCliente: number = 0;

  private apiUrl = '/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const usuario = this.authService.getUsuario();
    if (!usuario || usuario.rol !== 'cajero') {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.http.get<any[]>(`${this.apiUrl}/pedidos/todos`).subscribe({
      next: (data) => {
        this.pedidos = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.pedidos = [];
        this.cdr.detectChanges();
      }
    });
  }

  cargarAuditoria() {
    this.http.get<any[]>(`${this.apiUrl}/pedidos/auditoria-pagos`).subscribe({
      next: (data) => {
        this.auditoria = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.auditoria = [];
        this.cdr.detectChanges();
      }
    });
  }

  toggleAuditoria(pedidoId: number) {
    this.auditoriaExpandida = this.auditoriaExpandida === pedidoId ? null : pedidoId;
    this.cdr.detectChanges();
  }

  get gananciasDia(): number {
    return this.pedidos
      .filter(p => p.estado === 'pagado')
      .reduce((sum, p) => sum + parseFloat(p.total), 0);
  }

  get pedidosPagados(): number {
    return this.pedidos.filter(p => p.estado === 'pagado').length;
  }

  get totalEfectivo(): number {
    return this.auditoria
      .filter(p => p.metodoPago === 'efectivo')
      .reduce((sum, p) => sum + parseFloat(p.total), 0);
  }

  get totalTarjeta(): number {
    return this.auditoria
      .filter(p => p.metodoPago === 'tarjeta')
      .reduce((sum, p) => sum + parseFloat(p.total), 0);
  }

  get totalYape(): number {
    return this.auditoria
      .filter(p => p.metodoPago === 'yape')
      .reduce((sum, p) => sum + parseFloat(p.total), 0);
  }

  get totalPlin(): number {
    return this.auditoria
      .filter(p => p.metodoPago === 'plin')
      .reduce((sum, p) => sum + parseFloat(p.total), 0);
  }

  get totalAuditoria(): number {
    return this.auditoria.reduce((sum, p) => sum + parseFloat(p.total), 0);
  }

  // Calcula el cambio a devolver al cliente
  get cambioCliente(): number {
    if (!this.pedidoSeleccionado) return 0;
    const diff = this.montoPagadoCliente - parseFloat(this.pedidoSeleccionado.total);
    return diff > 0 ? diff : 0;
  }

  // Abre el modal de método de pago
  abrirModalPago(pedido: any) {
    this.pedidoSeleccionado = pedido;
    this.metodoPagoSeleccionado = pedido.metodoPago || 'efectivo';
    this.mostrarModalPago = true;
    this.mostrarVentanaCambio = false;
    this.montoPagadoCliente = 0;
    this.cdr.detectChanges();
  }

  cerrarModalPago() {
    this.mostrarModalPago = false;
    this.pedidoSeleccionado = null;
    this.metodoPagoSeleccionado = '';
    this.mostrarVentanaCambio = false;
    this.montoPagadoCliente = 0;
    this.cdr.detectChanges();
  }

  // Cuando el cajero confirma el método de pago
  confirmarMetodoPago() {
    if (this.metodoPagoSeleccionado === 'efectivo') {
      // Mostrar ventana de cambio
      this.mostrarVentanaCambio = true;
      this.cdr.detectChanges();
    } else {
      // Para tarjeta, Yape o Plin, registrar directamente
      this.procesarPago();
    }
  }

  // Confirma el pago en efectivo con cambio
  confirmarPagoEfectivo() {
    if (this.montoPagadoCliente < parseFloat(this.pedidoSeleccionado.total)) {
      this.mostrarMensaje('El monto ingresado es menor al total del pedido.', 'error');
      return;
    }
    const cambio = this.cambioCliente;
    this.procesarPago();
    if (cambio > 0) {
      this.mostrarMensaje(
        `El cliente recibió su cambio de S/ ${cambio.toFixed(2)}`, 'exito');
    }
  }

  // Registra el pago en el backend
  procesarPago() {
    const pedido = this.pedidoSeleccionado;
    const metodo = this.metodoPagoSeleccionado;

    // Actualizar estado y método de pago en MySQL
    this.http.put(`${this.apiUrl}/pedidos/${pedido.id}/estado`,
      { estado: 'pagado', metodo_pago: metodo }).subscribe({
      next: () => {
        this.registrarLog(
          `Registró el pago del pedido #${pedido.id} por S/ ${pedido.total} con ${metodo}`
        );
        if (this.metodoPagoSeleccionado !== 'efectivo') {
          this.mostrarMensaje(
            `Pago del pedido #${pedido.id} registrado con ${metodo}`, 'exito');
        }
        pedido.estado = 'pagado';
        pedido.metodoPago = metodo;
        this.cerrarModalPago();
        this.cdr.detectChanges();
      },
      error: () => {
        this.mostrarMensaje('Error al registrar el pago.', 'error');
        this.cerrarModalPago();
      }
    });
  }

  cancelarPedido(pedido: any) {
    if (!confirm(`¿Cancelar el pedido #${pedido.id}?`)) return;
    this.http.put(`${this.apiUrl}/pedidos/${pedido.id}/estado`,
      { estado: 'cancelado' }).subscribe({
      next: () => {
        this.registrarLog(`Canceló el pedido #${pedido.id} por error`);
        this.mostrarMensaje(`Pedido #${pedido.id} cancelado`, 'error');
        pedido.estado = 'cancelado';
        this.cdr.detectChanges();
      },
      error: () => this.mostrarMensaje('Error al cancelar pedido', 'error')
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
    setTimeout(() => { this.mensaje = ''; this.cdr.detectChanges(); }, 4000);
  }

  iconoMetodo(metodo: string): string {
    switch (metodo) {
      case 'efectivo': return 'Efectivo';
      case 'tarjeta': return 'Tarjeta';
      case 'yape': return 'Yape';
      case 'plin': return 'Plin';
      default: return metodo;
    }
  }
}