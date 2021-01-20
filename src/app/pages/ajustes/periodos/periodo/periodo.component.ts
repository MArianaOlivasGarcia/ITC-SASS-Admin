import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Periodo } from 'src/app/models/periodo.model';
import { PeriodoService } from 'src/app/services/periodo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-periodo',
  templateUrl: './periodo.component.html',
  styleUrls: ['./periodo.component.css']
})
export class PeriodoComponent implements OnInit {

  
  public formSubmitted = false;
 
  public periodoForm: FormGroup;
  public periodoSeleccionado: Periodo;

  constructor( private fb: FormBuilder,
               private periodoService: PeriodoService,
               private router: Router,
               private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe( ({ id }) => {
      this.cargarPeriodo( id );
    });


    this.periodoForm = this.fb.group({
      nombre: [''],
      fecha_inicio: ['', Validators.required ],
      fecha_termino: ['', Validators.required ],
      isActual: [false]
    });

  }

  cargarPeriodo( id: string ): void{

    if ( id === 'nuevo' ) { return; }


    this.periodoService.getPeriodo( id )
        .subscribe( periodo => {

          // TODO: SI NO ENCUENTRA LA DEPENDENCIA O EL ENLACE ES INVENTADO
          //  return this.router.navigateByUrl(`/dashboard/dependencias`);

          const { nombre, fecha_inicio, fecha_termino, isActual } = periodo;
          this.periodoSeleccionado = periodo;
          this.periodoForm.setValue({nombre, fecha_inicio, fecha_termino, isActual});
        });

  }



  guardar(): void {
    console.log(this.periodoForm.value);
    this.formSubmitted = true;
    if ( this.periodoForm.invalid ) { return; }

    if ( this.periodoSeleccionado ) {
      // Actualizar
      const { nombre } = this.periodoForm.value;
      const data = {
        ... this.periodoForm.value,
        _id: this.periodoSeleccionado._id
      };

      this.periodoService.actualizarPeriodo( data )
          .subscribe( () => {
            Swal.fire({
              title: 'Guardado',
              text: `Periodo ${nombre} actualizado con éxito.`,
              icon: 'success'
            });
          });

    } else {
      // Crear
      this.periodoService.crearPeriodo( this.periodoForm.value )
      .subscribe( resp => {
        Swal.fire({
          title: 'Creado',
          text: `Periodo creado con éxito.`,
          icon: 'success'
        });
        this.router.navigateByUrl(`/dashboard/ajustes/periodo/${resp.periodo._id}`);
      }, err => {
        Swal.fire({
          title: 'Error',
          text: err.error.message ,
          icon: 'error'
        });
      });
    } 

  }



  campoNoValido( campo: string ): boolean {


    if ( this.periodoForm.get(campo)?.invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }

  }


  mensajesError( campo: string  ): string {

    return this.periodoForm.get(campo)?.hasError('required') ? `Este campo es requerido.` : '';
  }

}
