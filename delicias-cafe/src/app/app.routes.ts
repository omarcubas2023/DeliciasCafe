import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home').then(m => m.Home)
  },
  {
    path: 'menu',
    loadComponent: () => import('./components/menu/menu').then(m => m.Menu)
  },
  {
    path: 'carrito',
    loadComponent: () => import('./components/carrito/carrito').then(m => m.Carrito)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.Login)
  },
  {
  path: 'registro',
  loadComponent: () => import('./components/registro/registro').then(m => m.Registro)
  },
  {
    path: 'especiales',
    loadComponent: () => import('./components/especiales/especiales').then(m => m.Especiales)
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin').then(m => m.Admin)
  },
  {
    path: 'cajero',
    loadComponent: () => import('./components/cajero/cajero').then(m => m.Cajero)
  },
  {
    path: 'mesero',
    loadComponent: () => import('./components/mesero/mesero').then(m => m.Mesero)
  },
  {
    path: 'historial',
    loadComponent: () => import('./components/historial/historial').then(m => m.Historial)
  },
  {
    path: 'cocina',
    loadComponent: () => import('./components/cocina/cocina').then(m => m.Cocina)
  },
  { path: '**', redirectTo: '' }
];