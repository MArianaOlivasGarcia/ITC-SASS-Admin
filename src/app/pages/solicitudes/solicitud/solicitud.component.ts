import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Solicitud } from 'src/app/models/solicitud-proyecto.model';
import { AuthService } from 'src/app/services/auth.service';
import { SolicitudProyectoService } from 'src/app/services/solicitud-proyecto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css']
})
export class SolicitudComponent implements OnInit {

  public solicitud: Solicitud;

  public formSubmitted: boolean = false;
  public solicitudForm: FormGroup;

  public isAceptado: boolean = true;
  public isPendiente: boolean = true;

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
    });


  }


  cargarSolicitud( id: string ): void {
    this.solicitudService.getById( id )
          .subscribe( solicitud => {
            this.solicitud = solicitud;
            this.isAceptado = solicitud.aceptado;
            this.isPendiente = solicitud.pendiente;

            if (this.isPendiente){
              this.isAceptado = true;
            }

            if( !this.isAceptado && !this.isPendiente ) {
              const { error: {
                motivo,
                observacion
              }} = solicitud;
              this.solicitudForm.setValue({
                status: this.isAceptado,
                motivo,
                observacion
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

      const error = {
          observacion,
          motivo
      }
      
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

    } else {
      // ACEPTADO **.
      
      

                Swal.fire({
                  title: '¿Estas seguro?',
                  text: '¿Estas seguro que deseas aceptar la solicitud?',
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'SI',
                  cancelButtonText: 'NO'
                }).then((result) => {
                  if (result.isConfirmed) {

                    this.solicitudService.aceptarSolicitud( this.solicitud._id )
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


}
