import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Dependencia } from 'src/app/models/dependencia.model';
import { DependenciaService } from 'src/app/services/dependencia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dependencia',
  templateUrl: './dependencia.component.html',
  styleUrls: ['./dependencia.component.css']
})
export class DependenciaComponent implements OnInit {
 
  public formSubmitted = false;
  
  public dependenciaForm: FormGroup;
  public dependenciaSeleccionada: Dependencia;

  constructor( private fb: FormBuilder,
               private dependenciaService: DependenciaService,
               private router: Router,
               private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe( ({ id }) => {
      this.cargarDependencia( id );
    });


    this.dependenciaForm = this.fb.group({
      nombre: ['', Validators.required ],
      representante_legal: ['', Validators.required ],
      domicilio: ['', Validators.required ],
      email: ['', [Validators.required, Validators.email] ],
      telefono: ['', Validators.required ],
    });

  }


  cargarDependencia( id: string ): void{

    if ( id === 'nuevo' ) { return; }


    this.dependenciaService.getDependencia( id )
        .subscribe( dependencia => {

          // TODO: SI NO ENCUENTRA LA DEPENDENCIA O EL ENLACE ES INVENTADO
          //  return this.router.navigateByUrl(`/dashboard/dependencias`);

          const { nombre, representante_legal, domicilio, email, telefono } = dependencia;
          this.dependenciaSeleccionada = dependencia;
          this.dependenciaForm.setValue({nombre, 
                    representante_legal,
                    domicilio, 
                    email,
                    telefono});
        });

  }



  guardar(): void {

    this.formSubmitted = true;
    if ( this.dependenciaForm.invalid ) { return; }

    const { nombre } = this.dependenciaForm.value;


    if ( this.dependenciaSeleccionada ) {
      // Actualizar
      const data = {
        ... this.dependenciaForm.value,
        _id: this.dependenciaSeleccionada._id
      };

      this.dependenciaService.actualizarDependencia( data )
          .subscribe( () => {
            Swal.fire({
              title: 'Guardado',
              text: `Dependencia ${nombre} actualizada con éxito.`,
              icon: 'success'
            });
          });

    } else {
      // Crear
      this.dependenciaService.crearDependencia( this.dependenciaForm.value )
      .subscribe( resp => {
        Swal.fire({
          title: 'Creado',
          text: `Dependencia ${nombre} creada con éxito.`,
          icon: 'success'
        });
        this.router.navigateByUrl(`/dashboard/dependencia/${resp.dependencia._id}`);
      });
    }


  }


  campoNoValido( campo: string ): boolean {


    if ( this.dependenciaForm.get(campo)?.invalid && this.formSubmitted ) {
      return true;
    } else {
      return false; 
    }

  }


  mensajesError( campo: string  ): string {

    return this.dependenciaForm.get(campo)?.hasError('required') ? `Este campo es requerido.` :
           this.dependenciaForm.get(campo)?.hasError('email') ? `Correo electrónico no valido.` : '';
  }

}
