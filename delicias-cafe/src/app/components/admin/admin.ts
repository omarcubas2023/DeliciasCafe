import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {

  productos: any[] = [];
  logs: any[] = [];
  productoEditando: any = null;
  mostrarFormulario: boolean = false;
  vistaActiva: string = 'menu';
  mensaje: string = '';
  mensajeTipo: string = '';

  nuevoProducto: any = {
    nombre: '', precio: 0,
    categoria: 'Bebidas',
    descripcion: '', imagen: ''
  };

  categorias: string[] = ['Bebidas', 'Panadería', 'Almuerzos', 'Postres', 'Desayunos'];
  private apiUrl = '/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const usuario = this.authService.getUsuario();
    if (!usuario || usuario.rol !== 'administrador') {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarProductos();
    this.cargarLogs();
  }

  cargarProductos() {
    this.http.get<any[]>(`${this.apiUrl}/productos`).subscribe({
      next: (data) => {
        this.productos = data.map(p => ({ ...p, precio: parseFloat(p.precio) }));
        this.cdr.detectChanges();
      }
    });
  }

  cargarLogs() {
    this.http.get<any[]>(`${this.apiUrl}/logs`).subscribe({
      next: (data) => {
        this.logs = data;
        this.cdr.detectChanges();
      }
    });
  }

  editarProducto(producto: any) {
    this.productoEditando = { ...producto };
    this.cdr.detectChanges();
  }

  cancelarEdicion() {
    this.productoEditando = null;
    this.cdr.detectChanges();
  }

  guardarEdicion() {
    const usuario = this.authService.getUsuario();
    this.http.put(`${this.apiUrl}/productos/${this.productoEditando.id}`,
      this.productoEditando).subscribe({
      next: () => {
        this.registrarLog(`Editó el producto "${this.productoEditando.nombre}"`);
        this.mostrarMensaje('Producto actualizado correctamente', 'exito');
        this.productoEditando = null;
        this.cargarProductos();
      }
    });
  }

  eliminarProducto(producto: any) {
    if (!confirm(`¿Eliminar "${producto.nombre}"?`)) return;
    this.http.delete(`${this.apiUrl}/productos/${producto.id}`).subscribe({
      next: () => {
        this.registrarLog(`Eliminó el producto "${producto.nombre}" del menú`);
        this.mostrarMensaje('Producto eliminado', 'exito');
        this.cargarProductos();
      }
    });
  }

  agregarProducto() {
    this.http.post(`${this.apiUrl}/productos`, this.nuevoProducto).subscribe({
      next: () => {
        this.registrarLog(`Agregó el producto "${this.nuevoProducto.nombre}" al menú`);
        this.mostrarMensaje('Producto agregado correctamente', 'exito');
        this.mostrarFormulario = false;
        this.nuevoProducto = { nombre: '', precio: 0, categoria: 'Bebidas', descripcion: '', imagen: '' };
        this.cargarProductos();
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