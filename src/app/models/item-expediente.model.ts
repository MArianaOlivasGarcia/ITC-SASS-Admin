import { Alumno } from "./alumno.model";
import { Expediente } from "./expediente.model";


export class ItemExpediente {

    constructor(
        public numero: number,
        public expediente: Expediente,
        public titulo: string,
        public codigo: string,
        public archivoTemp: string,
        public archivo: string,
        public aceptado: boolean,
        public rechazado: boolean,
        public pendiente: boolean,
        public disponible: boolean,
        public entrante: boolean,
        public proceso?: boolean,
        public iniciado?: boolean,
        public finalizado?: boolean,
        public reenvio_required?: boolean,
        public fecha_inicial?: Date,
        public fecha_limite?: Date,
        public fecha_entrega?: Date,
        public fecha_aprobacion?: Date,
        public error?: { 
            observacion: string, 
            motivo: string,
        },
        public alumno?: Alumno,
        public _id?: string ){}

    get archivoSrc(): string {
        if( this.archivo ){
            console.log('archivo')
            return `https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf`;
        }
    }

}