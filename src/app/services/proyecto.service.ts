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

  getProyectosByTipoAndPeriodo( desde: number = 0, tipo: 'publico' | 'personal', periodo: string ): Observable<any> {
    const url = `${ base_url }/proyecto/all/${ tipo }/${ periodo }?desde=${ desde }`;
    return this.http.get<CargarProyectos>( url )
      .pipe(
        map( resp => {
          const proyectos = resp.proyectos.map(
                                  proyecto => new Proyecto(
                                  proyecto.apoyo_economico,
                                  proyecto.instalacion,
                                  proyecto.nombre,
                                  proyecto.dependencia,
                                  proyecto.objetivo,
                                  proyecto.actividades,
                                  proyecto.tipo_actividades,
                                  proyecto.periodo,
                                  proyecto.fecha_inicial,
                                  proyecto.fecha_limite,
                                  proyecto.lugar_desempeno,
                                  proyecto.modalidad,
                                  proyecto.horario,
                                  proyecto.tipo,
                                  proyecto.responsable,
                                  proyecto.puesto_responsable,
                                  proyecto.email_responsable,
                                  proyecto.telefono_responsable,
                                  proyecto.carreras,
                                  proyecto.publico,
                                  proyecto.alumno,
                                  proyecto._id,
                                  proyecto.adoptado )
                                );
          return {
            total: resp.total,
            proyectos,
          };
        })
      );

  }

  getProyecto( id: string ): Observable<any> {
    const url = `${ base_url }/proyecto/${ id }`;
    return this.http.get( url );
  }

  crearProyecto( proyecto: Proyecto ): Observable<any> {
    const url = `${ base_url }/proyecto/create`;
    return this.http.post( url, proyecto );
  }

  actualizarProyecto( proyecto: Proyecto ): Observable<any> {
    const url = `${ base_url }/proyecto/${ proyecto._id }`;
    return this.http.put( url, proyecto );
  }

  duplicarProyecto( id: string ): Observable<any> {
    const url = `${ base_url }/proyecto/duplicar/${ id }`;
    return this.http.get( url )
      .pipe(
        map( (resp: {status: boolean, proyecto: Proyecto}) => resp.proyecto )
      );
  }


  adoptarProyecto( id: string ): Observable<any> {
    const url = `${ base_url }/proyecto/adoptar/${ id }`;
    return this.http.get( url )
      .pipe(
        map( (resp: {status: boolean, proyecto: Proyecto}) => resp.proyecto )
      );
  }


}
