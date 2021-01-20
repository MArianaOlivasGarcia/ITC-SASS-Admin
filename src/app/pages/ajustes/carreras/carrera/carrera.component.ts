import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Carrera } from 'src/app/models/carrera.model';
import { CarreraService } from 'src/app/services/carrera.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carrera',
  templateUrl: './carrera.component.html',
  styleUrls: ['./carrera.component.css']
})
export class CarreraComponent implements OnInit {
 
  public formSubmitted = false;
 
  public carreraForm: FormGroup;
  public carreraSeleccionada: Carrera;

  constructor( private fb: FormBuilder,
               private carreraService: CarreraService,
               private router: Router,
               private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe( ({ id }) => {
      this.cargarCarrera( id );
    });


    this.carreraForm = this.fb.group({
      nombre: ['', Validators.required ]
    });

  }

  cargarCarrera( id: string ): void{

    if ( id === 'nuevo' ) { return; }


    this.carreraService.getCarrera( id )
        .subscribe( carrera => {

          // TODO: SI NO ENCUENTRA LA DEPENDENCIA O EL ENLACE ES INVENTADO
          //  return this.router.navigateByUrl(`/dashboard/dependencias`);

          const { nombre } = carrera;
          this.carreraSeleccionada = carrera;
          this.carreraForm.setValue({nombre});
        });

  }

  guardar(): void {
    this.formSubmitted = true;
    if ( this.carreraForm.invalid ) { return; }

    const { nombre } = this.carreraForm.value;
    
    if ( this.carreraSeleccionada ) {
      // Actualizar
      const data = {
        ... this.carreraForm.value,
        _id: this.carreraSeleccionada._id
      };

      this.carreraService.actualizarCarrera( data )
          .subscribe( () => {
            Swal.fire({
              title: 'Guardado',
              text: `Carrera ${nombre} actualizado con éxito.`,
              icon: 'success'
            });
          });

    } else {
      // Crear
      this.carreraService.crearCarrera( this.carreraForm.value )
      .subscribe( resp => {
        Swal.fire({
          title: 'Creado',
          text: `Carrera ${nombre} creada con éxito.`,
          icon: 'success'
        });
        this.router.navigateByUrl(`/dashboard/ajustes/carrera/${resp.carrera._id}`);
      });
    }

  }


  campoNoValido( campo: string ): boolean {


    if ( this.carreraForm.get(campo)?.invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }

  }


  mensajesError( campo: string  ): string {

    return this.carreraForm.get(campo)?.hasError('required') ? `Este campo es requerido.` : '';
  }

}
