import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { CarritoService } from '../../services/carrito';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-especiales',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './especiales.html',
  styleUrl: './especiales.css'
})
export class Especiales implements OnInit {

  especiales: any[] = [];
  mensajeCarrito: string = '';

  constructor(
    private http: HttpClient,
    private carritoService: CarritoService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.http.get<any[]>('/api/productos').subscribe({
      next: (data) => {
        // Convertir precio a número y tomar los primeros 6 como especiales
        this.especiales = data.slice(0, 6).map(p => ({
          ...p,
          precio: parseFloat(p.precio)
        }));
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  agregarAlCarrito(producto: any) {
    this.carritoService.agregarProducto(producto);
    this.toastService.mostrar(`${producto.nombre} agregado al carrito`);
  }
}