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

  
  public formSubmitted: boolean = false;
  
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
      nombre: [{value:'', disabled: true}],
      fecha_inicio: ['', Validators.required ],
      fecha_termino: ['', Validators.required ],
      isActual: [false],
      isProximo: [false],
      recepcion_solicitudes: this.fb.group({
        inicio: [''],
        termino: [''],
      })
    }); 

  }

  cargarPeriodo( id: string ): void{

    if ( id === 'nuevo' ) { return; }


    this.periodoService.getPeriodo( id )
        .subscribe( periodo => {

          // TODO: SI NO ENCUENTRA LA DEPENDENCIA O EL ENLACE ES INVENTADO
          //  return this.router.navigateByUrl(`/dashboard/dependencias`);
          const { nombre, fecha_inicio, fecha_termino, isActual, isProximo, recepcion_solicitudes } = periodo;
          console.log(recepcion_solicitudes)
          this.periodoSeleccionado = periodo;
          this.periodoForm.setValue({nombre,
                                    fecha_inicio: new Date(fecha_inicio).toISOString().slice(0,10),
                                    fecha_termino: new Date(fecha_termino).toISOString().slice(0,10),
                                    isActual,
                                    isProximo,
                                    recepcion_solicitudes: {
                                      inicio: new Date(recepcion_solicitudes.inicio).toISOString().slice(0,10),
                                      termino: new Date(recepcion_solicitudes.termino).toISOString().slice(0,10),
                                    }
                                    });
        });

  }



  guardar(): void {
    this.formSubmitted = true;
  
    if ( this.periodoForm.invalid ) { return; }

    if ( this.periodoSeleccionado ) {
      // Actualizar
      const { nombre } = this.periodoForm.getRawValue();
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
          }, err => {
            Swal.fire({
              title: 'Error',
              text: err.error.message ,
              icon: 'error'
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


    if ( (this.periodoForm.get(campo)?.invalid ||  this.periodoForm.get('recepcion_solicitudes').get(campo)?.invalid ) && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }

  }


  mensajesError( campo: string  ): string {

    return this.periodoForm.get(campo)?.hasError('required') ? `Este campo es requerido.` : 
           this.periodoForm.get(campo)?.hasError('isMenor') ? `Esta fecha debe ser mayor o igual que la Fecha de inicio.` :
           this.periodoForm.get('recepcion_solicitudes').get(campo)?.hasError('isMenor') ? `Esta fecha debe ser mayor o igual que la Fecha de inicio.` : ''

  }


  cambiarFecha( value: any ) {
    const primeraFecha = new Date(this.periodoForm.get('fecha_inicio').value);
    if ( primeraFecha.getTime() > new Date(value).getTime() ) {
        this.periodoForm.get('fecha_termino').setErrors({isMenor: true});
    } 
  }


  cambiarFechaSolicitud( value: any ) {
    const primeraFecha = new Date(this.periodoForm.get('recepcion_solicitudes').get('inicio').value);
    if ( primeraFecha.getTime() > new Date(value).getTime() ) {
      this.periodoForm.get('recepcion_solicitudes').get('termino').setErrors({isMenor: true});
    }
  }

}
