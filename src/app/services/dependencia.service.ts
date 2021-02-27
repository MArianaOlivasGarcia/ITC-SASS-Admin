import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CargarDependencias } from '../interfaces/cargar-dependencias.interface';
import { Dependencia } from '../models/dependencia.model';

 
const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class DependenciaService {

  constructor( private http: HttpClient ) { }



  getDependencias(): Observable<any> {


    return this.http.get(`${base_url}/dependencia/all`)
      .pipe(
        map( (resp: { status: boolean, dependencias: Dependencia[] } ) => {
          const dependencias = resp.dependencias.map(
                                  dependencia => new Dependencia(
                                    dependencia.nombre,
                                    dependencia.representante_legal,
                                    dependencia.domicilio,
                                    dependencia.email,
                                    dependencia._id ) );
          return dependencias;
        })
      );

  }


  getDependenciasPaginadas( desde: number = 0 ): Observable<any> {

    const url = `${ base_url }/dependencia/all/paginados?desde=${ desde }`;

    return this.http.get<CargarDependencias>( url )
        .pipe(
          map( resp => {
            const dependencias = resp.dependencias.map(
                                    dependencia => new Dependencia(
                                    dependencia.nombre,
                                    dependencia.representante_legal,
                                    dependencia.domicilio,
                                    dependencia.email,
                                    dependencia._id )
                                  );
            return {
              total: resp.total,
              dependencias,
            };
          })
        );

  }


  getDependencia( id: string ): Observable<any> {

    const url = `${ base_url }/dependencia/${ id }`;
    return this.http.get( url )
        .pipe(
          map( (resp: { status: boolean, dependencia: Dependencia } ) => resp.dependencia )
        );

  }


  crearDependencia( dependencia: Dependencia ): Observable<any> {
    const url = `${ base_url }/dependencia/create`;
    return this.http.post( url, dependencia );
  }


  actualizarDependencia( dependencia: Dependencia ): Observable<any> {
    const url = `${ base_url }/dependencia/${ dependencia._id }`;
    return this.http.put( url, dependencia );
  }


}
