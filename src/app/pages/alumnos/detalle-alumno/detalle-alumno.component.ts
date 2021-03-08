import { Component, Input, OnInit } from '@angular/core';
import { Alumno } from 'src/app/models/alumno.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalService } from 'src/app/services/modal-alumno.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-alumno',
  templateUrl: './detalle-alumno.component.html',
  styleUrls: ['./detalle-alumno.component.css']
})
export class DetalleAlumnoComponent implements OnInit {
  
  @Input() alumno: Alumno; 

  constructor( public modalService: ModalService,
               private uploadService: FileUploadService ) { }

  ngOnInit(): void {
  }

  cerrarModal(): void {
    this.modalService.cerrarModal();
  }


  eliminarFirma(): void {


    Swal.fire({
      title: '¿Estas seguro?',
      text: "La firma sera eliminada.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.uploadService.deleteFirmaAlumno( this.alumno._id )
          .subscribe( resp => {
            this.alumno = resp.alumno;
            this.modalService.notificarUpload.emit(this.alumno);
            Swal.fire({
              title: 'Guardado',
              text: `La firma del alumno ${ this.alumno.nombre } se ha eliminado con éxito`,
              icon: 'success'
            })
          })

      }
    })


  }

}

