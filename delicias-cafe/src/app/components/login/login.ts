import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FirebaseAuthService } from '../../services/firebase-auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  paso: number = 1;
  tipoAcceso: string = '';
  email: string = '';
  password: string = '';
  error: string = '';
  cargando: boolean = false;
  cargandoGoogle: boolean = false;

  constructor(
    private authService: AuthService,
    private firebaseAuth: FirebaseAuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  seleccionarTipo(tipo: string) {
    this.tipoAcceso = tipo;
    this.paso = 2;
    this.error = '';
  }

  volver() {
    this.paso = 1;
    this.email = '';
    this.password = '';
    this.error = '';
  }

  async loginConGoogle() {
    this.cargandoGoogle = true;
    this.error = '';
    try {
      const usuarioGoogle = await this.firebaseAuth.loginConGoogle();

      this.authService.loginORegistrarGoogle(
        usuarioGoogle.nombre,
        usuarioGoogle.email
      ).subscribe({
        next: (res) => {
          this.authService.guardarSesion({
            id: res.usuario.id,
            nombre: res.usuario.nombre,
            email: res.usuario.email,
            foto: usuarioGoogle.foto,
            rol: res.usuario.rol
          }, res.token);
          this.router.navigate(['/']);
        },
        error: () => {
          this.error = 'Error al conectar con el servidor.';
          this.cargandoGoogle = false;
          this.cdr.detectChanges();
        }
      });
    } catch (error) {
      this.error = 'Error al iniciar sesión con Google.';
      this.cargandoGoogle = false;
      this.cdr.detectChanges();
    }
  }

  iniciarSesion() {
  if (!this.email || !this.password) {
    this.error = 'Por favor completa todos los campos.';
    return;
  }

    this.cargando = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        const usuario = res.usuario;

        if (this.tipoAcceso === 'cliente' && usuario.rol !== 'cliente') {
          this.error = 'Esta cuenta no es de cliente. Usa acceso Trabajador.';
          this.cargando = false;
          return;
        }

        if (this.tipoAcceso === 'trabajador' && usuario.rol === 'cliente') {
          this.error = 'Esta cuenta no es de trabajador. Usa acceso Cliente.';
          this.cargando = false;
          return;
        }

        this.authService.guardarSesion(usuario, res.token);

        switch (usuario.rol) {
          case 'administrador': this.router.navigate(['/admin']); break;
          case 'cajero': this.router.navigate(['/cajero']); break;
          case 'mesero': this.router.navigate(['/mesero']); break;
          case 'cocinero': this.router.navigate(['/cocina']); break;
          default: this.router.navigate(['/']);
        }
      },
      error: () => {
        this.error = 'Correo o contraseña incorrectos.';
        this.cargando = false;
      }
    });
  }
}