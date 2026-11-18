import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CarritoService } from '../../services/carrito';
import { PedidoService } from '../../services/pedido';
import { AuthService } from '../../services/auth';
import { ItemCarrito } from '../../models/pedido.model';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class Carrito implements OnInit {

  items: ItemCarrito[] = [];
  total: number = 0;
  mensaje: string = '';
  mensajeTipo: string = '';
  cargando: boolean = false;

  // Modal de pago
  mostrarModal: boolean = false;
  metodoPago: string = 'efectivo';
  numeroYape: string = '';
  errorConfiguracionPago: boolean = false;

  constructor(
    private http: HttpClient,
    private carritoService: CarritoService,
    private pedidoService: PedidoService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
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

    this.carritoService.carrito$.subscribe(items => {
      this.items = items;
      this.total = this.carritoService.getTotal();
      this.cdr.detectChanges();
    });
  }

  cambiarCantidad(productoId: number, cantidad: number) {
    if (cantidad < 1) {
      this.eliminar(productoId);
      return;
    }
    this.carritoService.cambiarCantidad(productoId, cantidad);
  }

  eliminar(productoId: number) {
    this.carritoService.eliminarProducto(productoId);
  }

  // Abre el modal de pago
  abrirModal() {
    const usuario = this.authService.getUsuario();
    if (!usuario) {
      this.mensaje = 'Debes iniciar sesión para realizar un pedido.';
      this.mensajeTipo = 'error';
      this.cdr.detectChanges();
      return;
    }
    if (this.items.length === 0) {
      this.mensaje = 'Tu carrito está vacío.';
      this.mensajeTipo = 'error';
      this.cdr.detectChanges();
      return;
    }
    this.mostrarModal = true;
    this.cdr.detectChanges();
  }

  // Cierra el modal
  cerrarModal() {
    this.mostrarModal = false;
    this.cdr.detectChanges();
  }

  // Selecciona método de pago
  seleccionarMetodo(metodo: string) {
    this.metodoPago = metodo;
    this.cdr.detectChanges();
  }

  // Confirma y envía el pedido
  confirmarPedido() {
    const usuario = this.authService.getUsuario();
    if (this.metodoPago === 'yape' && !this.numeroYape) {
      this.mensaje = this.errorConfiguracionPago
        ? 'No fue posible consultar los datos de Yape. Intenta de nuevo más tarde.'
        : 'El número Yape del negocio aún no está configurado.';
      this.mensajeTipo = 'error';
      this.cdr.detectChanges();
      return;
    }
    this.cargando = true;

    const pedido = {
      usuario_id: usuario.id,
      total: this.total,
      metodo_pago: this.metodoPago,
      items: this.items.map(i => ({
        producto_id: i.producto.id,
        cantidad: i.cantidad,
        precio_unitario: i.producto.precio
      }))
    };

    this.pedidoService.realizarPedido(pedido).subscribe({
      next: (res) => {
        this.mostrarModal = false;
        this.mensaje = `¡Pedido realizado con éxito! Pago con ${this.metodoPago}.`;
        this.mensajeTipo = 'exito';
        this.carritoService.limpiarCarrito();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.mostrarModal = false;
        this.mensaje = 'Error al realizar el pedido. Intenta de nuevo.';
        this.mensajeTipo = 'error';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}