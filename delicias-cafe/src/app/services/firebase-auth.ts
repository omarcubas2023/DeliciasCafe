import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {

  private app = initializeApp(environment.firebaseConfig);
  private auth = getAuth(this.app);
  private provider = new GoogleAuthProvider();

  // Iniciar sesión con Google
  async loginConGoogle(): Promise<any> {
    try {
      const resultado = await signInWithPopup(this.auth, this.provider);
      const usuario = resultado.user;

      // Guardamos el email para buscar o crear el usuario en MySQL
      return {
        nombre: usuario.displayName,
        email: usuario.email,
        foto: usuario.photoURL,
        uid: usuario.uid,
        rol: 'cliente'
      };
    } catch (error) {
      throw error;
    }
  }

  // Cerrar sesión de Google
  async cerrarSesionGoogle(): Promise<void> {
    await signOut(this.auth);
  }
}