import { Alumno } from "./alumno.model";
import { ItemExpediente } from "./item-expediente.model";


export class Expediente {

    constructor(
        public alumno?: Alumno,
        public items?: ItemExpediente[],
        public apertura?: Date,
        public cierre?: Date,
        public _id?: string
    ){}


    
} 