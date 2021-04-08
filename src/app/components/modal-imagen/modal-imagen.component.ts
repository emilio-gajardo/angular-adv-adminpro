import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir: File;
  public imgTemp: any = null;


  constructor(public modalImagenService: ModalImagenService,
              public fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
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

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService
      .actualizarFoto(tipo, id, this.imagenSubir,)
      .then(img => {
        //this.usuario.img = img; // se asigna la nueva imagen a la instancia para que se actualice
        Swal.fire({
          title: 'Bien',
          text: 'Imagen actualizada exitosamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

        this.modalImagenService.nuevaImagen.emit(img)

        this.cerrarModal();

      }).catch(err => {
        console.log(err);
        Swal.fire({ title: 'Error', text: 'No se pudo subir la imagen', icon: 'error' });
      });
  }


}
