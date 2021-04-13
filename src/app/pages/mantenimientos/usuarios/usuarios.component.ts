import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [],
})
export class UsuariosComponent implements OnInit, OnDestroy{


  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public cargando: boolean = true;
  public imgSubs: Subscription;


  constructor(private usuarioService: UsuarioService, 
              private busquedasServices: BusquedasService,
              private modalImagenService: ModalImagenService) { }


  ngOnDestroy(): void {
    this.imgSubs.unsubscribe(); // evita fugas de memoria o doble cargas
  }


  ngOnInit(): void {
    this.cargarUsuarios();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe(img => this.cargarUsuarios());
  }




  cargarUsuarios() {
    this.cargando = true;
    
    this.usuarioService
      .cargarUsuarios(this.desde)
      .subscribe(({ total, usuarios }) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
      });
  }


  cambiarPagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor;
    }

    this.cargarUsuarios();
  }


  buscar(termino: string) {
    //console.log(termino);

    if (termino.length === 0) {
      return this.usuarios = this.usuariosTemp;
    }

    this.busquedasServices.buscar('usuarios', termino)
      .subscribe((resultados: Usuario[]) => {
        //console.log(resp)
        this.usuarios = resultados;
      });
  }


  eliminarUsuario(usuario: Usuario) {

    // console.log('usuario.uid = ', usuario.uid);
    // console.log('this.usuarioService.uid = ', this.usuarioService.uid);

    if (usuario.uid === this.usuarioService.uid) {
      return Swal.fire({
        title: 'Error',
        text: 'No es posible borrar al usuario logueado',
        icon: 'error'
      });
    }


    //console.log(usuario);
    Swal.fire({
      title: '¿Borrar usuario?',
      text: `¿Está seguro de borrar a ${usuario.nombre}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.usuarioService.eliminarUsuario(usuario)
          .subscribe(resp => {

            this.cargarUsuarios();

            Swal.fire({
              title: 'Usuario borrado',
              text: `${usuario.nombre} fue borrado exitosamente`,
              icon: 'success'
            });

          });
      }
    })
  }



  cambiarRole(usuario: Usuario) {
    //console.log(usuario);
    this.usuarioService.guardarUsuario(usuario)
      .subscribe(resp => {
        console.log(resp);

      })

  }


  abrirModal(usuario: Usuario) {
    //console.log(usuario);
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
    
  }
}
