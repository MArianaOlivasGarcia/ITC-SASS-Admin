import { Alumno } from "./alumno.model";
import { Proyecto } from "./proyecto.models";
import { Usuario } from "./usuario.model";


export class Solicitud {

    constructor(
        public alumno: Alumno,
        public proyecto: Proyecto,
        public usuario_valido?: Usuario,
        public inicio_servicio?: Date,
        public termino_servicio?: Date,
        public pendiente?: boolean,
        public aceptado?: boolean,        
        public rechazado?: boolean,
        public fecha_solicitud?: Date,
        public error?: {
            motivo: string,
            observacion: string
        },
        public fecha_validacion?: Date,
        public _id?: string
    ){}

}