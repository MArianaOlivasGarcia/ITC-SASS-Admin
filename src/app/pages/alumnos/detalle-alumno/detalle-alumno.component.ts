import { Component, Input, OnInit } from '@angular/core';
import { Alumno } from 'src/app/models/alumno.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalAlumnoService } from 'src/app/services/modal-alumno.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-alumno',
  templateUrl: './detalle-alumno.component.html',
  styleUrls: ['./detalle-alumno.component.css']
})
export class DetalleAlumnoComponent implements OnInit {
  
  @Input() alumno: Alumno;

  constructor( public modalService: ModalAlumnoService,
               private uploadService: FileUploadService ) { }

  ngOnInit(): void {
  }

  cerrarModal(): void {
    this.modalService.cerrarModal();
  }


  eliminarFirma(): void {
    this.uploadService.deleteFirmaAlumno( this.alumno._id )
          .subscribe( resp => {
            this.alumno = resp.alumno;
            this.modalService.notificarUpload.emit(this.alumno);
            Swal.fire({
              title: 'Guardado',
              text: `La foto del alumno ${ this.alumno.nombre } se ha eliminado con éxito`,
              icon: 'success'
            })
          })
  }

}

