import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CargarUsuarios } from '../interfaces/cargar-usuarios.interface';
import { RenewPasswordForm } from '../interfaces/renew-password-form.interface';
import { Usuario } from '../models/usuario.model';


const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient ) { }

  getUsuarios( desde: number = 0 ): Observable<any> {

    const token = localStorage.getItem('accessToken') || '';
    const url = `${ base_url }/usuario/all?desde=${ desde }`;

    return this.http.get<CargarUsuarios>( url, {
      headers: {
        Authorization: `Bearer ${ token }`
      }
    }).pipe(
          map( resp => {
            const usuarios = resp.usuarios.map(
                                    usuario => new Usuario(
                                    usuario.nombre,
                                    usuario.username,
                                    usuario.foto,
                                    usuario.role,
                                    usuario._id,
                                    usuario.gestion,
                                    '',
                                    usuario.online )
                                  );
            return {
              total: resp.total,
              usuarios,
            };
          })
        );

  }



  getUsuario( id: string ): Observable<any> {

    const url = `${ base_url }/usuario/${ id }`;
    return this.http.get( url )
        .pipe(
          map( (resp: { status: boolean, usuario: Usuario } ) => resp.usuario )
        );

  }



  actualizarUsuario( usuario: Usuario ): Observable<any> {
    const url = `${ base_url }/usuario/${ usuario._id }`;
    return this.http.put( url, usuario );
  }

  renewPassword( idUsuario: string, formData: RenewPasswordForm ): Observable<any> {
    return this.http.put(`${ base_url }/usuario/password/${ idUsuario }`, formData );
  }

}
