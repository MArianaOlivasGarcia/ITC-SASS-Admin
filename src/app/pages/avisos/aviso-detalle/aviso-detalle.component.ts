import { Component, Input, OnInit } from '@angular/core';
import { Aviso } from 'src/app/models/aviso.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalService } from 'src/app/services/modal-alumno.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aviso-detalle',
  templateUrl: './aviso-detalle.component.html',
  styles: [
  ]
})
export class AvisoDetalleComponent implements OnInit {

  constructor( public modalService: ModalService,
               public fileUploadService: FileUploadService ) { }

  @Input() aviso: Aviso;
  
  public fotoSubir: File;
  public fotoTemporal: any;
  

  ngOnInit(): void {
  }

  cerrarModal(): void {
    this.modalService.cerrarModal();
  }

  changeFoto( foto: File ): void{
    this.fotoSubir = foto;

    if ( !foto ) {
      this.fotoTemporal = null;
      return;
    }

    // Pasar la foto a base 64
    const reader = new FileReader();
    reader.readAsDataURL( foto );

    // Mostrar el url
    reader.onloadend = () => {
      this.fotoTemporal = reader.result;
    };

  }


  uploadFoto(): void {

    // TODO: EDITAR PORQUE ESE ES PARA USUARIOS
    this.fileUploadService.actualizarFoto( 'avisos', this.fotoSubir, this.aviso._id )
        .subscribe( resp => {
          this.aviso.foto = resp.nombreFoto;
          Swal.fire({
            title: 'Guardado',
            text: resp.message,
            icon: 'success'
          });
        }, err => {
          Swal.fire({
            title: 'Error',
            text: err.error.message,
            icon: 'error'
          });
        });

    }


}
