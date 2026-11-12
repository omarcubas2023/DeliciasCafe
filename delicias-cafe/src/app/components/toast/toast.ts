import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class Toast implements OnInit {

  mensaje: string = '';
  visible: boolean = false;

  constructor(
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.toastService.mensaje$.subscribe(mensaje => {
      this.mensaje = mensaje;
      this.visible = true;
      this.cdr.detectChanges();

      setTimeout(() => {
        this.visible = false;
        this.cdr.detectChanges();
      }, 3000);
    });
  }
}