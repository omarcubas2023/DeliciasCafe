import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../models/producto.model';
import { ItemCarrito } from '../models/pedido.model';

@Injectable({ providedIn: 'root' })
export class CarritoService{

  // Lista interna de productos en el carrito
  private items: ItemCarrito[] = [];

  // BehaviorSubject permite que otros componentes
  // se enteren cuando el carrito cambia
  private carritoSubject = new BehaviorSubject<ItemCarrito[]>([]);
  carrito$ = this.carritoSubject.asObservable();

  // Agrega un producto al carrito
  agregarProducto(producto: Producto) {
    const existente = this.items.find(i => i.producto.id === producto.id);
    if (existente) {
      // Si ya existe, solo aumenta la cantidad
      existente.cantidad++;
    } else {
      // Si es nuevo, lo agrega con cantidad 1
      this.items.push({ producto, cantidad: 1 });
    }
    this.carritoSubject.next([...this.items]);
  }

  // Elimina un producto del carrito
  eliminarProducto(productoId: number) {
    this.items = this.items.filter(i => i.producto.id !== productoId);
    this.carritoSubject.next([...this.items]);
  }

  // Cambia la cantidad de un producto
  cambiarCantidad(productoId: number, cantidad: number) {
    const item = this.items.find(i => i.producto.id === productoId);
    if (item) { item.cantidad = cantidad; }
    this.carritoSubject.next([...this.items]);
  }

  // Calcula el precio total del carrito
  getTotal(): number {
    return this.items.reduce((sum, i) => sum + i.producto.precio * i.cantidad, 0);
  }

  // Cuenta cuántos productos hay en el carrito (para el badge)
  getCantidadTotal(): number {
    return this.items.reduce((sum, i) => sum + i.cantidad, 0);
  }

  // Vacía el carrito después de hacer el pedido
  limpiarCarrito() {
    this.items = [];
    this.carritoSubject.next([]);
  }
}