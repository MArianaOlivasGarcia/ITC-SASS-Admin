import { Alumno } from "./alumno.model";
import { Proyecto } from "./proyecto.models";
import { Usuario } from "./usuario.model";


export class Solicitud {

    constructor(
        public alumno: Alumno,
        public proyecto: Proyecto,
        public pendiente?: boolean,
        public rechazado?: boolean,
        public aceptado?: boolean,
        public valido?: Usuario,
        public created_at?: Date,
        public _id?: string
    ){}

}