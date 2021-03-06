import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private authService: AuthService,
               private router: Router ){}


  canActivate(): Observable<boolean> {

    // Hace la peticion, se suscribe y si es true lo deja pasar
    return this.authService.validarToken()
    .pipe(
     tap( estaAutenticado => {

       if ( !estaAutenticado ) {
         this.router.navigateByUrl('/login');
       }
     })
    );

  }

}
