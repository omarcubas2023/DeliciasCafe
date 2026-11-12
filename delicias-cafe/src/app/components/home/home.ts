import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  especiales: any[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
  this.http.get<any[]>('/api/productos').subscribe({
    next: (data) => {
      this.especiales = data.slice(0, 3).map(p => ({
        ...p,
        precio: parseFloat(p.precio)
      }));
      this.cdr.detectChanges();
    },
    error: (err) => console.error(err)
  });
}
}