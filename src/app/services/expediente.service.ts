import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CargarItems } from '../interfaces/cargar-items.interface';
import { ItemExpediente } from '../models/item-expediente.model';


const base_url = environment.base_url;

 
@Injectable({
  providedIn: 'root'
})
export class ExpedienteService {

  constructor( private http: HttpClient ) { }

  getItemExpediente( id: string ): Observable<any> {
    const url = `${ base_url }/item/${ id }`;
    return this.http.get( url )
    .pipe(
      map( (resp: {status: boolean, item: ItemExpediente }) => resp.item )
    );
  }


  getAllByStatusAndCodigo( status: string, codigo: string, desde: number = 0): Observable<any> {

    const url = `${ base_url }/item/all/${status}/${codigo}?desde=${ desde }`;

    return this.http.get<CargarItems>( url )
        .pipe(
          map( resp => {
            const items = resp.items.map(
                                    item => new ItemExpediente(
                                      item.numero,
                                      item.expediente,
                                      item.titulo,
                                      item.codigo,
                                      item.archivoTemp,
                                      item.archivo,
                                      item.aceptado,
                                      item.rechazado,
                                      item.pendiente,
                                      item.disponible,
                                      item.entrante,
                                      item.proceso,
                                      item.iniciado,
                                      item.finalizado,
                                      item.reenvio_required,
                                      item.fecha_limite,
                                      item.fecha_entrega,
                                      item.fecha_aprobacion,
                                      item.error,
                                      item.alumno,
                                      item._id )
                                  );
            return {
              total: resp.total,
              items,
            };
          })
        );

  }


  aceptarDocumento( id: String): Observable<any> {
    const token = localStorage.getItem('accessToken') || '';
    const url = `${ base_url }/item/aceptar/${id}`;

    return this.http.put(url, null, {
      headers: {
        Authorization: `Bearer ${ token }`
      }
    })
  }

  rechazarDocumento( id: String, error: {motivo: string, observacion: string}): Observable<any> {
    const token = localStorage.getItem('accessToken') || '';
    const url = `${ base_url }/item/rechazar/${id}`;

    return this.http.put(url, error, {
      headers: {
        Authorization: `Bearer ${ token }`
      }
    })
  }

}
