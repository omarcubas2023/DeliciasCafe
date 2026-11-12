import { Producto } from './producto.model';

// Un item del carrito = un producto + cuántos quieres
export interface ItemCarrito {
  producto: Producto;  // el producto completo
  cantidad: number;    // cuántos de ese producto
}

// El pedido completo que se guarda en MySQL
export interface Pedido {
  id?: number;            // lo genera MySQL automáticamente
  usuario_id: number;     // qué usuario hizo el pedido
  fecha_pedido?: string;  // la fecha, la genera el backend
  total: number;          // precio total ej: 20.50
  estado?: string;        // "pendiente", "completado", etc.
  items: ItemCarrito[];   // lista de productos del pedido
}