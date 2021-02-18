import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Alumno } from 'src/app/models/alumno.model';
import { Carrera } from 'src/app/models/carrera.model';
import { Periodo } from 'src/app/models/periodo.model';
import { AlumnoService } from 'src/app/services/alumno.service';
import { CarreraService } from 'src/app/services/carrera.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.component.html', 
  styleUrls: ['./alumno.component.css']
})
export class AlumnoComponent implements OnInit {

  public formSubmitted = false;
  public formSubmitted2 = false;

  public alumnoForm: FormGroup;
  public renovarForm: FormGroup;

  public alumnoSeleccionado: Alumno;
  public carreras: Carrera[] = [];
  public periodos: Periodo[] = [];

  constructor(  private fb: FormBuilder,
                private alumnoService: AlumnoService,
                private carreraService: CarreraService,
                private periodoService: PeriodoService,
                private router: Router,
                private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {

    this.cargarCarreras(); 
    this.cargarPeriodos();

    this.activatedRoute.params.subscribe( ({ id }) => {
      this.cargarAlumno( id );
    });
 

    this.alumnoForm = this.fb.group({
      nombre: ['', Validators.required ],
      apellido_paterno: ['', Validators.required ],
      apellido_materno: ['', Validators.required ],
      sexo: ['', Validators.required ],
      fecha_nacimiento: ['', Validators.required ],
      numero_control: ['',[Validators.required, Validators.maxLength(8), Validators.minLength(8) ] ],
      carrera: ['', [Validators.required] ],
      creditos_acumulados: ['', [Validators.required ] ],
      periodo_ingreso: ['', [Validators.required ] ],
      porcentaje_avance: [''],
      semestre: [''],
    }, {
      validators: this.numControlValido('numero_control')
    });

    this.renovarForm = this.fb.group({
      password: ['', Validators.required ],
      confirm_password: ['', Validators.required ]
    }, {
      validators: this.passwordsIguales('password' , 'confirm_password')
    });


  }


  cargarCarreras(): void {
    this.carreraService.getCarreras()
          .subscribe( carreras => {
            this.carreras = carreras
          });
  }


  cargarPeriodos(): void {
    this.periodoService.getPeriodos()
          .subscribe( periodos =>
            this.periodos = periodos
          );
  }


  cargarAlumno( id: string ): void{

    if ( id === 'nuevo' ) { return; }

    this.alumnoService.getAlumno( id )
        .subscribe( alumno => {

          // TODO: SI NO ENCUENTRA EL ALUMNO O EL ENLACE ES INVENTADO
          //  return this.router.navigateByUrl(`/dashboard/dependencias`);

          const { numero_control,
                  nombre,
                  apellido_paterno,
                  apellido_materno,
                  sexo,
                  fecha_nacimiento,
                  carrera: { _id },
                  semestre,
                  creditos_acumulados,
                  porcentaje_avance,
                  periodo_ingreso } = alumno;
          this.alumnoSeleccionado = alumno;
          this.alumnoForm.setValue({ numero_control,
                                     nombre,
                                     apellido_paterno,
                                     apellido_materno,
                                     sexo,
                                     fecha_nacimiento,
                                     carrera: _id,
                                     semestre,
                                     creditos_acumulados,
                                     porcentaje_avance,
                                     periodo_ingreso });
        });

  }



  guardar(): void {

    this.formSubmitted = true;
    this.formSubmitted2 = false;
    if ( this.alumnoForm.invalid ) { return; }

    const { nombre } = this.alumnoForm.value;

    if ( this.alumnoSeleccionado ) {
      // Actualizar
      const data = {
        ... this.alumnoForm.value,
        _id: this.alumnoSeleccionado._id
      };

      this.alumnoService.actualizarAlumno( data )
          .subscribe( () => {
            Swal.fire({
              title: 'Guardado',
              text: `Alumno ${nombre} actualizado con éxito.`,
              icon: 'success'
            });
          });

    } else {
      // CREAR ALUMNO
      this.alumnoService.crearAlumno( this.alumnoForm.value )
      .subscribe( resp => {
        Swal.fire({
          title: 'Creado',
          text: `Alumno ${nombre} creado con éxito.`,
          icon: 'success'
        });
        this.router.navigateByUrl(`/dashboard/alumno/${resp.alumno._id}`);
      });

    }


  }

  renovarPassword(): void {

    this.formSubmitted = false;
    this.formSubmitted2 = true;
    if ( this.renovarForm.invalid ) { return; }

    const { _id } = this.alumnoSeleccionado;

    this.alumnoService.renewPassword( _id , this.renovarForm.value )
          .subscribe( resp => {
            Swal.fire({
              title: 'Guardado',
              text: `${ resp.message }`,
              icon: 'success'
            });
            this.formSubmitted2 = false;
            this.renovarForm.reset();
          });

  }


  campoNoValido( formGroup: FormGroup, campo: string ): boolean {
    return formGroup === this.alumnoForm && formGroup.get(campo)?.invalid && this.formSubmitted ? true :
           formGroup === this.renovarForm && formGroup.get(campo)?.invalid && this.formSubmitted2 ? true : false;
  }

  mensajesError( formGroup: FormGroup, campo: string  ): string {
    return formGroup.get(campo)?.hasError('required') ? `Este campo es requerido.` :
            formGroup.get(campo)?.hasError('maxlength') ? `Máximo 8 caracteres.` :
            formGroup.get(campo)?.hasError('minlength') ? `Mínimo 8 caracteres.` :
            formGroup.get(campo)?.hasError('noNumCtl') ? `No es un número de control válido.` :
           formGroup.get(campo)?.hasError('noIgual') ? `Las contraseñas no coinciden.` : '';
  }


  passwordsIguales( pass1: string, pass2: string ): any  {

    return ( formGroup: FormGroup ) => {

      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);

      // Si son iguales no hay error -> null
      if ( pass1Control.value === pass2Control.value ) {
        pass2Control.setErrors(null);
      } else {
        // Si no son iguales
        pass2Control.setErrors({ noIgual: true });
      }

    };


  }


  changeNumeroControl( numeroControl: string ) {

    if ( numeroControl.length != 4 ){ return; }
    
    const numero_control = numeroControl.slice(2,4);
     
    if ( numero_control.indexOf('53') !== -1 ) {
      console.log('Es válido')
    } else {
      console.log('No válido')
    }

  }


  numControlValido( numeroControl: string ) {

    return ( formGroup: FormGroup ) => {

      const numeroControlControl = formGroup.get(numeroControl)
      const valor = numeroControlControl.value;
      
      if ( valor.length < 4 ) { return; }
      
      const numero_control = valor.slice(2,4);

      if ( numero_control.indexOf('53') === -1 ) {
        numeroControlControl.setErrors({noNumCtl: true});
      }

    };

 
  }

}
