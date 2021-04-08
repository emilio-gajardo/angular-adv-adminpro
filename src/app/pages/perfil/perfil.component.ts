import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService
  ) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {

    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
    });
  }


  actualizarPerfil() {
    //console.log(this.perfilForm.value);

    this.usuarioService.actualizarPerfil(this.perfilForm.value)
      .subscribe(() => {
        // console.log(resp);
        const { nombre, email } = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;
        Swal.fire({
          title: 'Bien',
          text: 'Datos modificados exitosamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }, (err) => {
        //console.log(err.error.msg);
        Swal.fire({
          title: 'Error',
          text: err.error.msg,
          icon: 'error'
        });
      });
  }


  cambiarImagen(file: File) {
    //console.log(file);
    this.imagenSubir = file;

    if (!file) {
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      //console.log(reader.result);
      this.imgTemp = reader.result;
    }


    //-- validación para que sea solo un archivo de imagen
    if (!this.imagenSubir.type.includes('image/')) {
      //console.log('archivo incorrect');
      this.imgTemp = null;
      this.imagenSubir = null;
      return Swal.fire({ title: 'Error', text: 'Debe ser una imagen (png, jpg, jpeg)', icon: 'error' });
    }
    //--
  }


  subirImagen() {

    this.fileUploadService
      .actualizarFoto('usuarios', this.usuario.uid, this.imagenSubir,)
      .then(img => {
        this.usuario.img = img; // se asigna la nueva imagen a la instancia para que se actualice
        Swal.fire({
          title: 'Bien',
          text: 'Imagen actualizada exitosamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

      }).catch(err => {
        console.log(err);
        Swal.fire({ title: 'Error', text: 'No se pudo subir la imagen', icon: 'error' });
      });
  }

  
}
