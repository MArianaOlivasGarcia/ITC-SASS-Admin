import { Alumno } from "./alumno.model";
import { ItemExpediente } from "./item-expediente.model";


export class Expediente {

    constructor(
        public alumno?: Alumno,
        public items?: ItemExpediente[],
        public fecha_inicio?: Date,
        public fecha_termino?: Date,
        public _id?: string
    ){}


    
} 