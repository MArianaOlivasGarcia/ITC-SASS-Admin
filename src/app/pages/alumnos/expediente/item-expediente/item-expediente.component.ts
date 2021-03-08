import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemExpediente } from 'src/app/models/item-expediente.model';
import { ExpedienteService } from 'src/app/services/expediente.service';
import { ModalService } from 'src/app/services/modal-alumno.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-item-expediente', 
  templateUrl: './item-expediente.component.html',
  styleUrls: ['./item-expediente.component.css']
})
export class ItemExpedienteComponent implements OnInit {

  @Input() item: ItemExpediente;
  @Output() emitirCerrar = new EventEmitter<boolean>();
  @Output() emitirNewItem = new EventEmitter<ItemExpediente>();

  public formSubmitted: boolean = false;
  public fechasForm: FormGroup;

  constructor( public modalService: ModalService,
               public fb: FormBuilder,
               private expedienteService: ExpedienteService ) { }
 
  ngOnInit(): void {
    this.fechasForm = this.fb.group({
      fecha_inicial: [ { value: new Date(this.item.fecha_inicial).toISOString().substring(0,10), disabled: this.item.aceptado }, Validators.required ],
      fecha_limite: [ { value: new Date(this.item.fecha_limite).toISOString().substring(0,10), disabled: this.item.aceptado }, Validators.required ]
    }); 

  }

  guardar(){
    this.formSubmitted = true;
    if ( this.fechasForm.invalid ) { return; }

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se cambiara las fechas del expediente.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'SI',
      cancelButtonText: 'NO'
    }).then((result) => {
      if (result.isConfirmed) {

        
        Swal.showLoading();
        
        this.expedienteService.cambiarFechasPorItem( this.item._id, this.fechasForm.value )
            .subscribe( item => {
              this.item = item;
              this.addNuevoItem(item);
              Swal.fire({
                icon: 'success',
                title: 'Guardado',
                text: 'Fechas actualizadas con éxito.'
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

  addNuevoCerrar() {
    this.emitirCerrar.emit(true);
  }

  addNuevoItem(item: ItemExpediente) {
    this.emitirNewItem.emit(item);
  }

  cerrarModal(): void {
    this.modalService.cerrarModal();
    this.addNuevoCerrar();
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
           this.fechasForm.get(campo)?.hasError('isMenor') ? `Esta fecha debe ser mayor o igual que la Fecha inicial.` : '';

  }

  cambiarFecha( value: any ) {
    let primeraFecha = new Date(this.fechasForm.get('fecha_inicial').value);
    
    if ( primeraFecha.getTime() > new Date(value).getTime() ){
        this.fechasForm.controls.fecha_limite.setErrors({isMenor: true});
    } 

  }

}
