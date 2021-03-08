import { Carrera } from "./carrera.model";

export class ItemCarreraProyecto {

    constructor(
        public cantidad: number,
        public disponibilidad: number,
        public carrera: Carrera,
        public _id?: string,
    ){}

}