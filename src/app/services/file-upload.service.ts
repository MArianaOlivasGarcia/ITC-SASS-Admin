import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor( private http: HttpClient ) { }

  actualizarFoto( tipo: 'usuarios'|'avisos'|'alumnos', archivo: File,  id: string  ): Observable<any>{

    const url = `${ base_url }/upload/${tipo}/${ id }`;

    const formData: FormData = new FormData();
    formData.append('imagen', archivo, archivo.name );

    return this.http.put( url, formData, { reportProgress: true } )
              .pipe(
                catchError( error => of(false) )
              );

  }


  deleteFirmaAlumno( idAlumno: string ): Observable<any>{
    const url = `${ base_url }/upload/firma/${ idAlumno }`;
    return this.http.delete( url );
  }


}
