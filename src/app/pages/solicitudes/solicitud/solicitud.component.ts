import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Solicitud } from 'src/app/models/solicitud-proyecto.model';
import { AuthService } from 'src/app/services/auth.service';
import { SolicitudProyectoService } from 'src/app/services/solicitud-proyecto.service';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css']
})
export class SolicitudComponent implements OnInit {

  public solicitud: Solicitud;

  public formSubmitted = false;
  public solicitudForm: FormGroup;

  constructor( private solicitudService: SolicitudProyectoService,
               private activatedRouter: ActivatedRoute,
               private fb: FormBuilder,
               private authService: AuthService ) { }

  ngOnInit(): void {
    this.activatedRouter.params.subscribe( ({ id }) => {
      this.cargarSolicitud( id );
    })

    this.solicitudForm = this.fb.group({
      status: [true, Validators.required ],
      observacion: '',
      motivo: '',
    });


  }


  cargarSolicitud( id: string ): void {
    this.solicitudService.getById( id )
          .subscribe( solicitud => {
            this.solicitud = solicitud;
          })
  }


  guardar(): void {
    this.formSubmitted = true;
    const {status, observacion, motivo} = this.solicitudForm.value;
    
    if ( !status ) {
      // Hacer requerido la observacion
      // Actulizar como rechazado.
      if ( observacion == '' ){
        this.solicitudForm.get('observacion').setErrors({'required': true})
      }

      if ( motivo == '' ){
        this.solicitudForm.get('motivo').setErrors({'required': true})
      }

      console.log(this.solicitudForm)
      if ( this.solicitudForm.invalid ) { return; }

      const data = {
        status,
        error: {
          observacion,
          motivo
        },
        valido: this.authService.usuario
      }
      console.log(data)
    } else {
      // Actualizar como aceptado.
      const data = {
        status,
        valido: this.authService.usuario
      }
      console.log(data)

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


}
