import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CarreraService } from 'src/app/services/carrera.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Carrera } from 'src/app/models/carrera.model';
import { Usuario } from 'src/app/models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  public formSubmitted = false;
  public formSubmitted2 = false;

  public usuarioForm: FormGroup;
  public renovarForm: FormGroup;

  public usuarioSeleccionado: Usuario;
  public carreras: Carrera[] = [];

  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private carreraService: CarreraService,
               private router: Router,
               private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {

    this.cargarCarreras();

    this.activatedRoute.params.subscribe( ({ id }) => {
      this.cargarUsuario( id );
    });


    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required ],
      username: ['', Validators.required ],
      role: ['', Validators.required ],
      gestion: ['', Validators.required ],
    });

    // tslint:disable: deprecation
    this.renovarForm = this.fb.group({
      password: ['', Validators.required ],
      confirm_password: ['', Validators.required ]
    }, {
      validators: this.passwordsIguales('password' , 'confirm_password')
    });

  }


  cargarCarreras(): void {
    this.carreraService.getCarreras()
          .subscribe( carreras =>
            this.carreras = carreras
          );
  }


  cargarUsuario( id: string ): void{

    this.usuarioService.getUsuario( id )
        .subscribe( usuario => {
          // TODO: SI NO ENCUENTRA EL USUARIO O EL ENLACE ES INVENTADO
          // return this.router.navigateByUrl(`/dashboard/usuarios`);
          const { nombre, username, role, gestion } = usuario;
          this.usuarioSeleccionado = usuario;
          this.usuarioForm.setValue({nombre, username, role, gestion });
        });

  }


  guardar(): void {

    this.formSubmitted = true;
    this.formSubmitted2 = false;

    if ( this.usuarioForm.invalid ) { return; }

    const { nombre } = this.usuarioForm.value;


    if ( this.usuarioSeleccionado ) {
      // Actualizar
      const data = {
        ... this.usuarioForm.value,
        _id: this.usuarioSeleccionado._id
      };

      this.usuarioService.actualizarUsuario( data )
          .subscribe( () => {
            Swal.fire({
              title: 'Guardado',
              text: `Usuario ${nombre} actualizado con éxito.`,
              icon: 'success'
            });
          });

    }

  }


  renovarPassword(): void {

    this.formSubmitted = false;
    this.formSubmitted2 = true;
    if ( this.renovarForm.invalid ) { return; }

    const { _id } = this.usuarioSeleccionado;

    this.usuarioService.renewPassword( _id , this.renovarForm.value )
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

    return formGroup === this.usuarioForm && formGroup.get(campo)?.invalid && this.formSubmitted ? true :
           formGroup === this.renovarForm && formGroup.get(campo)?.invalid && this.formSubmitted2 ? true : false;

  }

  mensajesError( formGroup: FormGroup, campo: string  ): string {
    return formGroup.get(campo)?.hasError('required') ? `Este campo es requerido.` :
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

}
