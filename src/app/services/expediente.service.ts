import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
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


  getAllByCodigo( codigo: string ): Observable<any> {
    const url = `${ base_url }/item/all/${ codigo }`;
    return this.http.get( url );
  }

}
