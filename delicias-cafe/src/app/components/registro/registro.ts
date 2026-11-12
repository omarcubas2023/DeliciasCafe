import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {

  nombre: string = '';
  email: string = '';
  password: string = '';
  confirmarPassword: string = '';
  rol: string = 'cliente';
  error: string = '';
  exito: string = '';
  cargando: boolean = false;

  roles: any[] = [
    { valor: 'cliente', label: 'Cliente', desc: 'Ver menú y realizar pedidos' },
    { valor: 'administrador', label: 'Administrador', desc: 'Gestionar menú y empleados' },
    { valor: 'cajero', label: 'Cajero', desc: 'Registrar pagos y ganancias' },
    { valor: 'mesero', label: 'Mesero', desc: 'Gestionar pedidos de mesas' },
    { valor: 'cocinero', label: 'Cocinero', desc: 'Preparar y actualizar pedidos' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registrarse() {
    if (!this.nombre || !this.email || !this.password || !this.confirmarPassword) {
      this.error = 'Por favor completa todos los campos.';
      return;
    }

    if (this.password !== this.confirmarPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    this.cargando = true;
    this.error = '';

    this.authService.registro(this.nombre, this.email, this.password, this.rol).subscribe({
      next: (res) => {
        this.exito = '¡Cuenta creada exitosamente! Redirigiendo al login...';
        this.cargando = false;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al crear la cuenta.';
        this.cargando = false;
      }
    });
  }
}