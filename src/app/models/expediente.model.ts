import { Alumno } from "./alumno.model";
import { ItemExpediente } from "./item-expediente.model";
import { Periodo } from "./periodo.model";


export class Expediente {

    constructor(
        public alumno?: Alumno,
        public items?: ItemExpediente[],
        public apertura?: Date,
        public cierre?: Date,
        public periodo?: Periodo,
        public finalizado?: boolean,
        public _id?: string
    ){}


    
} 