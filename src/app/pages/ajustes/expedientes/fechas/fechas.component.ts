import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemExpediente } from 'src/app/models/item-expediente.model';
import { Periodo } from 'src/app/models/periodo.model';
import { ExpedienteService } from 'src/app/services/expediente.service';
import { ModalAlumnoService } from 'src/app/services/modal-alumno.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fechas',
  templateUrl: './fechas.component.html',
  styleUrls: ['./fechas.component.css']
})
export class FechasComponent implements OnInit {

  @Input() item: ItemExpediente;
  @Input() periodo: Periodo;

  public formSubmitted: boolean = false;
  public fechasForm: FormGroup;


  constructor( public modalService: ModalAlumnoService,
               public fb: FormBuilder,
               private expedienteService: ExpedienteService ) { }

  ngOnInit(): void {
    this.fechasForm = this.fb.group({
      fecha_inicial: [ '' , Validators.required ],
      fecha_limite: [ '', Validators.required ]
    }); 
  }


  

  guardar(){
    this.formSubmitted = true;
    console.log(this.fechasForm.value)
    if ( this.fechasForm.invalid ) { return; }

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se modificaran las fechas en todos los expedientes.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'SI',
      cancelButtonText: 'NO'
    }).then((result) => {
      if (result.isConfirmed) {

        
        Swal.showLoading();
        
        this.expedienteService.cambiarFechasGeneral( this.item.codigo, this.periodo._id, this.fechasForm.value )
        .subscribe( resp =>  {
 
            Swal.fire({
              title: 'Apertura exitosa',
              text: 'Fechas actualizadas con éxito.',
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

  cerrarModal(): void {
    this.modalService.cerrarModal();
  }

  campoNoValido( campo: string ): boolean {


    if ( this.fechasForm.get(campo)?.invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }

  }


  mensajesError( campo: string  ): string {

    return this.fechasForm.get(campo)?.hasError('required') ? `Este campo es requerido.` : 
            this.fechasForm.get(campo)?.hasError('isMenor') ? `Esta fecha debe ser mayor o igual que la Fecha inicial.` : ''
  }


  cambiarFecha( value: any ) {
    let primeraFecha = new Date(this.fechasForm.get('fecha_inicial').value);
    
    if ( primeraFecha.getTime() > new Date(value).getTime() ){
        this.fechasForm.controls.fecha_limite.setErrors({isMenor: true});
    } 

  }


}
