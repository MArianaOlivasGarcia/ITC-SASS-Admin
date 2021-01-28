import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CargarSolicitudes } from '../interfaces/cargar-solicitudes.interface';
import { Solicitud } from '../models/solicitud-proyecto.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class SolicitudProyectoService {

  constructor( private http: HttpClient ) { }
 
  getSolicitudesByStatus( status: 'pendiente' | 'rechazado' | 'aceptado' ,desde: number = 0 ): Observable<any> {

    const url = `${ base_url }/solicitud/all/${status}?desde=${ desde }`;

    return this.http.get<CargarSolicitudes>( url )
        .pipe(
          map( resp => { 
            const solicitudes = resp.solicitudes.map(
                                    solicitud => new Solicitud(
                                      solicitud.alumno,
                                      solicitud.proyecto,
                                      solicitud.usuario_reviso,
                                      solicitud.inicio_servicio,
                                      solicitud.termino_servicio,
                                      solicitud.pendiente,
                                      solicitud.aceptado,
                                      solicitud.rechazado,
                                      solicitud.fecha_solicitud,
                                      solicitud.error,
                                      solicitud._id
                                    )
                                  );
            return {
              total: resp.total,
              solicitudes,
            };
          })
        );

  }


  getById( id: string ): Observable<any>{
    const url = `${ base_url }/solicitud/${id}`;
    return this.http.get( url )
      .pipe(
        map( (resp: { status: boolean, solicitud: Solicitud } ) => resp.solicitud )
      );
  }


  aceptarSolicitud( solicitud: Solicitud ): Observable<any> {
    const token = localStorage.getItem('accessToken') || '';
    const url = `${ base_url }/solicitud/aceptar/${solicitud._id}`;

    return this.http.put(url, solicitud, {
      headers: {
        Authorization: `Bearer ${ token }`
      }
    })
  }

  rechazarSolicitud( id: String, error: {motivo: string, observacion: string}): Observable<any> {
    const token = localStorage.getItem('accessToken') || '';
    const url = `${ base_url }/solicitud/rechazar/${id}`;

    return this.http.put(url, error, {
      headers: {
        Authorization: `Bearer ${ token }`
      }
    })
  }

}
