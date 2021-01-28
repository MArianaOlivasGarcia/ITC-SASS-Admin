import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CargarAlumnos } from '../interfaces/cargar-alumnos.interface';
import { RenewPasswordForm } from '../interfaces/renew-password-form.interface';
import { Alumno } from '../models/alumno.model';


const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  constructor(private http: HttpClient ) { }


  crearAlumno( alumno: Alumno ): Observable<any> {
    const url = `${ base_url }/alumno/register`;
    return this.http.post( url, alumno );
  }

  actualizarAlumno( alumno: Alumno ): Observable<any> {
    const url = `${ base_url }/alumno/${ alumno._id }`;
    return this.http.put( url, alumno );
  }


  getAlumnos( desde: number = 0 ): Observable<any> {

    const url = `${ base_url }/alumno/all?desde=${ desde }`;

    return this.http.get<CargarAlumnos>( url )
        .pipe(
          map( resp => {
            const alumnos = resp.alumnos.map(
                                    alumno => new Alumno(
                                    alumno.numero_control,
                                    alumno.nombre,
                                    alumno.apellido_paterno,
                                    alumno.apellido_materno,
                                    alumno.sexo,
                                    alumno.fecha_nacimiento,
                                    alumno.edad,
                                    alumno.carrera,
                                    alumno.creditos_acumulados,
                                    alumno.porcentaje_avance,
                                    alumno.periodo_ingreso,
                                    alumno.expediente,
                                    alumno._id,
                                    alumno.semestre,
                                    alumno.foto,
                                    alumno.firma,
                                    alumno.email,
                                    alumno.telefono,
                                    alumno.domicilio,
                                    alumno.numero_seguro));
            return {
              total: resp.total,
              alumnos,
            };
          })
        );

  }



  getAlumno( id: string ): Observable<any> {

    const url = `${ base_url }/alumno/${ id }`;
    return this.http.get( url )
        .pipe(
          map( (resp: { status: boolean, alumno: Alumno } ) => resp.alumno )
        );

  }



  renewPassword( idAlumno: string, formData: RenewPasswordForm ): Observable<any> {
    return this.http.put(`${ base_url }/alumno/renewpassword/${ idAlumno }`, formData );
  }

}
