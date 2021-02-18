
export class Periodo {

    constructor(
        public fecha_inicio: Date,
        public fecha_termino: Date,
        public nombre?: string,
        public isActual?: boolean,
        public isProximo?: boolean,
        public recepcion_solicitudes?: {
            fecha_inicio: Date,
            fecha_termino: Date,
        },
        public apertura_expedientes?: boolean,
        public _id?: string
    ){}
}
