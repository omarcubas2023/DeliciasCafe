import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CarritoService } from '../../services/carrito';
import { AuthService } from '../../services/auth';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  cantidadCarrito: number = 0;
  usuarioNombre: string = '';
  estaLogueado: boolean = false;
  rolUsuario: string = '';

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.actualizarSesion();
      this.cdr.detectChanges();
    });

    this.carritoService.carrito$.subscribe(items => {
      this.cantidadCarrito = this.carritoService.getCantidadTotal();
      this.cdr.detectChanges();
    });

    this.actualizarSesion();
  }

  actualizarSesion() {
    const usuario = this.authService.getUsuario();
    if (usuario) {
      this.estaLogueado = true;
      this.usuarioNombre = usuario.nombre;
      this.rolUsuario = usuario.rol;
    } else {
      this.estaLogueado = false;
      this.usuarioNombre = '';
      this.rolUsuario = '';
    }
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.estaLogueado = false;
    this.usuarioNombre = '';
    this.rolUsuario = '';
    this.cdr.detectChanges();
    this.router.navigate(['/']);
  }
}