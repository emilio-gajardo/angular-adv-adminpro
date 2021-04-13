import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { HospitalService } from 'src/app/services/hospital.service';
import { Hospital } from 'src/app/models/hospital.model';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  public imgSubs: Subscription;
  public hospitalesTemp: Hospital[] = [];


  constructor(private hospitalService: HospitalService, 
              private modalImagenService: ModalImagenService,
              private busquedasServices: BusquedasService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe(img => this.cargarHospitales());
  }




  cargarHospitales() {
    this.cargando = true;
    
    this.hospitalService.cargarHospitales()
      .subscribe(listadoHospitales => {
        // console.log(hospitales);
        this.cargando = false;
        this.hospitales = listadoHospitales;
      });
  }




  guardarCambios(hospital: Hospital) {
    //console.log(hospital);
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre)
      .subscribe(resp => {
        Swal.fire('Actualizado', hospital.nombre, 'success');
      });
  }


  borrarHospital(hospital: Hospital) {
    //console.log(hospital);
    this.hospitalService.borrarHospital(hospital._id)
      .subscribe(resp => {
        this.cargarHospitales();
        Swal.fire('Borrado', hospital.nombre, 'success');
      });
  }



  async abrirSweetAlert() {

    const { value = '' } = await Swal.fire<string>({
      input: 'text',
      title: 'Registrar nuevo Hospital',
      inputPlaceholder: 'Nombre del nuevo Hospital',
      showCancelButton: true,
      confirmButtonText: 'Agregar'
    })
    //console.log(value);

    if (value.trim().length > 0) {
      this.hospitalService.crearHospital(value)
        .subscribe((resp: any) => {
          //console.log(resp);
          this.hospitales.push(resp.hospital)
        });
    }

  }



  abrirModal(hospital: Hospital){
    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img);
  }


  buscar(termino: string) {
    //console.log("Termino: ", termino);

    if (termino.length === 0) {
      //return this.hospitales = this.hospitalesTemp;
      return this.cargarHospitales();
    }

    this.busquedasServices.buscar('hospitales', termino)
      .subscribe((resultados: Hospital[]) => {
        //console.log(resultados)
        this.hospitales = resultados;
      });
    
  }


}
