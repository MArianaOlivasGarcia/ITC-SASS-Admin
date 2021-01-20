
export class Periodo {

    constructor(
        public fecha_inicio: Date,
        public fecha_termino: Date,
        public nombre?: string,
        public isActual?: boolean,
        public _id?: string
    ){}
}
