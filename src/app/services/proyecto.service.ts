import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CargarProyectos } from '../interfaces/cargar-proyectos.interface';
import { Proyecto } from '../models/proyecto.models';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  constructor( private http: HttpClient ) { }

  getProyectos( desde: number = 0 ): Observable<any> {

    const url = `${ base_url }/proyecto/all?desde=${ desde }`;

    return this.http.get<CargarProyectos>( url )
        .pipe(
          map( resp => {
            const proyectos = resp.proyectos.map(
                                    proyecto => new Proyecto(
                                      proyecto.apoyo_economico,
                                      proyecto.nombre,
                                      proyecto.dependencia,
                                      proyecto.objetivo,
                                      proyecto.actividades,
                                      proyecto.periodo,
                                      proyecto.lugar,
                                      proyecto.modalidad,
                                      proyecto.horario,
                                      proyecto.tipo,
                                      proyecto.responsable,
                                      proyecto.carreras,
                                      proyecto._id )
                                  );
            return {
              /* total: resp.total, */
              proyectos,
            };
          })
        );

  }

  getProyecto( id: string ): Observable<any> {

    const url = `${ base_url }/proyecto/${ id }`;
    return this.http.get( url )
        .pipe(
          map( (resp: { status: boolean, proyecto: Proyecto } ) => resp.proyecto )
        );

  }


  crearProyecto( proyecto: Proyecto ): Observable<any> {
    const url = `${ base_url }/proyecto/create`;
    return this.http.post( url, proyecto );
  }

  actualizarProyecto( proyecto: Proyecto ): Observable<any> {
    const url = `${ base_url }/proyecto/${ proyecto._id }`;
    return this.http.put( url, proyecto );
  }

}
