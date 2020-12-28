import { Alumno } from '../models/alumno.model';

export interface CargarAlumnos {

    total: number;
    alumnos: Alumno[];

}