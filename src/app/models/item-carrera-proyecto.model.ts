import { Carrera } from "./carrera.model";
import { Proyecto } from "./proyecto.models";


export class ItemCarreraProyecto {

    constructor(
        public cantidad: number,
        public carrera: Carrera
    ){}

}