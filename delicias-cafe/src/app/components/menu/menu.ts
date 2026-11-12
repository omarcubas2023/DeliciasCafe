import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { CarritoService } from '../../services/carrito';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu implements OnInit {

  productos: any[] = [];
  productosFiltrados: any[] = [];
  busqueda: string = '';
  categoriaActiva: string = 'Todas';
  mensajeCarrito: string = '';

  categorias: string[] = ['Todas', 'Bebidas', 'Panadería', 'Almuerzos', 'Postres', 'Desayunos'];

  constructor(
    private http: HttpClient,
    private carritoService: CarritoService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.http.get<any[]>('/api/productos').subscribe({
      next: (data) => {
        this.productos = data.map(p => ({
          ...p,
          precio: parseFloat(p.precio)
        }));
        this.productosFiltrados = this.productos;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  filtrarPorCategoria(categoria: string) {
    this.categoriaActiva = categoria;
    this.aplicarFiltros();
  }

  buscarProducto() {
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let resultado = this.productos;

    if (this.categoriaActiva !== 'Todas') {
      resultado = resultado.filter(p => p.categoria === this.categoriaActiva);
    }

    if (this.busqueda.trim() !== '') {
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    }

    this.productosFiltrados = resultado;
    this.cdr.detectChanges();
  }

  agregarAlCarrito(producto: any) {
    this.carritoService.agregarProducto(producto);
    this.toastService.mostrar(`${producto.nombre} agregado al carrito`);
  }
}