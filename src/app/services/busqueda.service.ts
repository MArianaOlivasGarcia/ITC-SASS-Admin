import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Alumno } from '../models/alumno.model';
import { Dependencia } from '../models/dependencia.model';
import { Proyecto } from '../models/proyecto.models';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedaService {

  constructor( private http: HttpClient ) { }


  get token(): string {
    return localStorage.getItem('token') || '';
  }


  private transformarDependencias( resultados: any[] ): Dependencia[] {
    return resultados.map(
      dep => new Dependencia( dep.nombre,
                              dep.representante_legal,
                              dep.domicilio,
                              dep.email,
                              dep.id ));
  }


  private transformarUsuarios( resultados: any[] ): Usuario[] {
    return resultados.map(
      usuario => new Usuario( usuario.nombre,
                              usuario.username,
                              usuario.foto,
                              usuario.role,
                              usuario.id,
                              usuario.gestion,
                              '',
                              usuario.online ));
  }


  private transformarAlumnos( resultados: any[] ): Alumno[] {
    return resultados.map(
      alumno => new Alumno( alumno.numero_control,
                            alumno.nombre,
                            alumno.apellido_paterno,
                            alumno.apellido_materno,
                            alumno.sexo,
                            alumno.fecha_nacimiento,
                            alumno.carrera,
                            alumno.semestre,
                            alumno.creditos_acumulados,
                            alumno._id,
                            alumno.foto,
                            alumno.email,
                            alumno.telefono,
                            alumno.domicilio,
                            alumno.numero_seguro ));
  }

  private transformarProyectos( resultados: any[] ): Proyecto[] {
    return resultados.map(
      proyecto => new Proyecto( proyecto.apoyo_economico,
                                proyecto.nombre,
                                proyecto.dependencia,
                                proyecto.carreras,
                                proyecto.objetivo,
                                proyecto.actividades,
                                proyecto.periodo,
                                proyecto.lugar,
                                proyecto.modalidad,
                                proyecto.horario,
                                proyecto.tipo,
                                proyecto.responsable,
                                proyecto._id ));
  }


  busqueda( tipo: 'usuarios' | 'alumnos' | 'dependencias' | 'proyectos',
            termino: string ): Observable<any> {

    const url = `${ base_url }/busqueda/coleccion/${ tipo }/${ termino }`;

    return this.http.get( url )
                .pipe(
                  map( (resp: any) => {

                    switch ( tipo ) {

                      case 'usuarios':
                        return this.transformarUsuarios( resp.respuesta );

                      case 'dependencias':
                        return this.transformarDependencias( resp.respuesta );

                      case 'alumnos':
                        return this.transformarAlumnos( resp.respuesta );

                      case 'proyectos':
                        return this.transformarProyectos( resp.respuesta );

                      default:
                        return [];
                    }

                  })
                );
  }


}
