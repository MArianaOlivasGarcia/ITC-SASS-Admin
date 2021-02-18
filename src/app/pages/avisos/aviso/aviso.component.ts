import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Aviso } from 'src/app/models/aviso.model';
import { AvisoService } from 'src/app/services/aviso.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aviso',
  templateUrl: './aviso.component.html',
  styleUrls: ['./aviso.component.css']
})
export class AvisoComponent implements OnInit {

  public formSubmitted = false;

  public fotoSubir: File;
  public fotoTemporal: any;
  
  public avisoForm: FormGroup;
  public avisoSeleccionado: Aviso;

  constructor( private fb: FormBuilder,
               private avisoService: AvisoService,
               private fileUploadService: FileUploadService,
               private router: Router,
               private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {
    
    this.activatedRoute.params.subscribe( ({ id }) => {
      this.cargarAviso( id );
    });


    this.avisoForm = this.fb.group({
      titulo: ['', Validators.required ],
      descripcion: ['', Validators.required ],
      enlace: ['']
    });

  }

  cargarAviso( id: string ) {

    if ( id === 'nuevo' ) { return; }

    this.avisoService.getAviso( id )
        .subscribe( aviso => {
          console.log(aviso)
          // TODO: SI NO ENCUENTRA LA DEPENDENCIA O EL ENLACE ES INVENTADO
          //  return this.router.navigateByUrl(`/dashboard/dependencias`);

          const { titulo,
                  /* enlace, */
                  descripcion } = aviso;
          this.avisoSeleccionado = aviso;
          this.avisoForm.setValue({titulo, enlace: 'Hola', descripcion});
        });


  }


  guardar() {

  }

  campoNoValido( campo: string ): boolean {


    if ( this.avisoForm.get(campo)?.invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }

  }


  mensajesError( campo: string  ): string {

    return this.avisoForm.get(campo)?.hasError('required') ? `Este campo es requerido.` : '';
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
    this.fileUploadService.actualizarFoto( 'avisos', this.fotoSubir, this.avisoSeleccionado._id )
        .subscribe( resp => {
          this.avisoSeleccionado.foto = resp.nombreFoto;
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
 