import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemExpediente } from 'src/app/models/item-expediente.model';
import { ModalAlumnoService } from 'src/app/services/modal-alumno.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-item-expediente', 
  templateUrl: './item-expediente.component.html',
  styleUrls: ['./item-expediente.component.css']
})
export class ItemExpedienteComponent implements OnInit {

  @Input() item: ItemExpediente;

  public formSubmitted: boolean = false;
  public fechasForm: FormGroup;

  constructor( public modalService: ModalAlumnoService,
               public fb: FormBuilder ) { }

  ngOnInit(): void {

    this.fechasForm = this.fb.group({
      fecha_inicial: [ new Date(this.item.fecha_inicial).toISOString().substring(0,10), Validators.required ],
      fecha_limite: [ new Date(this.item.fecha_limite).toISOString().substring(0,10), Validators.required ]
    });

  }

  guardar(){
    console.log(this.fechasForm.value)
    console.log(this.fechasForm.valid)
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

    return this.fechasForm.get(campo)?.hasError('required') ? `Este campo es requerido.` : '';
  }

}
