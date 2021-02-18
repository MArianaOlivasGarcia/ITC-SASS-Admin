import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Aviso } from '../models/aviso.model';
import { CargarAvisos } from '../interfaces/cargar-avisos.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})

export class AvisoService {

  constructor( private http: HttpClient ) { }

  getAvisosPaginados( desde: number = 0  ): Observable<any> {
    const url = `${ base_url }/aviso/all?desde=${ desde }`;

    return this.http.get<CargarAvisos>( url )
        .pipe(
          map( resp => {
            const avisos = resp.avisos.map(
                                    aviso => new Aviso(
                                    aviso.titulo,
                                    aviso.descripcion,
                                    aviso.foto,
                                    aviso.disponible,
                                    aviso.fecha_publicacion,
                                    aviso.enlace,
                                    aviso._id)
                                  );
            return {
              total: resp.total,
              avisos,
            };
          })
        );

  }

  getAviso( id: string ): Observable<any> {

    const url = `${ base_url }/aviso/${ id }`;
    return this.http.get( url )
        .pipe(
          map( (resp: { status: boolean, aviso: Aviso } ) => resp.aviso )
        );

  }

  crearAviso( aviso: Aviso ): Observable<any> {
    const url = `${ base_url }/aviso/create`;
    return this.http.post( url, aviso );
  }


  actualizarAviso( aviso: Aviso ): Observable<any> {
    const url = `${ base_url }/aviso/${ aviso._id }`;
    return this.http.put( url, aviso );
  }

  cambiarDisponible() {
    // TODO: 
  }

}
 