import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  // menu: any[] = [
  //   {
  //     titulo: 'My-Dashboard',
  //     icono: 'mdi mdi-view-dashboard',
  //     submenu: [
  //       { titulo: 'Main', url: '/' },
  //       { titulo: 'Gráficas', url: 'grafica1' },
  //       { titulo: 'ProgressBar', url: 'progress' },
  //       { titulo: 'Promesas', url: 'promesas' },
  //       { titulo: 'Rxjs', url: 'rxjs' },
  //     ]
  //   },


  //   {
  //     titulo: 'Mantenimiento',
  //     icono: 'mdi mdi-folder-lock-open',
  //     submenu: [
  //       { titulo: 'Usuarios', url: 'usuarios' },
  //       { titulo: 'Hospitales', url: 'hospitales' },
  //       { titulo: 'Médicos', url: 'medicos' },
  //     ]
  //   }
  // ];

  public menu = [

  ]

  cargarMenu() {
    this.menu = JSON.parse(localStorage.getItem('menu')) || [];
  }

}
