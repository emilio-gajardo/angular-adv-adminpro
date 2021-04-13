import { Component, OnDestroy, OnInit } from '@angular/core';
import { MedicoService } from 'src/app/services/medico.service';
import { Medico } from 'src/app/models/medico.model';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos: Medico[] = [];
  public cargando: boolean = true;
  public imgSubs: Subscription;

  constructor(private medicoService: MedicoService,
              private modalImagenService: ModalImagenService,
              private busquedasService: BusquedasService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(200))
      .subscribe(img => this.cargarMedicos());
  }



  cargarMedicos() {
    this.cargando = true;
    
    this.medicoService.cargarMedicos()
      .pipe(delay(100))
      .subscribe(listadoMedicos => {
        this.cargando = false;
        this.medicos = listadoMedicos;
      });
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }


  buscar(termino: string) {
    //console.log(termino);
    
    if (termino.length === 0) {
      return this.cargarMedicos();
    }

    this.busquedasService.buscar('medicos', termino)
    .subscribe(resultados => {
        //console.log(resultados);
        
        this.medicos = resultados;
      });
  }


  borrarMedico(medico: Medico) {
    //console.log(medico);

    Swal.fire({

      title: '¿Borrar Médico?',
      text: `¿Estás seguro de borrar a ${medico.nombre}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar'

    }).then((result) => {

      if (result.isConfirmed) {

        this.medicoService.borrarMedico(medico._id)
          .subscribe(resp => {

            this.cargarMedicos();

            Swal.fire({
              title: 'Médico borrado',
              text: `${medico.nombre} fue borrado exitosamente`,
              icon: 'success'
            });

          });
      }
    })

  }

}
