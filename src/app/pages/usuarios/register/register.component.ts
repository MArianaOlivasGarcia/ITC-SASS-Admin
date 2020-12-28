import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Carrera } from 'src/app/models/carrera.model';
import { AuthService } from 'src/app/services/auth.service';
import { CarreraService } from 'src/app/services/carrera.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public formSubmitted = false;
  public carreras: Carrera[] = [];

  public registerForm: FormGroup;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private carreraService: CarreraService,
               private router: Router ) { }

  ngOnInit(): void {

    this.cargarCarreras();

    // TODO: Verificar deprecated
    // tslint:disable: deprecation
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required ],
      username: ['', Validators.required ],
      role: ['', Validators.required ],
      gestion: ['', Validators.required ],
      password: ['', [ Validators.required, Validators.minLength(6) ] ],
      confirm_password: ['', [ Validators.required,  Validators.minLength(6) ] ],
    }, {
      validators: this.passwordsIguales('password' , 'confirm_password')
    });


  }


  cargarCarreras(): void {

    this.carreraService.getCarreras()
        .subscribe( carreras => this.carreras = carreras );

  }


  guardar(): void {

    this.formSubmitted = true;
    if ( this.registerForm.invalid ) { return; }

    const { username } = this.registerForm.value;


    this.authService.register( this.registerForm.value )
        .subscribe( resp => {
          Swal.fire({
            title: 'Creado',
            text: `Usuario ${username} registrado con éxito.`,
            icon: 'success'
          });
          this.router.navigateByUrl(`/dashboard/usuario/${resp.usuario._id}`);
        });

  }



  campoNoValido( campo: string ): boolean {


    if ( this.registerForm.get(campo)?.invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }

  }



  mensajesError( campo: string  ): string {

    return this.registerForm.get(campo)?.hasError('required') ? `Este campo es requerido.` :
           this.registerForm.get(campo)?.hasError('minlength') ? `Mínimo 6 caracteres.` :
           this.registerForm.get(campo)?.hasError('noIgual') ? `Las contraseñas no coinciden.` : '';
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


}
