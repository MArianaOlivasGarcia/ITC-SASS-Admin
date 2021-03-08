import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ItemExpediente } from 'src/app/models/item-expediente.model';
import { ExpedienteService } from 'src/app/services/expediente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-documento',
  templateUrl: './documento.component.html',
  styleUrls: ['./documento.component.css']
})
export class DocumentoComponent implements OnInit {

  public item: ItemExpediente;
  public cargando: boolean = true;

  public formSubmitted: boolean = false; 
  public itemForm: FormGroup;

  public isAceptado: boolean = true;
  public isPendiente: boolean = true;

  constructor( private expedienteService: ExpedienteService,
               private activatedRouter: ActivatedRoute,
               private fb: FormBuilder ) { }

  ngOnInit(): void {
    this.activatedRouter.params.subscribe( ({id}) => {
      this.cargarItem(id)
    })

    this.itemForm = this.fb.group({
      status: [ this.isAceptado , Validators.required ],
      motivo: '',
      observacion: '',
    });


  }

  cargarItem( id: string ): void {

    this.expedienteService.getItemExpediente( id )
          .subscribe( item => {
            this.cargando = false
            this.item = item;
            this.isAceptado = item.aceptado;
            this.isPendiente = item.pendiente;

            if (this.isPendiente){
              this.isAceptado = true;
            }

            if ( !this.isAceptado && !this.isPendiente ) {
              const { error : {
                motivo,
                observacion
              }} = item;
              this.itemForm.setValue({
                status: this.isAceptado,
                motivo,
                observacion
              })
            }

          })

  }


  guardar(): void {
    this.formSubmitted = true;
    const {status, observacion, motivo} = this.itemForm.value;
    
    if ( !status ) {
      // Hacer requerido la observacion
      // RECHAZADO
      if ( observacion == '' ){
        this.itemForm.get('observacion').setErrors({'required': true})
      }

      if ( motivo == '' ){
        this.itemForm.get('motivo').setErrors({'required': true})
      }

      if ( this.itemForm.invalid ) { return; }

   

      Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Estas seguro que deseas rechazar el archivo ${this.item.titulo}?`,
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
          
          this.expedienteService.rechazarDocumento( this.item._id, error )
              .subscribe( resp => {
                this.item = resp.item;
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
                  title: '¿Estas seguro?',
                  text: `¿Estas seguro que deseas aceptar el archivo ${this.item.titulo}?`,
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'SI',
                  cancelButtonText: 'NO'
                }).then((result) => {
                  if (result.isConfirmed) {

                    this.expedienteService.aceptarDocumento( this.item._id )
                      .subscribe( resp =>  {
                  
                        this.item = resp.item;

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

    if ( this.itemForm.get(campo)?.invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }

  }

  mensajesError( campo: string  ): string {
    return this.itemForm.get(campo)?.hasError('required') ? `Este campo es requerido.` : '';
  }


  cambioValue( valor: boolean ): void {

    valor ? this.isAceptado = true : this.isAceptado = false;

  }

}
