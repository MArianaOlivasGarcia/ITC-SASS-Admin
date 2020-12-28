import { Carrera } from './carrera.model';
import { Dependencia } from './dependencia.model';


export class Proyecto {

    constructor(
        // tslint:disable: variable-name
        public apoyo_economico: string,
        public nombre: string,
        public dependencia: Dependencia,
        public objetivo: string,
        public actividades: string,
        public periodo: string,
        public lugar: string,
        public modalidad: string,
        public horario: string,
        public tipo: string,
        public responsable: string,
        public carreras?: Carrera[],
        public _id?: string,
    ){}

}
