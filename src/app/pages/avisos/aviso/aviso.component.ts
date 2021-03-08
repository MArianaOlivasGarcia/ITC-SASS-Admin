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

  public avisoForm: FormGroup;
  public avisoSeleccionado: Aviso;

  constructor( private fb: FormBuilder,
               private avisoService: AvisoService,
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

          let { titulo,
                  enlace,
                  descripcion } = aviso;
          this.avisoSeleccionado = aviso;
          if ( !enlace ) {
            enlace = '';
          }
          this.avisoForm.setValue({titulo, enlace, descripcion});
        });


  }


  guardar() {
    this.formSubmitted = true;
    if ( this.avisoForm.invalid ) { return; }

    const { titulo } = this.avisoForm.value;

    if ( this.avisoSeleccionado ) {
      // Actualizar
      const data = {
        ... this.avisoForm.value,
        _id: this.avisoSeleccionado._id
      };

      this.avisoService.actualizarAviso( data )
          .subscribe( () => {
            Swal.fire({
              title: 'Guardado',
              text: `Aviso ${titulo} actualizado con éxito.`,
              icon: 'success'
            });
          });

    } else {
      // Crear
      this.avisoService.crearAviso( this.avisoForm.value )
      .subscribe( resp => {
        Swal.fire({
          title: 'Creado',
          text: `Aviso ${titulo} creado con éxito.`,
          icon: 'success'
        });
        this.router.navigateByUrl(`/dashboard/aviso/${resp.aviso._id}`);
      });
    }

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
  

    
}
 