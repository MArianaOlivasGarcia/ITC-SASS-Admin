import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ChangePasswordForm } from '../interfaces/change-password-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { Usuario } from '../models/usuario.model';
import { WebSocketService } from './websocket.service';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public usuario: Usuario;

  constructor( private http: HttpClient,
               private router: Router,
               private wsService: WebSocketService ) { }


  get token(): string {
    return localStorage.getItem('accessToken') || '';
  }

  get id(): string {
    return this.usuario._id || '';
  }

  validarToken(): Observable<boolean> {

    const token = localStorage.getItem('accessToken') || '';

    return this.http.get(`${ base_url }/auth/renovar`, {
      headers: {
        Authorization: `Bearer ${ token }`
      }
    }).pipe(
      tap( (resp: any) => {

        localStorage.setItem('accessToken', resp.accessToken );
        localStorage.setItem('menu', JSON.stringify(resp.menu) );
        const { nombre, username, foto, role, _id, gestion, online } = resp.user;
        this.usuario = new Usuario( nombre, username, foto, role, _id, gestion, '', online );
        console.log(this.usuario);
      }),
      map( resp => true ), // of permite crear un observable
      catchError( error => of(false) )
    );
  }




  login( formData: LoginForm ): Observable<any>{
    this.wsService.conectar();
    return this.http.post(`${ base_url }/auth/login`, formData )
                  .pipe(
                    tap( (resp: any) => {
                      localStorage.setItem('accessToken', resp.accessToken );
                      localStorage.setItem('menu', JSON.stringify(resp.menu) );
                    })
                  );
  }




  register( formData: RegisterForm ): Observable<any>{
    return this.http.post(`${ base_url }/auth/register`, formData );
  }




  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('menu');
    this.router.navigateByUrl('/login');
    this.wsService.desconectar();
  }




  changePassword( formData: ChangePasswordForm ): Observable<any> {
    const token = localStorage.getItem('accessToken') || '';
    return this.http.put(`${ base_url }/auth/password`, formData, {
      headers: {
        Authorization: `Bearer ${ token }`
      }
    });
  }


}
