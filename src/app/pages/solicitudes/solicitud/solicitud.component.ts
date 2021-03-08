import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Alumno } from 'src/app/models/alumno.model';
import { Solicitud } from 'src/app/models/solicitud-proyecto.model';
import { SolicitudProyectoService } from 'src/app/services/solicitud-proyecto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css']
})
export class SolicitudComponent implements OnInit {

  public solicitud: Solicitud;
  public alumno: Alumno;

  public formSubmitted: boolean = false;
  public solicitudForm: FormGroup;

  public isAceptado: boolean = true;
  public isPendiente: boolean = true;

  public terminoServicio: Date;

  constructor( private solicitudService: SolicitudProyectoService,
               private activatedRouter: ActivatedRoute,
               private fb: FormBuilder ) { }

  ngOnInit(): void {
    this.activatedRouter.params.subscribe( ({ id }) => {
      this.cargarSolicitud( id );
    })

    this.solicitudForm = this.fb.group({
      status: [ this.isAceptado , Validators.required ],
      motivo: '',
      observacion: '',
     /*  inicio_servicio: ['', Validators.required],
      termino_servicio: [{value: '', disabled: true}], */
    });


  }


  cargarSolicitud( id: string ): void {
    this.solicitudService.getById( id )
          .subscribe( solicitud => {
            this.solicitud = solicitud;
            this.alumno = solicitud.alumno;

            this.isAceptado = solicitud.aceptado;
            this.isPendiente = solicitud.pendiente;

            if (this.isPendiente){
              this.isAceptado = true;
            }

            if( !this.isAceptado && !this.isPendiente ) {
              const { error: {
                        motivo,
                        observacion,
                      }/* ,
                      inicio_servicio,
                      termino_servicio */} = solicitud;
              this.solicitudForm.setValue({
                /* inicio_servicio,
                termino_servicio, */
                status: this.isAceptado,
                motivo,
                observacion
              })
            } else {
              /* const { inicio_servicio,
                      termino_servicio} = solicitud; */
              this.solicitudForm.setValue({
                /* inicio_servicio,
                termino_servicio, */
                status: this.isAceptado,
                motivo: '',
                observacion: ''
              })
            }
          })
  }


  guardar(): void {
    
    this.formSubmitted = true;
    const {status, observacion, motivo} = this.solicitudForm.value;
    
    if ( !status ) {
      // Hacer requerido la observacion
      // RECHAZADO
      if ( observacion == '' ){
        this.solicitudForm.get('observacion').setErrors({'required': true})
      }

      if ( motivo == '' ){
        this.solicitudForm.get('motivo').setErrors({'required': true})
      }

      if ( this.solicitudForm.invalid ) { return; }

      


      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Se rechazara esta Solicitud de Servicio Social.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'SI',
        cancelButtonText: 'NO'
      }).then((result) => {
        if (result.isConfirmed) {

          const error = {
              observacion,
              motivo
          }

          Swal.showLoading();
          
          this.solicitudService.rechazarSolicitud( this.solicitud._id, error )
              .subscribe( resp => {
                this.solicitud = resp.solicitud;
                Swal.fire({
                  title: 'Rechazado',
                  text: resp.message,
                  icon: 'success'
                })
              }, err => {
                Swal.fire({
                  title: 'Error', 
                  text: err.error.message,
                  icon: 'error' 
                })
              })
              
        }
      })
      
      

    } else {
      // ACEPTADO **.
      
      

      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Se aceptara esta Solicitud de Servicio Social..',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'SI',
        cancelButtonText: 'NO'
      }).then((result) => {
        if (result.isConfirmed) {

/*           const { inicio_servicio, termino_servicio } = this.solicitudForm.getRawValue();
             this.solicitud.inicio_servicio = inicio_servicio;
 */
          const data = {
            ...this.solicitud,
            /* inicio_servicio,
            termino_servicio */
          }

          Swal.showLoading();
          
          this.solicitudService.aceptarSolicitud( data )
            .subscribe( resp =>  {
        
              this.solicitud = resp.solicitud;

              Swal.fire({
                title: 'Aceptado',
                text: resp.message,
                icon: 'success'
              })

        
              }, err => {
                Swal.fire({
                  title: 'Error', 
                  text: err.error.message,
                  icon: 'error' 
                })
              })
              
        }
      })
    }

  }


  campoNoValido( campo: string ): boolean {

    if ( this.solicitudForm.get(campo)?.invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }

  }

  mensajesError( campo: string  ): string {
    return this.solicitudForm.get(campo)?.hasError('required') ? `Este campo es requerido.` : '';
  }


  cambioValue( valor: boolean ): void {

    valor ? this.isAceptado = true : this.isAceptado = false;

  }


  cambiarFecha( value: any ) {
    let inicioServicio = new Date(value);
    let terminoServicio =  new Date(inicioServicio.setMonth( inicioServicio.getMonth() + 6 ));

    let tDate =terminoServicio.toISOString().substring(0,10);

    this.solicitudForm.controls.termino_servicio.setValue(tDate);
  }

}
