import { Alumno } from './alumno.model';
import { Dependencia } from './dependencia.model';
import { ItemCarreraProyecto } from './item-carrera-proyecto.model';
import { Periodo } from './periodo.model';


export class Proyecto {

    constructor(
        public apoyo_economico: boolean,
        public instalacion: boolean,
        public nombre: string,
        public dependencia: Dependencia,
        public objetivo: string,
        public actividades: string,
        public tipo_actividades: string,
        public periodo: Periodo,
        public fecha_inicial: Date,
        public fecha_limite: Date,
        public lugar_desempeno: string,
        public modalidad: string,
        public horario: string,
        public tipo: string,
        public responsable: string,
        public puesto_responsable: string,
        public email_responsable: string,
        public telefono_responsable: string,
        public carreras: ItemCarreraProyecto[] = [],
        public publico?: boolean,
        public alumno?: Alumno,
        public _id?: string,
        public adoptado?: boolean,
    ){}

}
