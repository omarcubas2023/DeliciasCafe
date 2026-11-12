import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private mensajeSubject = new Subject<string>();
  mensaje$ = this.mensajeSubject.asObservable();

  mostrar(mensaje: string) {
    this.mensajeSubject.next(mensaje);
  }
}