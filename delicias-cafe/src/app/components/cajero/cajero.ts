import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-cajero',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cajero.html',
  styleUrl: './cajero.css'
})
export class Cajero implements OnInit, OnDestroy {

  pedidos: any[] = [];
  auditoria: any[] = [];
  auditoriaExpandida: number | null = null;
  mensaje: string = '';
  mensajeTipo: string = '';
  vistaActiva: string = 'pedidos';
  ultimaActualizacion: Date | null = null;
  ultimaActualizacionAuditoria: Date | null = null;
  errorPedidos: string = '';
  errorAuditoria: string = '';
  errorConfiguracionPago: boolean = false;
  numeroYape: string = '';

  // Modal de pago
  mostrarModalPago: boolean = false;
  pedidoSeleccionado: any = null;
  metodoPagoSeleccionado: string = '';
  referenciaPago: string = '';

  // Ventana de cambio (solo efectivo)
  mostrarVentanaCambio: boolean = false;
  mostrarVentanaReferencia: boolean = false;
  montoPagadoCliente: number = 0;
  procesandoPago: boolean = false;

  private apiUrl = '/api';
  private intervaloSincronizacion: ReturnType<typeof setInterval> | null = null;
  private cargandoPedidos = false;
  private cargandoAuditoria = false;

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
    this.sincronizarDatos();
    this.cargarConfiguracionPago();
    this.intervaloSincronizacion = window.setInterval(
      () => this.sincronizarDatos(),
      15000
    );
  }

  ngOnDestroy() {
    if (this.intervaloSincronizacion !== null) {
      window.clearInterval(this.intervaloSincronizacion);
    }
  }

  @HostListener('window:focus')
  @HostListener('document:visibilitychange')
  sincronizarAlVolver() {
    if (document.visibilityState === 'visible') {
      this.sincronizarDatos();
    }
  }

  sincronizarDatos() {
    this.cargarPedidos();
    if (this.vistaActiva === 'auditoria') {
      this.cargarAuditoria();
    }
  }

  cargarConfiguracionPago() {
    this.http.get<{ yapePhone: string }>('/api/config/pagos').subscribe({
      next: (config) => {
        this.numeroYape = config.yapePhone || '';
        this.errorConfiguracionPago = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.numeroYape = '';
        this.errorConfiguracionPago = true;
        this.cdr.detectChanges();
      }
    });
  }

  cargarPedidos() {
    if (this.cargandoPedidos) return;
    this.cargandoPedidos = true;
    this.http.get<any[]>(`${this.apiUrl}/pedidos/todos`).subscribe({
      next: (data) => {
        this.pedidos = data;
        this.ultimaActualizacion = new Date();
        this.errorPedidos = '';
        this.cargandoPedidos = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorPedidos =
          'No se pudieron sincronizar los pedidos. Se conservan los datos anteriores; se volverá a intentar automáticamente.';
        this.cargandoPedidos = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarAuditoria() {
    if (this.cargandoAuditoria) return;
    this.cargandoAuditoria = true;
    this.http.get<any[]>(`${this.apiUrl}/pedidos/auditoria-pagos`).subscribe({
      next: (data) => {
        this.auditoria = data;
        this.ultimaActualizacionAuditoria = new Date();
        this.errorAuditoria = '';
        this.cargandoAuditoria = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorAuditoria =
          'No se pudo actualizar la auditoría de pagos. Se volverá a intentar automáticamente.';
        this.cargandoAuditoria = false;
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
      .filter(p => p.estado === 'pagado' && p.metodoPago === 'efectivo')
      .reduce((sum, p) => sum + parseFloat(p.total), 0);
  }

  get totalTarjeta(): number {
    return this.auditoria
      .filter(p => p.estado === 'pagado' && p.metodoPago === 'tarjeta')
      .reduce((sum, p) => sum + parseFloat(p.total), 0);
  }

  get totalYape(): number {
    return this.auditoria
      .filter(p => p.estado === 'pagado' && p.metodoPago === 'yape')
      .reduce((sum, p) => sum + parseFloat(p.total), 0);
  }

  get totalPlin(): number {
    return this.auditoria
      .filter(p => p.estado === 'pagado' && p.metodoPago === 'plin')
      .reduce((sum, p) => sum + parseFloat(p.total), 0);
  }

  get totalAuditoria(): number {
    return this.auditoria
      .filter(p => p.estado === 'pagado')
      .reduce((sum, p) => sum + parseFloat(p.total), 0);
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
    this.referenciaPago = pedido.referenciaPago || '';
    this.mostrarModalPago = true;
    this.mostrarVentanaCambio = false;
    this.mostrarVentanaReferencia = false;
    this.montoPagadoCliente = 0;
    this.procesandoPago = false;
    this.cdr.detectChanges();
  }

  cerrarModalPago() {
    if (this.procesandoPago) return;
    this.mostrarModalPago = false;
    this.pedidoSeleccionado = null;
    this.metodoPagoSeleccionado = '';
    this.referenciaPago = '';
    this.mostrarVentanaCambio = false;
    this.mostrarVentanaReferencia = false;
    this.montoPagadoCliente = 0;
    this.cdr.detectChanges();
  }

  get requiereReferenciaPago(): boolean {
    return ['tarjeta', 'yape', 'plin'].includes(this.metodoPagoSeleccionado);
  }

  // Cuando el cajero confirma el método de pago
  confirmarMetodoPago() {
    if (this.metodoPagoSeleccionado === 'efectivo') {
      // Mostrar ventana de cambio
      this.mostrarVentanaCambio = true;
      this.cdr.detectChanges();
    } else {
      this.mostrarVentanaReferencia = true;
      this.cdr.detectChanges();
    }
  }

  confirmarPagoConReferencia() {
    if (!this.referenciaPago.trim()) {
      this.mostrarMensaje('Ingresa el número de operación o referencia.', 'error');
      return;
    }
    this.procesarPago();
  }

  // Confirma el pago en efectivo con cambio
  confirmarPagoEfectivo() {
    if (this.montoPagadoCliente < parseFloat(this.pedidoSeleccionado.total)) {
      this.mostrarMensaje('El monto ingresado es menor al total del pedido.', 'error');
      return;
    }
    const cambio = this.cambioCliente;
    this.procesarPago(
      cambio > 0 ? `El cliente recibió su cambio de S/ ${cambio.toFixed(2)}` : ''
    );
  }

  // Registra el pago en el backend
  procesarPago(mensajeExito: string = '') {
    if (this.procesandoPago) return;
    const pedido = this.pedidoSeleccionado;
    const metodo = this.metodoPagoSeleccionado;
    const referencia = this.referenciaPago.trim();
    this.procesandoPago = true;

    // Actualizar estado y método de pago en MySQL
    this.http.put(`${this.apiUrl}/pedidos/${pedido.id}/estado`,
      {
        estado: 'pagado',
        metodo_pago: metodo,
        referencia_pago: this.requiereReferenciaPago ? referencia : null
      }).subscribe({
      next: () => {
        this.procesandoPago = false;
        this.registrarLog(
          `Registró el pago del pedido #${pedido.id} por S/ ${pedido.total} con ${metodo}`
        );
        if (this.metodoPagoSeleccionado !== 'efectivo') {
          this.mostrarMensaje(
            `Pago del pedido #${pedido.id} registrado con ${metodo}`, 'exito');
        }
        pedido.estado = 'pagado';
        pedido.metodoPago = metodo;
        pedido.referenciaPago = this.requiereReferenciaPago ? referencia : null;
        if (mensajeExito) {
          this.mostrarMensaje(mensajeExito, 'exito');
        }
        this.cerrarModalPago();
        this.sincronizarDatos();
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.procesandoPago = false;
        this.mostrarMensaje(
          error.status === 409
            ? 'Otro empleado ya procesó este pedido. Se actualizará la lista.'
            : 'Error al registrar el pago.',
          'error'
        );
        this.cerrarModalPago();
        this.sincronizarDatos();
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