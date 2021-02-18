import { Alumno } from '../models/alumno.model';
import { Proyecto } from '../models/proyecto.models';

export interface CargarAlumnosProyecto {

    total: number;
    proyecto: Proyecto;
    alumnos: Alumno[];

}