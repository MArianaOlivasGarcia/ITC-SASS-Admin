import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
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
                                  carrera.siglas,
                                  carrera._id) );
          return carreras;
        })
      );

  }


}
