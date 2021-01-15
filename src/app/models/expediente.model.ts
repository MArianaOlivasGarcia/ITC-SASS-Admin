import { ItemExpediente } from "./item-expediente.model";
import { Usuario } from "./usuario.model";


export class Expediente {

    constructor(
        public created_at?: Date,
        public items?: ItemExpediente[],
        public finished_at?: Date,
        public alumno?: Usuario,
        public _id?: string
    ){}

} 