import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CargarCarreras } from '../interfaces/cargar-carreras.interface';
import { Carrera } from '../models/carrera.model';


const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class CarreraService {

  constructor( private http: HttpClient ) { }

  getCarreras(): Observable<any> {

    return this.http.get(`${base_url}/carrera/all`)
      .pipe(
        map( (resp: { status: boolean, carreras: Carrera[] } ) => {
          const carreras = resp.carreras.map(
                                  carrera => new Carrera(
                                  carrera.nombre,
                                  carrera._id) );
          return carreras;
        })
      );

  }


  getCarrerasPaginadas( desde: number = 0  ): Observable<any> {
    const url = `${ base_url }/carrera/all/paginados?desde=${ desde }`;

    return this.http.get<CargarCarreras>( url )
        .pipe(
          map( resp => {
            const carreras = resp.carreras.map(
                                    carrera => new Carrera(
                                   carrera.nombre,
                                    carrera._id )
                                  );
            return {
              total: resp.total,
              carreras,
            };
          })
        );
  }


  getCarrera( id: string ): Observable<any> {

    const url = `${ base_url }/carrera/${ id }`;
    return this.http.get( url )
        .pipe(
          map( (resp: { status: boolean, carrera: Carrera } ) => resp.carrera )
        );

  }

  crearCarrera( carrera: Carrera ): Observable<any> {
    const url = `${ base_url }/carrera/create`;
    return this.http.post( url, carrera );
  }


  actualizarCarrera( carrera: Carrera ): Observable<any> {
    const url = `${ base_url }/carrera/${ carrera._id }`;
    return this.http.put( url, carrera );
  }



}
