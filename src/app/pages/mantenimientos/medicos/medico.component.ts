import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;

  constructor(private fb: FormBuilder, 
              private hospitalServide: HospitalService,
              private medicoService: MedicoService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }



  ngOnInit(): void {

    this.activatedRoute.params
      .subscribe(({id}) => {
        this.cargarMedico(id);
        // console.log('tick'); //para verificar fugas de memoria
      });
    
      
    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });

    this.cargarHospital();

    this.medicoForm.get('hospital').valueChanges
      .subscribe(hospitalId => {
        // console.log(hospitalId);
        this.hospitalSeleccionado = this.hospitales.find(h => h._id === hospitalId);
        // console.log(this.hospitalSeleccionado);  
        // console.log('tick'); //para verificar fugas de memoria  
      });
  }





  cargarMedico(id: string) {

    // nuevo = se manda en la redireccion por la url en el boton (Crear nuevo Médico)
    if (id === 'nuevo') {
      return;

    } else {

      this.medicoService.obtenerMedicoById(id)
        .pipe(delay(100))
        .subscribe(medico => {

          // validacion: si el médico no existe
          if (!medico) {
            Swal.fire('Verificación', 'El elemento ingresado no existe, será redireccionado', 'info');
            return this.router.navigateByUrl(`/dashboard/medicos`);
          
          } else {

            // console.log(medico)
            const { nombre, hospital:{_id}} = medico;
            // console.log(nombre, _id);
            this.medicoSeleccionado = medico;
            this.medicoForm.setValue({nombre, hospital: _id});
          }
        });
    }
  }








  cargarHospital() {
    this.hospitalServide.cargarHospitales()
      .subscribe((listadoHospitales: Hospital[]) => {
        // console.log(listadoHospitales);
        this.hospitales = listadoHospitales;
      });
  }






  guardarMedico() {
    // console.log(this.medicoForm.value);
    console.log('medicoSeleccionado: ', this.medicoSeleccionado);
    const {nombre} = this.medicoForm.value;


    if (this.medicoSeleccionado) {
      // actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico(data)
        .subscribe(resp => {
          // console.log('resp: ', resp);          
          Swal.fire({
            title: 'Actualizado',
            text: `Médico (${nombre}) actualizado exitosamente`,
            icon:'success',
            confirmButtonText: 'Aceptar'
          });
        })
      
    } else {
      // crear
      this.medicoService.crearMedico(this.medicoForm.value)
        .subscribe((resp: any) => {
          // console.log(resp);
          Swal.fire('Agregado', `Nuevo médico (${nombre}) registrado exitosamente`, 'success');
          this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
        })
    }
  }

}