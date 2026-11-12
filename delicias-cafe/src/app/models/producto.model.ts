export interface Producto {
  id: number;          // número único del producto
  nombre: string;      // ej: "Café Americano"
  precio: number;      // ej: 8.50
  categoria: string;   // ej: "Bebidas"
  descripcion: string; // ej: "Café espresso con agua caliente"
  imagen: string;      // ej: "americano.jpg"
}