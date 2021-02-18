import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CargarPeriodos } from '../interfaces/cargar-periodos.interface';
import { Periodo } from '../models/periodo.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PeriodoService {

  constructor( private http: HttpClient  ) { }


  getPeriodos(): Observable<any> {

    return this.http.get(`${base_url}/periodo/all`)
      .pipe(
        map( (resp: { status: boolean, periodos: Periodo[] } ) => {
          const periodos = resp.periodos.map(
                                  periodo => new Periodo(
                                  periodo.fecha_inicio,
                                  periodo.fecha_termino,
                                  periodo.nombre,
                                  periodo.isActual,
                                  periodo.isProximo,
                                  periodo.recepcion_solicitudes,
                                  periodo.apertura_expedientes,
                                  periodo._id) );
          return periodos;
        })
      );
 
  }


  getPeriodosPaginados( desde: number = 0  ): Observable<any> {
    const url = `${ base_url }/periodo/all/paginados?desde=${ desde }`;

    return this.http.get<CargarPeriodos>( url )
        .pipe(
          map( resp => {
            const periodos = resp.periodos.map(
                                    periodo => new Periodo(
                                    periodo.fecha_inicio,
                                    periodo.fecha_termino,
                                    periodo.nombre,
                                    periodo.isActual,
                                    periodo.isProximo,
                                    periodo.recepcion_solicitudes,
                                    periodo.apertura_expedientes,
                                    periodo._id )
                                  );
            return {
              total: resp.total,
              periodos,
            };
          })
        );
  }


  getPeriodo( id: string ): Observable<any> {

    const url = `${ base_url }/periodo/${ id }`;
    return this.http.get( url )
        .pipe(
          map( (resp: { status: boolean, periodo: Periodo } ) => resp.periodo )
        );

  }

  crearPeriodo( periodo: Periodo ): Observable<any> {
    const url = `${ base_url }/periodo/create`;
    return this.http.post( url, periodo );
  }


  actualizarPeriodo( periodo: Periodo ): Observable<any> {
    const url = `${ base_url }/periodo/${ periodo._id }`;
    return this.http.put( url, periodo );
  }

}
